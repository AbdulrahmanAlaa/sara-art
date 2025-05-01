const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const THUMBNAIL_WIDTH = 400;
const THUMBNAIL_HEIGHT = 300;

// Configure sharp with lower memory usage
sharp.queue.on('change', function (queueLength) {
    if (queueLength > 10) {
        sharp.cache(false);
    }
});

async function processImageWithRetry(inputPath, thumbnailPath, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await sharp(inputPath, {
                limitInputPixels: 0,
                sequentialRead: true
            })
                .rotate() // Auto-rotate based on EXIF
                .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
                    fit: 'cover',
                    position: 'center',
                    withoutEnlargement: true
                })
                .jpeg({
                    quality: 80,
                    progressive: true,
                    optimizeScans: true,
                    chromaSubsampling: '4:2:0'
                })
                .toBuffer()
                .then(buffer => fs.writeFile(thumbnailPath.replace(/\.[^.]+$/, '.jpg'), buffer));

            return true;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed for ${inputPath}:`, error.message);
            // Clear cache between attempts
            sharp.cache(false);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
        }
    }
}

async function generateThumbnail(inputPath) {
    try {
        const ext = path.extname(inputPath).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) return;

        const dir = path.dirname(inputPath);
        const filename = path.basename(inputPath, ext);
        const thumbnailDir = path.join(dir, 'thumbnails');
        const thumbnailPath = path.join(thumbnailDir, `${filename}${ext}`);

        await fs.mkdir(thumbnailDir, { recursive: true });
        await processImageWithRetry(inputPath, thumbnailPath);
        console.log(`Generated thumbnail for ${inputPath}`);
    } catch (error) {
        console.error(`Failed to process ${inputPath}:`, error.message);
    }
}

async function walkDirectory(dir) {
    const files = await fs.readdir(dir);

    // Process files in batches to avoid memory issues
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        await Promise.all(batch.map(async (file) => {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) {
                if (file !== 'thumbnails') {
                    await walkDirectory(filePath);
                }
            } else {
                await generateThumbnail(filePath);
            }
        }));

        // Clear memory after each batch
        sharp.cache(false);
        global.gc && global.gc();
    }
}

async function main() {
    const projectRoot = path.resolve(__dirname, '..');
    const imagesDir = path.join(projectRoot, 'src', 'assets', 'images', 'projects');

    try {
        await walkDirectory(imagesDir);
        console.log('Thumbnail generation complete');
    } catch (error) {
        console.error('Error during thumbnail generation:', error);
        process.exit(1);
    }
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});

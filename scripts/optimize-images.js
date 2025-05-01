import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Sharp to handle large images
sharp.cache(false);
sharp.concurrency(1);

const processImage = async (filePath, outputPath) => {
    try {
        let sharpInstance = sharp(filePath, {
            limitInputPixels: false // Remove pixel limit
        });

        const metadata = await sharpInstance.metadata();

        // If image is very large, resize it first
        if (metadata.width * metadata.height > 40000000) { // 40MP threshold
            const scale = Math.sqrt(40000000 / (metadata.width * metadata.height));
            const newWidth = Math.floor(metadata.width * scale);
            const newHeight = Math.floor(metadata.height * scale);

            sharpInstance = sharpInstance.resize(newWidth, newHeight, {
                fit: 'inside'
            });
        } else if (metadata.width > 1200 || metadata.height > 1200) {
            sharpInstance = sharpInstance.resize(1200, 1200, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        await sharpInstance
            .webp({
                quality: 80,
                effort: 6,
                lossless: false
            })
            .toFile(outputPath);

        return true;
    } catch (err) {
        console.error(`Error processing ${path.basename(filePath)}:`, err.message);
        return false;
    }
};

const processImages = async () => {
    const imageDir = path.join(__dirname, '../src/assets/images');

    try {
        const processDirectory = async (dirPath) => {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);

                if (entry.isDirectory()) {
                    await processDirectory(fullPath);
                    continue;
                }

                if (!/\.(jpg|jpeg|png)$/i.test(entry.name)) continue;

                const outputPath = fullPath.replace(/\.[^.]+$/, '.webp');
                const result = await processImage(fullPath, outputPath);

                if (result) {
                    console.log(`Processed: ${path.relative(imageDir, fullPath)} -> ${path.basename(outputPath)}`);
                }
            }
        };

        await processDirectory(imageDir);

    } catch (err) {
        console.error('Error reading directory:', err);
        process.exit(1);
    }
};

processImages().catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
});

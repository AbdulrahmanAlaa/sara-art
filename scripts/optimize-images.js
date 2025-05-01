// @ts-check
// @package-type module

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

async function processImage(inputPath) {
    try {
        const ext = path.extname(inputPath).toLowerCase();
        if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

        const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

        await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPath);

        console.log(`Converted ${inputPath} to WebP`);
    } catch (error) {
        console.error(`Error processing ${inputPath}:`, error);
    }
}

async function walkDirectory(dir) {
    const files = await fs.readdir(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
            await walkDirectory(filePath);
        } else {
            await processImage(filePath);
        }
    }
}

async function main() {
    const imagesDir = path.join(projectRoot, 'src', 'assets', 'images');
    await walkDirectory(imagesDir);
    console.log('Image optimization complete');
}

main().catch(console.error);

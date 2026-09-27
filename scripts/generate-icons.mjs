/* Generate PWA icons from logo.svg */
// @ts-nocheck - Simple utility script
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGO_PATH = path.join(__dirname, "../public/logo.svg");
const OUTPUT_DIR = path.join(__dirname, "../public");

async function generateIcons() {
  if (!fs.existsSync(LOGO_PATH)) {
    console.log("logo.svg not found, skipping icon generation");
    return;
  }

  const svgBuffer = fs.readFileSync(LOGO_PATH);

  const sizes = [
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
    { name: "icon-512-maskable.png", size: 512, padding: 0.1 },
    { name: "apple-touch-icon.png", size: 180 },
  ];

  for (const { name, size, padding } of sizes) {
    const outputPath = path.join(OUTPUT_DIR, name);

    let pipeline = sharp(svgBuffer).resize(size, size);

    if (padding) {
      const innerSize = Math.floor(size * (1 - padding * 2));
      const inner = await sharp(svgBuffer)
        .resize(innerSize, innerSize)
        .png()
        .toBuffer();

      pipeline = sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 28, g: 25, b: 23, alpha: 1 },
        },
      }).composite([
        {
          input: inner,
          gravity: "center",
        },
      ]);
    }

    await pipeline.png().toFile(outputPath);
    console.log(`✓ Generated ${name}`);
  }
}

generateIcons().catch(console.error);

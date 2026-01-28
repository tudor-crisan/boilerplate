/*
  Usage: node scripts/images-to-pdf.js <folder_path> [output_filename]
  Example: node scripts/images-to-pdf.js ./my-images apocalypse.pdf
  
  Dependencies:
  - pdfkit: PDF generation
  - sharp: Professional image processing (Darkening text, clean background)
*/

import fs from "fs";
import path from "path";

// --- Dynamic Imports for Lint Compliance ---
let PDFDocument;
try {
  const importedModule = await import("pdfkit");
  PDFDocument = importedModule.default;
} catch {
  console.error("\x1b[31mError: pdfkit is not installed.\x1b[0m");
  console.error("Please run: npm install pdfkit");
  process.exit(1);
}

let sharp;
try {
  const importedModule = await import("sharp");
  sharp = importedModule.default;
} catch {
  console.error("\x1b[31mError: sharp is not installed.\x1b[0m");
  console.error("Please run: npm install sharp");
  process.exit(1);
}

// --- CLI Arguments ---
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log(
    "\x1b[33mUsage: node scripts/images-to-pdf.js <folder_path> [output_filename]\x1b[0m",
  );
  process.exit(1);
}

const folderPath = path.resolve(args[0]);
const outputFilename = args[1] || "output.pdf";
const outputPath = path.resolve(process.cwd(), outputFilename);

if (!fs.existsSync(folderPath)) {
  console.error(`\x1b[31mFolder not found: ${folderPath}\x1b[0m`);
  process.exit(1);
}

async function createPdf() {
  const doc = new PDFDocument({ autoFirstPage: false });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  let files;
  try {
    files = fs.readdirSync(folderPath);
  } catch (err) {
    console.error(`\x1b[31mError reading directory: ${err.message}\x1b[0m`);
    process.exit(1);
  }

  // Find valid JPG/JPEG images
  const jpgFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ext === ".jpg" || ext === ".jpeg";
  });

  if (jpgFiles.length === 0) {
    console.error(
      "\x1b[31mNo .jpg or .jpeg files found in the specified folder.\x1b[0m",
    );
    process.exit(1);
  }

  // Natural sort (1, 2, 10 instead of 1, 10, 2)
  jpgFiles.sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  );

  console.log(
    `\x1b[36mFound ${jpgFiles.length} images. Optimizing and generating PDF...\x1b[0m`,
  );

  for (const file of jpgFiles) {
    const filePath = path.join(folderPath, file);

    try {
      /**
       * Image Processing Optimization (Aggressive Levels):
       * 1. Grayscale: Remove color noise.
       * 2. Linear (5.0, -1100):
       *    - Targets the very light range [220, 255] where text is hiding.
       *    - Drastically pulls faint grays down towards black.
       * 3. Normalize: Final stretch to ensure pure black/white.
       * 4. Resize: Limit width to 1600px.
       */
      const processedBuffer = await sharp(filePath)
        .grayscale()
        .linear(5.0, -1100) // Aggressively darken faint text
        .normalize() // Full dynamic range stretch
        .resize({ width: 1600, withoutEnlargement: true })
        .toFormat("jpeg", { quality: 85 }) // Very high quality
        .toBuffer();

      const img = doc.openImage(processedBuffer);

      doc.addPage({ size: [img.width, img.height] });
      doc.image(img, 0, 0);

      console.log(`\x1b[32m✔ Added ${file}\x1b[0m`);
    } catch (err) {
      console.error(
        `\x1b[31m✘ Error processing ${file}: ${err.message}\x1b[0m`,
      );
    }
  }

  doc.end();

  await new Promise((resolve) => {
    stream.on("finish", () => {
      console.log(
        `\n\x1b[32m✔ PDF successfully created at: ${outputPath}\x1b[0m`,
      );
      resolve();
    });
    stream.on("error", (err) => {
      console.error("\x1b[31m✘ Error writing PDF:\x1b[0m", err);
      resolve();
    });
  });
}

createPdf().catch((err) => {
  console.error("\x1b[31mFatal Error:\x1b[0m", err);
  process.exit(1);
});

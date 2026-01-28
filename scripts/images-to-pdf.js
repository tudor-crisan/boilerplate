/*
  Usage: node scripts/images-to-pdf.js <folder_path> [output_filename]
  Example: node scripts/images-to-pdf.js ./my-images output.pdf
  
  Dependencies:
  npm install pdfkit
*/

import fs from "fs";
import path from "path";

let PDFDocument;
try {
  const importedModule = await import("pdfkit");
  PDFDocument = importedModule.default;
} catch {
  console.error("\x1b[31mError: pdfkit is not installed.\x1b[0m");
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

const args = process.argv.slice(2);
if (args.length < 1) {
  console.log(
    "Usage: node scripts/images-to-pdf.js <folder_path> [output_filename]",
  );
  process.exit(1);
}

const folderPath = path.resolve(args[0]);
const outputFilename = args[1] || "output.pdf";
const outputPath = path.resolve(process.cwd(), outputFilename);

if (!fs.existsSync(folderPath)) {
  console.error(`Folder not found: ${folderPath}`);
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
    console.error(`Error reading directory: ${err.message}`);
    process.exit(1);
  }

  const jpgFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ext === ".jpg" || ext === ".jpeg";
  });

  if (jpgFiles.length === 0) {
    console.error("No .jpg or .jpeg files found in the specified folder.");
    process.exit(1);
  }

  jpgFiles.sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  );

  console.log(
    `Found ${jpgFiles.length} images. Processing and generating PDF...`,
  );

  // Contrast adjustment: Dual approach
  // 1. Gamma(2.0): Darkens midtones heavily (makes faint text dark)
  // 2. Linear(2.0, -100): Increases contrast to push the now-dark text to black
  //    and pushes the now-gray background back to white.
  
  for (const file of jpgFiles) {
    const filePath = path.join(folderPath, file);

    try {
      const processedBuffer = await sharp(filePath)
        .grayscale()
        .gamma(2.0)                // Darken everything (text becomes distinct from white)
        .linear(2.0, -100)         // Contrast stretch: Clip background to white again
        .sharpen()
        .resize({ width: 1500, withoutEnlargement: true })
        .toFormat("jpeg", { quality: 60 })
        .toBuffer();

      // Open image from buffer to get dimensions for PDFKit
      const img = doc.openImage(processedBuffer);

      doc.addPage({ size: [img.width, img.height] });
      doc.image(img, 0, 0);

      console.log(`Added ${file} (Enhanced visibility)`);
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  }

  doc.end();

  await new Promise((resolve) => {
    stream.on("finish", () => {
      console.log(`\nPDF successfully created at: ${outputPath}`);
      resolve();
    });
    stream.on("error", (err) => {
      console.error("Error writing PDF:", err);
      resolve();
    });
  });
}

createPdf().catch(console.error);

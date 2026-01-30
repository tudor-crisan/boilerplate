import fs from "fs";
import { createRequire } from "module";
import path from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CV_DIR = path.join(__dirname, "../cv");

const MODE = process.argv[2]; // 'extract' or 'generate'

async function extract() {
  console.log("Starting extraction...");
  const files = ["cv-english", "cv-romana"];

  for (const file of files) {
    const pdfPath = path.join(CV_DIR, `${file}.pdf`);
    const mdPath = path.join(CV_DIR, `${file}.md`);

    if (fs.existsSync(pdfPath)) {
      const dataBuffer = fs.readFileSync(pdfPath);
      try {
        const data = await pdf(dataBuffer);
        // Basic cleanup of extracted text
        const text = data.text
          .replace(/\n\s*\n/g, "\n\n") // Normalize paragraphs
          .trim();

        fs.writeFileSync(mdPath, text);
        console.log(`Extracted ${file}.pdf to ${file}.md`);
      } catch (err) {
        console.error(`Error extracting ${file}.pdf:`, err);
      }
    } else {
      console.warn(`File not found: ${pdfPath}`);
    }
  }
}

import { marked } from "marked";
import { PDFDocument } from "pdf-lib";

async function generate() {
  console.log("Starting generation with PDF merge...");
  const files = ["cv-english", "cv-romana"];

  const browser = await puppeteer.launch();

  for (const file of files) {
    const mdPath = path.join(CV_DIR, `${file}.md`);
    const originalPdfPath = path.join(CV_DIR, `${file}.pdf`);
    const pdfPath = path.join(CV_DIR, `${file}-v2.pdf`);

    if (fs.existsSync(mdPath)) {
      let content = fs.readFileSync(mdPath, "utf-8");

      // Process images (like Loyalboards)
      content = content.replace(
        /!\[(.*?)\]\((.*?)\)/g,
        (match, alt, imgPath) => {
          try {
            let absolutePath = imgPath;
            if (!path.isAbsolute(imgPath)) {
              absolutePath = path.join(CV_DIR, imgPath);
            }
            absolutePath = path.normalize(absolutePath);

            if (fs.existsSync(absolutePath)) {
              const imgBuffer = fs.readFileSync(absolutePath);
              const base64 = imgBuffer.toString("base64");
              const ext = path.extname(absolutePath).substring(1);
              return `<img src="data:image/${ext};base64,${base64}" alt="${alt}" style="max-width:100%; border-radius: 8px; margin: 10px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />`;
            }
            return match;
          } catch (e) {
            return match;
          }
        },
      );

      const htmlBody = marked.parse(content);
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
                font-family: 'Helvetica', 'Arial', sans-serif; 
                line-height: 1.5; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 40px; 
                color: #333;
            }
            h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0; }
            h2 { color: #34495e; margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px; page-break-after: avoid; }
            h3 { color: #7f8c8d; margin-top: 20px; page-break-after: avoid; }
            a { color: #3498db; text-decoration: none; }
            ul { padding-left: 20px; }
            li { margin-bottom: 5px; }
            strong { color: #2c3e50; font-weight: bold; }
            img { max-width: 100%; page-break-inside: avoid; }
            .container { background: white; }
            @page { margin: 40px; }
          </style>
        </head>
        <body>
          <div class="container">
            ${htmlBody}
          </div>
        </body>
        </html>
      `;

      // 1. Generate new content PDF in memory
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      const generatedPdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "40px", bottom: "40px" },
      });
      await page.close();

      // 2. Load documents
      const pdfDoc = await PDFDocument.create();
      const generatedDoc = await PDFDocument.load(generatedPdfBuffer);

      // Copy all pages from generating doc
      const copiedPages = await pdfDoc.copyPages(
        generatedDoc,
        generatedDoc.getPageIndices(),
      );
      copiedPages.forEach((page) => pdfDoc.addPage(page));

      // 3. Merge original pages 3, 4, 5 if they exist
      if (fs.existsSync(originalPdfPath)) {
        const originalBytes = fs.readFileSync(originalPdfPath);
        const originalDoc = await PDFDocument.load(originalBytes);
        const totalOriginalPages = originalDoc.getPageCount();

        // User requested pages 3, 4, 5. Indices are 2, 3, 4.
        // Check bounds
        const indicesToCopy = [2, 3, 4].filter((i) => i < totalOriginalPages);

        if (indicesToCopy.length > 0) {
          const originalPages = await pdfDoc.copyPages(
            originalDoc,
            indicesToCopy,
          );
          originalPages.forEach((page) => pdfDoc.addPage(page));
          console.log(
            `Merged ${indicesToCopy.length} pages from original PDF.`,
          );
        } else {
          console.warn(
            "Original PDF didn't have enough pages to merge 3, 4, 5.",
          );
        }
      }

      // 4. Save
      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(pdfPath, pdfBytes);
      console.log(`Generated and merged ${file}-v2.pdf`);
    } else {
      console.warn(`Markdown file not found: ${mdPath}`);
    }
  }

  await browser.close();
}

if (MODE === "extract") {
  extract();
} else if (MODE === "generate") {
  generate();
} else if (MODE === "extract-images") {
  extractImages();
} else {
  console.log(
    "Usage: node scripts/update-cv.mjs [extract|generate|extract-images]",
  );
}

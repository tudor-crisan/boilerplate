import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const directoryPath = path.join(
    process.cwd(),
    "public/assets/video/loyalboards",
  );

  try {
    const files = await fs.promises.readdir(directoryPath);
    // Filter for image files
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file),
    );
    return NextResponse.json({ images: imageFiles });
  } catch (error) {
    console.error("Error reading directory:", error);
    return NextResponse.json(
      { error: "Unable to scan directory" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_"); // Sanitize
    const filePath = path.join(
      process.cwd(),
      "public/assets/video/loyalboards",
      filename,
    );

    await fs.promises.writeFile(filePath, buffer);

    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error("Error saving file:", error);
    return NextResponse.json({ error: "Error saving file" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { filename } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: "Filename required" }, { status: 400 });
    }

    // Security check to prevent directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(
      process.cwd(),
      "public/assets/video/loyalboards",
      safeFilename,
    );

    await fs.promises.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Error deleting file" }, { status: 500 });
  }
}

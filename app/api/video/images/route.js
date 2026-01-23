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
    // Filter for image files if needed, for now just returning all files
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

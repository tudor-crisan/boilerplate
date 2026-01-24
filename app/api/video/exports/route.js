import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: "Video ID is required" },
        { status: 400 },
      );
    }

    const exportsDir = path.join(process.cwd(), "public/exports");

    // Check if directory exists
    try {
      await fs.access(exportsDir);
    } catch {
      return NextResponse.json({ success: true, exports: [] });
    }

    const files = await fs.readdir(exportsDir);

    // Filter files matching the videoId pattern: videoId_timestamp.mp4
    // or just beginning with videoId if we want to be looser
    const matchingFiles = await Promise.all(
      files
        .filter(
          (file) => file.startsWith(`${videoId}_`) && file.endsWith(".mp4"),
        )
        .map(async (file) => {
          const stats = await fs.stat(path.join(exportsDir, file));
          return {
            filename: file,
            path: `/exports/${file}`,
            createdAt: stats.ctime,
            size: stats.size,
          };
        }),
    );

    // Sort by newest first
    matchingFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Check for active export progress
    let activeExport = null;
    const progressFile = `.progress-${videoId}.json`;
    const progressPath = path.join(exportsDir, progressFile);
    try {
      const stats = await fs.stat(progressPath);
      const now = Date.now();
      const fileAge = now - stats.mtimeMs;

      // If stale (older than 10s), delete it. Script updates every ~1s.
      if (fileAge > 10000) {
        await fs.unlink(progressPath);
      } else {
        const progressContent = await fs.readFile(progressPath, "utf-8");
        activeExport = JSON.parse(progressContent);
      }
    } catch (e) {
      // No active export or error reading
    }

    return NextResponse.json({
      success: true,
      exports: matchingFiles,
      activeExport,
    });
  } catch (error) {
    console.error("Failed to list exports:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { success: false, error: "Filename is required" },
        { status: 400 },
      );
    }

    // Security check: ensure no directory traversal
    if (
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid filename" },
        { status: 400 },
      );
    }

    const exportsDir = path.join(process.cwd(), "public/exports");
    const filePath = path.join(exportsDir, filename);

    await fs.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete export:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

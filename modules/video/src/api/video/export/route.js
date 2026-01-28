import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const { videoId, styling } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: "Video ID is required" },
        { status: 400 },
      );
    }

    // Run the script in the background
    const scriptPath = path.resolve(process.cwd(), "scripts/export-video.js");

    // Generate unique filename: videoId_timestamp.mp4
    const timestamp = Date.now();
    const filename = `${videoId}_${timestamp}.mp4`;

    // Using node to spawn the script
    const exportsDir = path.join(process.cwd(), "public/exports");
    const logPath = path.join(exportsDir, "debug.log");

    // Ensure directory exists
    try {
      await fsPromises.mkdir(exportsDir, { recursive: true });
    } catch {}

    // Write styling config to a temp file for the script to pick up
    if (styling) {
      const stylePath = path.join(exportsDir, `.style-${videoId}.json`);
      await fsPromises.writeFile(stylePath, JSON.stringify(styling));
    }

    const out = fs.openSync(logPath, "a");
    const err = fs.openSync(logPath, "a");

    const child = spawn("node", [scriptPath, videoId, filename], {
      detached: true,
      stdio: ["ignore", out, err],
    });

    child.unref();

    return NextResponse.json({
      success: true,
      message: "Export started in background. Check back later.",
    });
  } catch (error) {
    console.error("Failed to start export:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

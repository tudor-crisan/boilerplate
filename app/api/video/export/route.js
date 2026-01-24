import { NextResponse } from "next/server";
import { spawn } from "child_process";
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
      await fs.mkdir(exportsDir, { recursive: true });
    } catch (e) {}

    // Write styling config to a temp file for the script to pick up
    if (styling) {
      const stylePath = path.join(exportsDir, `.style-${videoId}.json`);
      // We use native fs for sync writing or just await promises version since we are async here
      const fsPromises = require("fs/promises");
      await fsPromises.writeFile(stylePath, JSON.stringify(styling));
    }

    // We need 'fs' from 'fs' not 'fs/promises' for openSync if we want sync,
    // but here we are in async function.
    // Actually, spawn requires numeric FDs for stdio, so we need fs.openSync from 'fs'.
    // Let's import 'fs' dynamically or just use the promises one? No, promises return FileHandle, not fd integer directly usually (check node version).
    // Safer to import regular fs.
    const fsNative = require("fs");
    const out = fsNative.openSync(logPath, "a");
    const err = fsNative.openSync(logPath, "a");

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

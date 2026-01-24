import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(request) {
  try {
    const { videoId } = await request.json();

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
    const logPath = path.join(process.cwd(), "public/exports", "debug.log");
    // Ensure directory exists
    try {
      await fs.mkdir(path.dirname(logPath), { recursive: true });
    } catch (e) {}

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

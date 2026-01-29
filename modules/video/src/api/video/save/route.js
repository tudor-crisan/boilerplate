import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();
    const { appId, videoId, videoData } = body;

    if (!appId || !videoId || !videoData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Determine file path based on appId
    // In a real app, this might be dynamic or from a config.
    // For this task, we map widely used apps or default to a structure.
    let relativePath = "";
    if (appId === "loyalboards") {
      relativePath = "apps/loyalboards/video.json";
    } else {
      // Fallback or error? We'll assume strict structure for now.
      relativePath = `apps/${appId}/video.json`;
    }

    const filePath = path.join(process.cwd(), relativePath);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read existing file
    const fileContent = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(fileContent);

    // Find and update the video
    const videoIndex = json.videos.findIndex((v) => v.id === videoId);

    if (videoIndex === -1) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Update the video object.
    // We merge existing with new data to prevent losing fields we might not be sending?
    // Or we replace the specific fields we care about.
    // videoData should ideally contain the full updated video object or strict subset.
    // Let's rely on the frontend sending the complete configured video object or merge.
    // Based on requirements, we are saving volumes and slides.

    // Safety: ensure we keep ID and format fixed if not intended to change.
    json.videos[videoIndex] = {
      ...json.videos[videoIndex],
      ...videoData,
    };

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving video:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

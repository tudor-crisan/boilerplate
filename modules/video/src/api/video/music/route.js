import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const appId = formData.get("appId");
    const videoId = formData.get("videoId");
    const isGlobal = formData.get("isGlobal") === "true";

    if (!file || !appId || !videoId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${appId}_${videoId}_music_${Date.now()}.mp3`;

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "music");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const publicPath = `/uploads/music/${fileName}`;

    // Update JSON
    const jsonPath = path.join(
      process.cwd(),
      "data",
      "apps",
      appId,
      "video.json",
    );

    if (fs.existsSync(jsonPath)) {
      const fileContent = fs.readFileSync(jsonPath, "utf8");
      const data = JSON.parse(fileContent);

      const videoIndex = data.videos.findIndex((v) => v.id === videoId);
      if (videoIndex !== -1) {
        // If it's global music for the video
        if (isGlobal) {
          data.videos[videoIndex].music = publicPath;
        }

        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
      }
    }

    return NextResponse.json({ success: true, path: publicPath });
  } catch (error) {
    console.error("Error uploading music:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

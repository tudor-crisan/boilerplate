import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const getFilePath = () => {
  const appName = process.env.NEXT_PUBLIC_APP || "loyalboards"; // Fallback just in case
  return path.join(process.cwd(), "data/apps", appName, "video.json");
};

export async function GET() {
  try {
    const filePath = getFilePath();
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json({ success: true, videos: data.videos });
  } catch (error) {
    console.error("Failed to get videos:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const videoData = await request.json();
    const filePath = getFilePath();
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    const index = data.videos.findIndex((v) => v.id === videoData.id);

    if (index !== -1) {
      data.videos[index] = videoData;
    } else {
      data.videos.push(videoData);
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save video:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("id");

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: "Video ID is required" },
        { status: 400 },
      );
    }

    const filePath = getFilePath();
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    const newVideos = data.videos.filter((v) => v.id !== videoId);

    if (newVideos.length === data.videos.length) {
      return NextResponse.json(
        { success: false, error: "Video not found" },
        { status: 404 },
      );
    }

    data.videos = newVideos;

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete video:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

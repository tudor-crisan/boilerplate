import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Helper to get data file path for specific app
function getDataFilePath(app) {
  return path.join(process.cwd(), `apps/${app}/submitter.json`);
}

const DIRECTORIES_FILE = path.join(process.cwd(), "lists/directories.js");

// Helper to read data
async function readData(app) {
  try {
    const dataFile = getDataFilePath(app);
    const content = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(content);
  } catch {
    return {
      directories: [],
      submissions: [],
      preferences: { hideMedia: false, blackAndWhite: false },
    };
  }
}

// Helper to read directories from lists/directories.js
async function readDirectoriesList() {
  try {
    const content = await fs.readFile(DIRECTORIES_FILE, "utf-8");
    // Extract URLs from the JS file
    const matches = content.match(/"(https?:\/\/[^"]+)"/g);
    if (matches) {
      return matches.map((m) => m.replace(/"/g, ""));
    }
    return [];
  } catch (error) {
    console.error("Failed to read directories.js:", error);
    return [];
  }
}

// GET: Retrieve all directories (merged from lists and custom additions)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const app = searchParams.get("app") || "loyalboards"; // Default to loyalboards

    const [defaultUrls, data] = await Promise.all([
      readDirectoriesList(),
      readData(app),
    ]);

    // Create directory objects from default list
    const directories = defaultUrls.map((url) => {
      // Check if this directory has custom data or submission status
      const customDir = data.directories.find((d) => d.url === url);
      const submission = data.submissions.find((s) => s.directoryUrl === url);

      return {
        url,
        name: customDir?.name || new URL(url).hostname,
        submitted: submission ? true : customDir?.submitted || false,
        submittedDate:
          submission?.submittedDate || customDir?.submittedDate || null,
        addedDate: customDir?.addedDate || null,
        removed: customDir?.removed || false,
        isCustom: false,
      };
    });

    // Add custom directories that aren't in the default list
    data.directories.forEach((dir) => {
      if (!defaultUrls.includes(dir.url) && !dir.removed) {
        directories.push({
          ...dir,
          isCustom: true,
        });
      }
    });

    // Filter out removed directories
    const activeDirectories = directories.filter((d) => !d.removed);

    return NextResponse.json({
      directories: activeDirectories,
      total: activeDirectories.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch directories", details: error.message },
      { status: 500 },
    );
  }
}

// POST: Add a new custom directory
export async function POST(request) {
  try {
    const body = await request.json();
    const { app, url, name } = body;

    if (!app || !url) {
      return NextResponse.json(
        { error: "Missing required fields: app, url" },
        { status: 400 },
      );
    }

    const data = await readData(app);

    // Check if directory already exists
    const exists = data.directories.find((d) => d.url === url);
    if (exists && !exists.removed) {
      return NextResponse.json(
        { error: "Directory already exists" },
        { status: 409 },
      );
    }

    // Add or restore directory
    if (exists) {
      exists.removed = false;
    } else {
      data.directories.push({
        url,
        name: name || new URL(url).hostname,
        submitted: false,
        submittedDate: null,
        addedDate: new Date().toISOString(),
        removed: false,
      });
    }

    const dataFile = getDataFilePath(app);
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      directory: data.directories.find((d) => d.url === url),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add directory", details: error.message },
      { status: 500 },
    );
  }
}

// DELETE: Mark a directory as removed
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const app = searchParams.get("app") || "loyalboards"; // Default to loyalboards
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "Missing required parameter: url" },
        { status: 400 },
      );
    }

    const data = await readData(app);

    const directory = data.directories.find((d) => d.url === url);
    if (directory) {
      directory.removed = true;
    } else {
      // Create entry to mark as removed
      data.directories.push({
        url,
        name: new URL(url).hostname,
        submitted: false,
        submittedDate: null,
        addedDate: new Date().toISOString(),
        removed: true,
      });
    }

    const dataFile = getDataFilePath(app);
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Directory marked as removed",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove directory", details: error.message },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Helper to get data file path for specific app
function getDataFilePath(app) {
  return path.join(process.cwd(), `data/apps/${app}/universal-submitter.json`);
}

// Helper to read data
async function readData(app) {
  try {
    const dataFile = getDataFilePath(app);
    const content = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(content);
  } catch {
    // If file doesn't exist, return default structure
    return {
      directories: [],
      submissions: [],
      preferences: {
        hideMedia: false,
        blackAndWhite: false,
      },
    };
  }
}

// Helper to write data
async function writeData(app, data) {
  const dataFile = getDataFilePath(app);
  // Ensure directory exists
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf-8");
}

// GET: Retrieve all data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const app = searchParams.get("app") || "loyalboards"; // Default to loyalboards

    const data = await readData(app);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read data", details: error.message },
      { status: 500 },
    );
  }
}

// POST: Update submission status
export async function POST(request) {
  try {
    const body = await request.json();
    const { app, directoryUrl, directoryName, pageUrl } = body;

    if (!app || !directoryUrl) {
      return NextResponse.json(
        { error: "Missing required fields: app, directoryUrl" },
        { status: 400 },
      );
    }

    const data = await readData(app);

    // Add submission record
    const submission = {
      app,
      directoryUrl,
      directoryName: directoryName || new URL(directoryUrl).hostname,
      submittedDate: new Date().toISOString(),
      pageUrl: pageUrl || directoryUrl,
    };

    data.submissions.unshift(submission);

    // Update directory status if it exists
    const directory = data.directories.find((d) => d.url === directoryUrl);
    if (directory) {
      directory.submitted = true;
      directory.submittedDate = submission.submittedDate;
    }

    await writeData(app, data);

    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save submission", details: error.message },
      { status: 500 },
    );
  }
}

// PUT: Update preferences or directory list
export async function PUT(request) {
  try {
    const body = await request.json();
    const { app, action, preferences, directory } = body;

    if (!app) {
      return NextResponse.json(
        { error: "Missing required field: app" },
        { status: 400 },
      );
    }

    const data = await readData(app);

    if (action === "updatePreferences" && preferences) {
      data.preferences = { ...data.preferences, ...preferences };
    } else if (action === "addDirectory" && directory) {
      const exists = data.directories.find((d) => d.url === directory.url);
      if (!exists) {
        data.directories.push({
          url: directory.url,
          name: directory.name || new URL(directory.url).hostname,
          submitted: false,
          submittedDate: null,
          addedDate: new Date().toISOString(),
          removed: false,
        });
      }
    } else if (action === "removeDirectory" && directory) {
      const dir = data.directories.find((d) => d.url === directory.url);
      if (dir) {
        dir.removed = true;
      }
    } else {
      return NextResponse.json(
        { error: "Invalid action or missing data" },
        { status: 400 },
      );
    }

    await writeData(app, data);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update data", details: error.message },
      { status: 500 },
    );
  }
}

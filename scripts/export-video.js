import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";
import { spawn } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

// Set paths
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

ffmpeg.setFfprobePath(ffprobeInstaller.path);

const args = process.argv.slice(2);
const videoId = args[0];
const outputFilename = args[1];

if (!videoId) {
  console.log("Usage: node scripts/export-video.js <videoId> [outputFilename]");
  process.exit(1);
}

const APP_URL = process.env.APP_URL || "http://localhost:3000";

async function fetchVideoData(videoId) {
  // Assuming running locally, we can perhaps just read the file if we know the app logic?
  // Accessing via API is safer to get the exact object if keys change.
  // Use dynamic import for node-fetch if needed or just use built-in fetch in Node 18+
  const res = await fetch(`${APP_URL}/api/video`);
  const data = await res.json();
  if (!data.success) throw new Error("Failed to fetch videos");
  const video = data.videos.find((v) => v.id === videoId);
  if (!video) throw new Error(`Video ${videoId} not found`);
  return video;
}

function getAbsolutePath(relativePath) {
  // Relative to public folder
  // If path starts with /, remove it
  const cleanPath = relativePath.startsWith("/")
    ? relativePath.slice(1)
    : relativePath;
  return path.join(process.cwd(), "public", cleanPath);
}

async function getAudioDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration); // in seconds
    });
  });
}

const progressPath = path.resolve(
  process.cwd(),
  "public/exports",
  `.progress-${videoId}.json`,
);

function updateProgress(percent, message, phase = "recording") {
  try {
    const data = JSON.stringify({
      videoId,
      phase, // 'recording' | 'encoding'
      percent,
      message,
      updatedAt: Date.now(),
    });
    fs.writeFileSync(progressPath, data);
  } catch (e) {
    console.error("Failed to write progress", e);
  }
}

async function exportVideo(videoId, outputFilename = "output.mp4") {
  console.log(`Starting export for video: ${videoId}`);
  updateProgress(0, "Starting export...", "initializing");

  try {
    // 1. Get Video Data & Calculate Timings
    const video = await fetchVideoData(videoId);
    const slides = video.slides || [];
    const defaultDurationMs = video.defaultDuration || 1000;

    let currentTimeMs = 0;
    const audioEvents = []; // { path, startMs, durationMs }

    console.log("Analyzing timeline...");
    updateProgress(0, "Analyzing timeline...", "initializing");

    for (const slide of slides) {
      // ... (existing audio analysis logic) ...
      if (slide.audio) {
        const audioPath = getAbsolutePath(slide.audio);
        try {
          if (fs.existsSync(audioPath)) {
            const durationSec = await getAudioDuration(audioPath);
            const durationMs = durationSec * 1000;

            audioEvents.push({
              path: audioPath,
              startMs: currentTimeMs,
              durationMs: durationMs,
            });

            currentTimeMs += durationMs;
          } else {
            console.warn(`Audio file missing: ${audioPath}`);
            currentTimeMs += defaultDurationMs;
          }
        } catch (e) {
          console.warn(`Error probing audio ${audioPath}:`, e);
          currentTimeMs += defaultDurationMs;
        }
      } else {
        const slideDur = slide.duration || defaultDurationMs;
        currentTimeMs += slideDur;
      }
    }

    const totalDurationMs = currentTimeMs;
    console.log(
      `Total estimated duration: ${(totalDurationMs / 1000).toFixed(2)}s`,
    );

    // 2. Launch Puppeteer
    updateProgress(0, "Launching browser...", "initializing");
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--window-size=1920,1080",
        "--autoplay-policy=no-user-gesture-required",
      ],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });

    const page = await browser.newPage();

    // Check for styling file and inject if exists
    const styleConfigPath = path.resolve(
      process.cwd(),
      "public/exports",
      `.style-${videoId}.json`,
    );

    if (fs.existsSync(styleConfigPath)) {
      try {
        const styleContent = fs.readFileSync(styleConfigPath, "utf-8");
        // We set this BEFORE navigation so it's available on mount
        await page.evaluateOnNewDocument((configStr) => {
          localStorage.setItem("styling-config", configStr);
        }, styleContent);
        console.log("Injected custom styling config");
      } catch (e) {
        console.error("Failed to inject styling", e);
      }
    }

    const renderUrl = `${APP_URL}/modules/preview/video/render?videoId=${videoId}`;

    console.log(`Navigating to ${renderUrl}...`);
    await page.goto(renderUrl, { waitUntil: "networkidle0" });

    // Robustly hide devtools using Puppeteer API
    await page.addStyleTag({
      content: `
        #devtools-indicator, #next-logo, [data-nextjs-toast], nextjs-portal {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `,
    });

    // Set Viewport ...
    const dimensions = await page.evaluate(() => {
      const frame = document.getElementById("video-frame");
      if (!frame) return { width: 1920, height: 1080 };
      return {
        width: frame.offsetWidth,
        height: frame.offsetHeight,
      };
    });
    await page.setViewport(dimensions);

    // Force hide devtools indicator via JS (robustness)
    await page.evaluate(() => {
      const style = document.createElement("style");
      style.textContent = `
        #devtools-indicator, #next-logo, [data-nextjs-toast] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `;
      document.head.appendChild(style);

      const removeDevTools = () => {
        const ids = ["#devtools-indicator", "#next-logo"];
        ids.forEach((id) => {
          const el = document.querySelector(id);
          if (el) el.remove();
        });
        const toasts = document.querySelectorAll("[data-nextjs-toast]");
        toasts.forEach((t) => t.remove());
      };

      removeDevTools();
      const observer = new MutationObserver(removeDevTools);
      observer.observe(document.body, { childList: true, subtree: true });
    });

    // 3. Prepare FFmpeg
    // 3. Prepare FFmpeg
    const finalOutputPath = path.resolve(
      process.cwd(),
      "public/exports",
      outputFilename,
    );
    const tempOutputPath = finalOutputPath + ".tmp";

    fs.mkdirSync(path.dirname(finalOutputPath), { recursive: true });

    // ... (Rest of FFmpeg setup is same, just need to update progress loop) ...

    const ffmpegArgs = ["-y", "-f", "image2pipe", "-r", "30", "-i", "-"];

    let hasMusic = false;
    if (video.music) {
      const musicPath = getAbsolutePath(video.music);
      if (fs.existsSync(musicPath)) {
        ffmpegArgs.push("-stream_loop", "-1", "-i", musicPath);
        hasMusic = true;
      }
    }

    audioEvents.forEach((event) => {
      ffmpegArgs.push("-i", event.path);
    });

    const filterComplex = [];
    let audioInputsCount = 0;

    if (hasMusic) {
      const vol = video.musicVolume !== undefined ? video.musicVolume : 0.3;
      filterComplex.push(`[1:a]volume=${vol}[bg]`);
      audioInputsCount++;
    }

    audioEvents.forEach((event, index) => {
      const inputIndex = hasMusic ? index + 2 : index + 1;
      const delayMs = Math.round(event.startMs);
      const outputLabel = `vo${index}`;
      const vol = video.voVolume !== undefined ? video.voVolume : 1.0;
      filterComplex.push(
        `[${inputIndex}:a]volume=${vol},adelay=${delayMs}|${delayMs}[${outputLabel}]`,
      );
      audioInputsCount++;
    });

    if (audioInputsCount > 0) {
      let mixInputs = "";
      if (hasMusic) mixInputs += "[bg]";
      audioEvents.forEach((_, i) => (mixInputs += `[vo${i}]`));
      filterComplex.push(
        `${mixInputs}amix=inputs=${audioInputsCount}:duration=first[aout]`,
      );

      ffmpegArgs.push("-filter_complex", filterComplex.join(";"));
      ffmpegArgs.push("-map", "0:v");
      ffmpegArgs.push("-map", "[aout]");

      ffmpegArgs.push(
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-preset",
        "fast",
        "-crf",
        "22",
      );
      ffmpegArgs.push("-c:a", "aac", "-b:a", "192k");
      ffmpegArgs.push("-shortest");
    } else {
      ffmpegArgs.push(
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-preset",
        "fast",
        "-crf",
        "22",
      );
    }

    ffmpegArgs.push("-f", "mp4");
    ffmpegArgs.push(tempOutputPath);

    const ffmpegProcess = spawn(ffmpegInstaller.path, ffmpegArgs);

    ffmpegProcess.stderr.on("data", (data) => {
      console.error(`FFmpeg: ${data.toString()}`);
    });

    ffmpegProcess.on("error", (err) => {
      console.error("Failed to start FFmpeg:", err);
    });

    // 4. Start Recording Loop
    await page.evaluate(() => {
      if (window.renderController) {
        window.renderController.start();
      }
    });

    let isRecording = true;
    const targetFps = 30;
    const msPerFrame = 1000 / targetFps;
    let frameCount = 0;
    const startTime = Date.now();

    const frameCaptureLoop = async () => {
      while (isRecording) {
        const now = Date.now();
        const elapsed = now - startTime;

        // Check if complete
        const isDone = await page.evaluate(() => window.videoRenderingComplete);
        if (isDone) {
          console.log("Video rendering reported complete.");
          isRecording = false;
          // Ensure we fill up to the current time? No, just stop.
          break;
        }

        // Safety timeout (e.g. 5 mins max)
        if (elapsed > 300000) {
          console.error("Recording timeout safety triggered");
          break;
        }

        // Capture Frame
        let buffer;
        try {
          buffer = await page.screenshot({
            type: "jpeg",
            quality: 80, // slightly lower quality for speed
            clip: {
              x: 0,
              y: 0,
              width: dimensions.width,
              height: dimensions.height,
            },
            optimizeForSpeed: true,
          });
        } catch (e) {
          console.error("Frame capture error:", e);
          break;
        }

        // Calculate how many frames should have been written by now
        const intendedFrameCount = Math.floor(elapsed / msPerFrame);
        const framesToCatchUp = intendedFrameCount - frameCount;

        if (framesToCatchUp > 0) {
          if (ffmpegProcess.stdin.writable) {
            // Write the SAME buffer multiple times to catch up to real-time
            for (let i = 0; i < framesToCatchUp; i++) {
              ffmpegProcess.stdin.write(buffer);
              frameCount++;

              // Update progress every 30 frames (1 sec)
              if (frameCount % 30 === 0) {
                const percent = Math.min(
                  99,
                  Math.round(
                    ((frameCount * msPerFrame) / totalDurationMs) * 100,
                  ),
                );
                updateProgress(
                  percent,
                  `Recording frame ${frameCount}...`,
                  "recording",
                );
              }
            }
          } else {
            isRecording = false;
            break;
          }
        }

        // Small delay to prevent tight loop if we are ahead (unlikely with screenshot overhead)
        const nextFrameTime = startTime + (intendedFrameCount + 1) * msPerFrame;
        const wait = Math.max(0, nextFrameTime - Date.now());
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      }

      if (ffmpegProcess.stdin.writable) ffmpegProcess.stdin.end();
    };

    await frameCaptureLoop();
    console.log("\nCapture finished. Processing encoding...");
    updateProgress(99, "Finalizing encoding...", "encoding");

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        ffmpegProcess.kill();
        reject(new Error("Encoding timed out after 60s"));
      }, 60000);

      ffmpegProcess.on("close", (code) => {
        clearTimeout(timeout);
        if (code === 0) {
          console.log("Export successful!");
          resolve();
        } else {
          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });
    });

    await browser.close();

    // Rename temp file to final file
    if (fs.existsSync(tempOutputPath)) {
      fs.renameSync(tempOutputPath, finalOutputPath);
    }

    console.log(`Saved to: ${finalOutputPath}`);
    updateProgress(100, "Export complete!", "finished");

    // Wait a moment for the stream API to pick up the finished state
    await new Promise((r) => setTimeout(r, 1500));

    // Cleanup progress file
    if (fs.existsSync(progressPath)) {
      fs.unlinkSync(progressPath);
    }

    // Cleanup styling file
    const cleanupStylePath = path.resolve(
      process.cwd(),
      "public/exports",
      `.style-${videoId}.json`,
    );
    if (fs.existsSync(cleanupStylePath)) {
      fs.unlinkSync(cleanupStylePath);
    }
  } catch (error) {
    console.error("Export Error:", error);
    updateProgress(0, "Export failed", "error");
    process.exit(1);
  }
}

if (videoId) {
  exportVideo(videoId, outputFilename).catch((err) => {
    console.error("Export Failed:", err);
    process.exit(1);
  });
}

import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return new Response("Video ID required", { status: 400 });
  }

  const exportsDir = path.join(process.cwd(), "public/exports");
  const progressPath = path.join(exportsDir, `.progress-${videoId}.json`);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data) => {
        const text = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(text));
      };

      // Initial check
      try {
        const content = await fs.readFile(progressPath, "utf-8");
        sendEvent(JSON.parse(content));
      } catch {
        // File might not exist yet if just started, or finished.
        // Send a generic 'waiting' or nothing.
      }

      // Check for updates every 500ms
      // We use polling on the server side because fs.watch can be flaky with
      // atomic writes/renames on some OSs, and we want to be simple.
      // This relieves the client from network requests.
      let lastModified = 0;

      const interval = setInterval(async () => {
        try {
          const stats = await fs.stat(progressPath);

          if (stats.mtimeMs > lastModified) {
            lastModified = stats.mtimeMs;
            const content = await fs.readFile(progressPath, "utf-8");
            const data = JSON.parse(content);
            sendEvent(data);

            if (data.phase === "finished" || data.phase === "error") {
              // We can close, but maybe let the client close?
              // Let's keep sending until client disconnects or we decide to stop.
              // Actually, if finished, we can probably stop.
            }
          }
        } catch {
          // File might be gone (cleaned up) -> assume finished or removed
          // Ensure we don't crash loop
        }
      }, 500);

      // Keep connection alive
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(": keep-alive\n\n"));
      }, 15000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        clearInterval(keepAlive);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

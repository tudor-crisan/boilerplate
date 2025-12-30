import boardEvents from "@/libs/modules/boards/events";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data) => {
        const text = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(text));
      };

      const onVote = (data) => {
        sendEvent({ type: "vote", ...data });
      };

      // Listen for 'vote' events
      boardEvents.on("vote", onVote);

      // Keep connection alive
      const keepAlive = setInterval(() => {
        // Send a comment to keep the connection open
        controller.enqueue(encoder.encode(": keep-alive\n\n"));
      }, 15000);

      req.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        boardEvents.off("vote", onVote);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

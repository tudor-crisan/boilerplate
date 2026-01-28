import connectMongo from "@/libs/mongoose";
import { auth } from "@/modules/auth/libs/auth";
import Board from "@/modules/boards/models/Board";
import Notification from "@/modules/boards/models/Notification";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data) => {
        if (controller.desiredSize === null) return; // Stream closed
        const text = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(text));
      };

      await connectMongo();

      // Watch only for changes relevant to this user
      // Note: MongoDB change streams with filters require specific permissions/versions,
      // but filtering in application logic is safer/polite for standard shared clusters if complex matchers are needed.
      // However, we can use a pipeline to filter on the server side if supported.
      // For simplicity and standard support, we watch all and filter in app unless volume is huge.
      // Given this is a boiler plate, we'll watch and filter.

      const changeStream = Notification.watch([], {
        fullDocument: "updateLookup",
      });

      changeStream.on("change", async (change) => {
        if (!change.fullDocument) return;

        // Strictly filter by userId
        if (change.fullDocument.userId.toString() !== userId) return;

        console.log(
          `Notification event for user ${userId}:`,
          change.operationType,
        );

        // Handle New Notification (Insert)
        if (change.operationType === "insert") {
          // Manual population for SSE because simple watch doesn't populate
          const fullDoc = change.fullDocument;
          if (fullDoc.boardId) {
            const board = await Board.findById(fullDoc.boardId)
              .select("name slug")
              .lean();
            fullDoc.boardId = board;
          }

          sendEvent({
            type: "notification-create",
            notification: fullDoc,
          });
        }

        // Handle Update (e.g. Read Status)
        if (change.operationType === "update") {
          sendEvent({
            type: "notification-update",
            notificationId: change.documentKey._id.toString(),
            updatedFields: change.updateDescription.updatedFields,
          });
        }
      });

      // Keep connection alive
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keep-alive\n\n"));
        } catch {
          clearInterval(keepAlive);
        }
      }, 15000);

      // Vercel Serverless Timeout Handling
      // Close stream after ~40s to prevent execution timeout errors
      const timeout = setTimeout(() => {
        try {
          controller.close();
        } catch {
          // ignore if already closed
        }
        clearInterval(keepAlive);
        changeStream.close();
      }, 40000);

      req.signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        clearInterval(keepAlive);
        changeStream.close();
        try {
          controller.close();
        } catch {}
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

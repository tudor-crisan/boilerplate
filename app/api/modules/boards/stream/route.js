import connectMongo from "@/libs/mongoose";
import Post from "@/models/modules/boards/Post";
import Board from "@/models/modules/boards/Board";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data) => {
        const text = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(text));
      };

      await connectMongo();

      const changeStream = Post.watch([], { fullDocument: 'updateLookup' });
      const boardChangeStream = Board.watch([], { fullDocument: 'updateLookup' });

      changeStream.on("change", (change) => {
        // Handle Vote (Update)
        if (change.operationType === "update") {
          const updatedFields = change.updateDescription.updatedFields;
          if (updatedFields && typeof updatedFields.votesCounter !== 'undefined') {
            console.log("SERVER: Stream sending vote event. LastActionBy:", change.fullDocument.lastActionByClientId);
            sendEvent({
              type: "vote",
              postId: change.documentKey._id.toString(),
              votesCounter: change.fullDocument.votesCounter,
              boardId: change.fullDocument.boardId.toString(),
              clientId: change.fullDocument.lastActionByClientId,
            });
          }
        }

        // Handle New Post (Insert)
        if (change.operationType === "insert") {
          sendEvent({
            type: "post-create",
            post: change.fullDocument,
            boardId: change.fullDocument.boardId.toString(),
            clientId: change.fullDocument.lastActionByClientId,
          });
        }

        // Handle Delete
        if (change.operationType === "delete") {
          sendEvent({
            type: "post-delete",
            postId: change.documentKey._id.toString()
          });
        }
      });

      boardChangeStream.on("change", (change) => {
        if (change.operationType === "delete") {
          sendEvent({
            type: "board-delete",
            boardId: change.documentKey._id.toString()
          });
        }
      });

      // Keep connection alive
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(": keep-alive\n\n"));
      }, 15000);

      req.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        changeStream.close();
        boardChangeStream.close();
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

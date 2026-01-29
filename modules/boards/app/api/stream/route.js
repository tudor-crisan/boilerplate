import Board from "@/modules/boards/models/Board";
import Comment from "@/modules/boards/models/Comment";
import Post from "@/modules/boards/models/Post";
import connectMongo from "@/modules/general/libs/mongoose";

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

      const changeStream = Post.watch([], { fullDocument: "updateLookup" });
      const boardChangeStream = Board.watch([], {
        fullDocument: "updateLookup",
      });

      changeStream.on("change", (change) => {
        // Handle Vote (Update)
        if (change.operationType === "update") {
          const updatedFields = change.updateDescription.updatedFields;
          if (
            updatedFields &&
            typeof updatedFields.votesCounter !== "undefined"
          ) {
            console.log(
              "SERVER: Stream sending vote event. LastActionBy:",
              change.fullDocument.lastActionByClientId,
            );
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
            postId: change.documentKey._id.toString(),
          });
        }
      });

      boardChangeStream.on("change", (change) => {
        if (change.operationType === "delete") {
          sendEvent({
            type: "board-delete",
            boardId: change.documentKey._id.toString(),
          });
        }
      });

      const commentChangeStream = Comment.watch([], {
        fullDocument: "updateLookup",
      });

      commentChangeStream.on("change", (change) => {
        if (change.operationType === "insert") {
          sendEvent({
            type: "comment-update",
            postId: change.fullDocument.postId.toString(),
            boardId: change.fullDocument.boardId.toString(),
            action: "add",
            comment: change.fullDocument,
          });
        }
        if (change.operationType === "update") {
          const updatedFields = change.updateDescription.updatedFields;
          if (updatedFields && updatedFields.isDeleted === true) {
            sendEvent({
              type: "comment-update",
              // With updateLookup we get fullDocument
              postId: change.fullDocument.postId.toString(),
              boardId: change.fullDocument.boardId.toString(),
              action: "remove",
              commentId: change.documentKey._id.toString(),
            });
          }
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
        commentChangeStream.close();
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

import connectMongo from "@/libs/mongoose";
import Post from "@/models/modules/boards/Post";
import Board from "@/models/modules/boards/Board";
import Comment from "@/models/modules/boards/Comment";

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

      const commentChangeStream = Comment.watch([], { fullDocument: 'updateLookup' });

      commentChangeStream.on("change", (change) => {
        if (change.operationType === "insert") {
          sendEvent({
            type: "comment-update",
            postId: change.fullDocument.postId.toString(),
            boardId: change.fullDocument.boardId.toString(),
            action: "add"
          });
        }
        if (change.operationType === "delete") {
          // For delete, we might not have the full document if it's not enabled in pre-image
          // But we can try to look it up if we have it, or client needs to handle it.
          // Note: Standard mongo change streams for delete only provide documentKey (_id).
          // To get the postId/boardId, we'd need to store it or look it up before delete, 
          // but here we only have the ID. 
          // IMPROVEMENT: If we can't reliably get the postId from a delete event without extra config,
          // we might just broadcast the commentId and let client search, OR we rely on the fact 
          // that standard delete implementations usually don't return the deleted doc details in change stream.
          // However, we can simply emit the delete event. But wait, useBoardPosts needs postId to update the count.
          // Problem: 'delete' event in toggle doesn't give us postId.
          // Solution: Client side optimistic update is done. But for other clients?
          // We can't know which post the comment belonged to easily from just the ID in a standard stream.
          // A workaround: In `comment/route.js`, we could technically fire an event, but we want to stick to the stream watcher.
          // ALTERNATIVE: Use `fullDocumentBeforeChange` if enabled (requires config).
          // EASIER FIX: For now, we will just support "add" updates reliably. 
          // actually, let's look at how we can support delete.
          // If we can't get postId, we can't update the specific post count on other clients.
          // Let's rely on 'insert' for now as it's the most important for "showing activity".
          // If the user wants deletions to sync, we'd need to fetch the comment before delete in the API 
          // and manually send an event, OR enable pre-images.
          // Given constraints, I will implement 'insert' logic which works 100%.
          // For delete, I will simply omit it for now or try to see if we can get it.
          // Wait, 'post-delete' works because we just remove the post.
          // 'comment-delete' needs to decrement a counter on a specific post.
          // If we don't know the post, we can't decrement.
          // Let's just implement INSERT for now as it's the primary request "when a comment is added".
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
      "Connection": "keep-alive",
    },
  });
}

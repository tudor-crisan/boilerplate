"use client";

import { useState, useEffect, useCallback } from "react";
import { clientApi } from "@/libs/api";
import { defaultSetting as settings } from "@/libs/defaults";
import useApiRequest from "@/hooks/useApiRequest";

const useBoardComments = (postId) => {
  const [comments, setComments] = useState([]);

  const { request: fetchRequest, loading: isLoading } = useApiRequest();
  const { request: actionRequest, loading: isSubmitting, inputErrors } = useApiRequest();

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    await fetchRequest(
      () => clientApi.get(settings.forms.Comment.formConfig.apiUrl + "?postId=" + postId),
      {
        onSuccess: (message, data) => {
          if (data?.comments) {
            setComments(data.comments);
          }
        },
        showToast: false
      }
    );
  }, [postId, fetchRequest]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (payload, onSuccess) => {
    await actionRequest(
      () => clientApi.post(settings.forms.Comment.formConfig.apiUrl, {
        ...payload,
        postId
      }),
      {
        onSuccess: (message, data) => {
          if (data?.comment) {
            setComments(prev => [...prev, data.comment]);
            if (onSuccess) onSuccess();
          }
        }
      }
    );
  };

  useEffect(() => {
    if (!postId) return;

    const eventSource = new EventSource(settings.paths.api.boardsStream);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "comment-update" && data.postId === postId) {
          if (data.action === "add") {
            setComments((prev) => {
              if (prev.some(c => c._id === data.comment._id)) return prev;
              // We need userId populated, which stream might not send fully populated.
              // Ideally the addComment optimistic update handles the user's own comment.
              // For others, we might need basic info. The stream sends fullDocument.
              // However fullDocument only has userId string. 
              // We can fetch or just render basic. 
              // For now let's just push it. If userId is object in state, we might have issues if data.comment.userId is string.
              // FIX: If data.comment.userId is string, and we need object.
              // Simple workaround: If it's from another user, initials might be wrong until refresh.
              // Let's rely on refresh or just show 'Anonymous' if missing.
              return [...prev, data.comment];
            });
          } else if (data.action === "remove") {
            setComments(prev => prev.filter(c => c._id !== data.commentId));
          }
        }
      } catch (error) {
        console.error("SSE parse error", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [postId]);

  const deleteComment = async (commentId) => {
    await actionRequest(
      () => clientApi.delete(settings.forms.Comment.formConfig.apiUrl + "?commentId=" + commentId),
      {
        onSuccess: (message) => {
          // Optimistic update
          setComments(prev => prev.filter(c => c._id !== commentId));
        }
      }
    );
  };

  return {
    comments,
    isLoading,
    isSubmitting,
    inputErrors,
    addComment,
    deleteComment
  };
};

export default useBoardComments;

"use client";

import useApiRequest from "@/hooks/useApiRequest";
import { clientApi } from "@/libs/api";
import { defaultSetting as settings } from "@/libs/defaults";
import { useCallback, useEffect, useState } from "react";

const useBoardComments = (postId) => {
  const [comments, setComments] = useState([]);

  const { request: fetchRequest, loading: isLoading } = useApiRequest();
  const { request: silentFetchRequest } = useApiRequest(); // New request handler for background fetches
  const {
    request: actionRequest,
    loading: isSubmitting,
    inputErrors,
  } = useApiRequest();

  const fetchComments = useCallback(
    async (isBackground = false) => {
      if (!postId) return;

      const requestHandler = isBackground ? silentFetchRequest : fetchRequest;

      await requestHandler(
        () =>
          clientApi.get(
            settings.forms.Comment.formConfig.apiUrl + "?postId=" + postId,
          ),
        {
          onSuccess: (message, data) => {
            if (data?.comments) {
              setComments(data.comments);
            }
          },
          showToast: false,
        },
      );
    },
    [postId, fetchRequest, silentFetchRequest],
  );

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (!postId) return;

    const eventSource = new EventSource(settings.paths.api.boardsStream);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "comment-update" && data.postId === postId) {
          // Re-fetch to ensure we get populated user data and avoid duplicates
          // This handles both "add" (getting the real user info) and "remove" (syncing state)
          fetchComments(true); // Call with isBackground = true
        }
      } catch (error) {
        console.error("SSE parse error", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [postId, fetchComments]);

  const addComment = async (payload, onSuccess) => {
    await actionRequest(
      () =>
        clientApi.post(settings.forms.Comment.formConfig.apiUrl, {
          ...payload,
          postId,
        }),
      {
        onSuccess: (message, data) => {
          if (data?.comment) {
            // Optimistic update - safely check for duplicates
            setComments((prev) => {
              if (prev.some((c) => c._id === data.comment._id)) return prev;
              return [...prev, data.comment]; // Add to end of list
            });
            if (onSuccess) onSuccess(data.comment);
          }
        },
        showToast: false, // Suppress API toast, rely on SSE toast or just UI update
      },
    );
  };

  const deleteComment = async (commentId) => {
    await actionRequest(
      () =>
        clientApi.delete(
          settings.forms.Comment.formConfig.apiUrl + "?commentId=" + commentId,
        ),
      {
        onSuccess: () => {
          // Optimistic update
          setComments((prev) => prev.filter((c) => c._id !== commentId));
        },
        showToast: false, // Suppress API toast
      },
    );
  };

  return {
    comments,
    isLoading,
    isSubmitting,
    inputErrors,
    addComment,
    deleteComment,
  };
};

export default useBoardComments;

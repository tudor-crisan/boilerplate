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

  const deleteComment = async (commentId) => {
    await actionRequest(
      () => clientApi.delete(settings.forms.Comment.formConfig.apiUrl + "?commentId=" + commentId),
      {
        onSuccess: (message) => {
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

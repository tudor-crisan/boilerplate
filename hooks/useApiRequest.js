"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { setDataError, setDataSuccess } from "@/libs/api";

export default function useApiRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [inputErrors, setInputErrors] = useState({});

  useEffect(() => {
    if (message) {
      toast.success(message);
      setMessage("");
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError("");
    }
  }, [error]);

  const request = async (requestFn, { onSuccess = () => { }, onError = () => { }, keepLoadingOnSuccess = false } = {}) => {
    if (loading) return;

    setLoading(true);
    setInputErrors({});
    setError("");
    setMessage("");

    try {
      const response = await requestFn();

      const errorCallback = (errMsg, validationErrors) => {
        setError(errMsg);
        setInputErrors(validationErrors || {});
        onError(errMsg, validationErrors);
        setLoading(false);
      };

      const successCallback = (msg) => {
        setMessage(msg);
        onSuccess(msg);
        if (!keepLoadingOnSuccess) {
          setLoading(false);
        }
      };

      if (setDataError(response, errorCallback)) {
        return;
      }

      if (setDataSuccess(response, successCallback)) {
        return;
      }

      // Fallback if neither helper handled it (e.g. status 200 but weird body)
      setLoading(false);

    } catch (err) {
      const errorCallback = (errMsg, validationErrors) => {
        setError(errMsg);
        setInputErrors(validationErrors || {});
        onError(errMsg, validationErrors);
      };

      setDataError(err?.response || err, errorCallback);
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    error,
    message,
    inputErrors,
    setInputErrors,
    request
  };
}

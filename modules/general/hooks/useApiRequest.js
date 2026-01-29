"use client";
import { setDataError, setDataSuccess } from "@/modules/general/libs/api";
import { toast } from "@/modules/general/libs/toast";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useApiRequest() {
  const [loading, _setLoading] = useState(false);
  const loadingRef = useRef(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [inputErrors, setInputErrors] = useState({});

  const setLoading = (val) => {
    loadingRef.current = val;
    _setLoading(val);
  };

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

  const request = useCallback(
    async (
      requestFn,
      {
        onSuccess = () => {},
        onError = () => {},
        keepLoadingOnSuccess = false,
        showToast = true,
      } = {},
    ) => {
      if (loadingRef.current) return;

      setLoading(true);
      setInputErrors({});
      setError("");
      setMessage("");

      try {
        const response = await requestFn();

        const errorCallback = (errMsg, validationErrors, status) => {
          if (status !== 401) {
            setError(errMsg);
          }
          setInputErrors(validationErrors || {});
          onError(errMsg, validationErrors);
          setLoading(false);
        };

        const successCallback = (msg, data) => {
          if (showToast) {
            setMessage(msg);
          }
          onSuccess(msg, data);
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
        const errorCallback = (errMsg, validationErrors, status) => {
          if (status !== 401) {
            setError(errMsg);
          }
          setInputErrors(validationErrors || {});
          onError(errMsg, validationErrors);
        };

        setDataError(err?.response || err, errorCallback);
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    setLoading,
    error,
    message,
    inputErrors,
    setInputErrors,
    request,
  };
}

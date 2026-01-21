"use client";
import { useEffect, useState } from "react";

export function useError(initialMessage = null) {
  const [error, setError] = useState(initialMessage);

  useEffect(() => {
    setError(initialMessage);
  }, [initialMessage]);

  const clearError = () => {
    if (error) {
      setError(null);
    }
  };

  return {
    error,
    setError,
    clearError,
  };
}

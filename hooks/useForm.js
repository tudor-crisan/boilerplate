"use client";
import { useState } from "react";

export default function useForm(initialInputs = {}) {
  const [inputs, setInputs] = useState(initialInputs);
  const [inputErrors, setInputErrors] = useState({});

  const clearError = (key) => {
    if (inputErrors[key]) {
      setInputErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleChange = (key, value) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));

    clearError(key);
  };

  const handleFocus = (key) => {
    clearError(key);
  };

  const resetInputs = (newInputs = initialInputs) => {
    setInputs(newInputs);
    setInputErrors({});
  };

  return {
    inputs,
    inputErrors,
    setInputErrors,
    handleChange,
    handleFocus,
    resetInputs,
  };
}

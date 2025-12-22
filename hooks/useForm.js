"use client";
import { useState } from "react";

export default function useForm(initialInputs = {}) {
  const [inputs, setInputs] = useState(initialInputs);
  const [inputErrors, setInputErrors] = useState({});

  const handleChange = (key, value) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Clear error for this field when user types
    if (inputErrors[key]) {
      setInputErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const resetInputs = (newInputs = initialInputs) => {
    setInputs(newInputs);
    setInputErrors({});
  };

  const setErrors = (errors) => {
    setInputErrors(errors);
  };

  return {
    inputs,
    inputErrors,
    setInputErrors: setErrors,
    handleChange,
    resetInputs,
  };
}

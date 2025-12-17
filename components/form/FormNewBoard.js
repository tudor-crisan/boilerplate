"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { frontendMock } from "@/libs/utils";
import settings from "@/config/settings.json";

const formConfig = settings.forms.Board.formConfig;
const inputsConfig = settings.forms.Board.inputsConfig

export default function FormNewBoard() {
  const defaultInputs = Object.entries(inputsConfig).reduce((acc, entry) => ({
    ...acc, [entry[0]]: entry[1].value
  }), {})

  const [inputs, setInputs] = useState({ ...defaultInputs });

  const setInput = (key, value) => {
    setInputs({
      ...inputs,
      [key]: value
    })
  }

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

  const resetInputs = () => {
    setInputs({ ...defaultInputs })
  }

  const resetError = (key = "", value = "") => {
    setErrors({ ...errors, [key]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(formConfig.apiUrl, { ...inputs });

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.message) {
        setMessage(data.message);
        resetInputs();
        return
      }

    } catch (err) {
      const { data } = err.response;
      setError(data?.error || "");
      setErrors(data?.errors || {});
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className="space-y-4 bg-base-100 p-8 rounded-3xl"
      onSubmit={handleSubmit}
    >
      {formConfig.title && (
        <p className="font-bold text-lg mb-2">
          {formConfig.title}
        </p>
      )}
      {Object.entries(inputsConfig).map(([target, config]) => (
        <fieldset
          key={target}
          className="fieldset"
        >
          {config.label && (
            <legend className="fieldset-legend">
              {config.label}
            </legend>
          )}
          <input
            required={config.required || false}
            type={config.type || "text"}
            className={`input ${errors[target] && 'input-error'}`}
            placeholder={config.placeholder}
            value={inputs[target]}
            onFocus={() => resetError(target)}
            onChange={(e) => setInput(target, e.target.value)}
            disabled={isLoading}
          />
          {errors[target] && (
            <p className="label text-red-600">{errors[target]}</p>
          )}
        </fieldset>
      ))}
      <div className="flex">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading && <span className="loading loading-spinner loading-xs"></span>}
          {formConfig.button || "Create"}
        </button>
      </div>
      <Toaster />
      <p>{frontendMock(formConfig.type)}</p>
    </form>
  )
}

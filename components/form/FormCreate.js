"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { defaultSetting as settings } from "@/libs/defaults";
import { useRouter } from "next/navigation";
import { setDataError, setDataSuccess } from "@/libs/api";
import MockForms from "@/components/mock/MockForms";
import { useStyling } from "@/context/ContextStyling";
import GeneralTitle from "../general/GeneralTitle";

export default function FormCreate({ type }) {
  const router = useRouter();
  const { formConfig, inputsConfig } = settings.forms[type];
  const { styling } = useStyling();

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
  const [inputErrors, setInputErrors] = useState({});

  const resetError = (key = "", value = "") => {
    setInputErrors({ ...inputErrors, [key]: value })
  }

  const resetInputs = () => {
    setInputs({ ...defaultInputs })
  }

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

  const errorCallback = (error = "", inputErrors = {}) => {
    setError(error);
    setInputErrors(inputErrors);
  }

  const successCallback = (message) => {
    setMessage(message);
    resetInputs();
    router.refresh();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setInputErrors({});
    setIsLoading(true);

    try {
      const response = await axios.post(formConfig.apiUrl, { ...inputs });

      if (setDataError(response, errorCallback)) {
        return;
      }

      if (setDataSuccess(response, successCallback)) {
        return;
      }
    } catch (err) {
      setDataError(err?.response, errorCallback);

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className={`${styling.roundness[1]} ${styling.borders[0]} space-y-4 bg-base-100 px-4 py-8`}
      onSubmit={handleSubmit}
    >
      {formConfig.title && (
        <GeneralTitle>
          {formConfig.title}
        </GeneralTitle>
      )}
      {Object.entries(inputsConfig).map(([target, config]) => (
        <div
          key={target}
          className="flex flex-col space-y-2"
        >
          {config.label && (
            <label className="font-bold">
              {config.label}
            </label>
          )}
          <input
            required={config.required || false}
            type={config.type || "text"}
            className={`${styling.roundness[0]} ${styling.shadows[0]} input ${inputErrors[target] && 'input-error'}`}
            placeholder={config.placeholder}
            value={inputs[target]}
            onFocus={() => resetError(target)}
            onChange={(e) => setInput(target, e.target.value)}
            disabled={isLoading}
          />
          {inputErrors[target] && (
            <p className="label text-red-600">{inputErrors[target]}</p>
          )}
        </div>
      ))}
      <div className="flex">
        <button
          type="submit"
          disabled={isLoading}
          className={`${styling.roundness[0]} ${styling.shadows[0]} btn-sm sm:btn-md btn btn-primary`}
        >
          {isLoading && <span className="loading loading-spinner loading-xs"></span>}
          {formConfig.button || "Create"}
        </button>
      </div>
      <MockForms type={type} />
    </form>
  )
}
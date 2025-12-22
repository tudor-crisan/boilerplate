"use client";
import { useState } from "react";
import axios from "axios";
import { defaultSetting as settings } from "@/libs/defaults";
import { useRouter } from "next/navigation";
import useApiRequest from "@/hooks/useApiRequest";
import MockForms from "@/components/mock/MockForms";
import Button from "@/components/button/Button";
import Select from "@/components/select/Select";
import Textarea from "@/components/textarea/Textarea";
import Input from "@/components/input/Input";
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

  const { loading, inputErrors, setInputErrors, request } = useApiRequest();

  const resetError = (key = "", value = "") => {
    setInputErrors(prev => ({ ...prev, [key]: value }))
  }

  const resetInputs = () => {
    setInputs({ ...defaultInputs })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await request(
      () => axios.post(formConfig.apiUrl, { ...inputs }),
      {
        onSuccess: () => {
          resetInputs();
          router.refresh();
        }
      }
    );
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

          {config.type === "select" ? (
            <Select
              required={config.required || false}
              className={config.className || ""}
              error={inputErrors[target]}
              value={inputs[target]}
              options={config.options || []}
              placeholder={config.placeholder}
              onChange={(e) => setInput(target, e.target.value)}
              disabled={loading}
            />
          ) : config.type === "textarea" ? (
            <Textarea
              required={config.required || false}
              className={config.className || ""}
              error={inputErrors[target]}
              placeholder={config.placeholder}
              value={inputs[target]}
              onFocus={() => resetError(target)}
              onChange={(e) => setInput(target, e.target.value)}
              disabled={loading}
              rows={config.rows || 3}
            />
          ) : (
            <Input
              required={config.required || false}
              className={config.className || ""}
              type={config.type || "text"}
              error={inputErrors[target]}
              placeholder={config.placeholder}
              value={inputs[target]}
              onFocus={() => resetError(target)}
              onChange={(e) => setInput(target, e.target.value)}
              disabled={loading}
            />
          )}

          {inputErrors[target] && (
            <p className="label text-red-600">{inputErrors[target]}</p>
          )}
        </div>
      ))}
      <div className="flex">
        <Button
          type="submit"
          isLoading={loading}
          variant="btn-primary"
        >
          {formConfig.button || "Create"}
        </Button>
      </div>
      <MockForms type={type} />
    </form>
  )
}
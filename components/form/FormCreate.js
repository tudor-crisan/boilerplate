"use client";
import { clientApi } from "@/libs/api";
import { defaultSetting as settings } from "@/libs/defaults";
import { useRouter } from "next/navigation";
import useApiRequest from "@/hooks/useApiRequest";
import useForm from "@/hooks/useForm";
import MockForms from "@/components/mock/MockForms";
import Button from "@/components/button/Button";
import Select from "@/components/select/Select";
import Textarea from "@/components/textarea/Textarea";
import Input from "@/components/input/Input";
import { useStyling } from "@/context/ContextStyling";
import Title from "@/components/common/Title";
import Label from "@/components/common/Label";

export default function FormCreate({ type, queryParams = {}, skipRefresh = false }) {
  const router = useRouter();
  const { formConfig, inputsConfig } = settings.forms[type];
  const { styling } = useStyling();

  const defaultInputs = Object.entries(inputsConfig).reduce((acc, entry) => ({
    ...acc, [entry[0]]: entry[1].value
  }), {});

  const {
    inputs,
    inputErrors,
    resetInputs,
    setInputErrors,
    handleChange,
    handleFocus,
  } = useForm(defaultInputs);

  const { loading, request } = useApiRequest();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = Object.keys(queryParams).length > 0
      ? `${formConfig.apiUrl}?${new URLSearchParams(queryParams)}`
      : formConfig.apiUrl;

    await request(
      () => clientApi.post(url, { ...inputs }),
      {
        onSuccess: () => {
          resetInputs();
          if (!skipRefresh) {
            router.refresh();
          }
        },
        onError: (_, validationErrors) => {
          if (validationErrors) {
            setInputErrors(validationErrors);
          }
        }
      }
    );
  }

  return (
    <form
      className={`${styling.components.card} space-y-4 ${styling.paddings.card} ${formConfig.className || ''}`}
      onSubmit={handleSubmit}
    >
      {formConfig.title && (
        <Title>
          {formConfig.title}
        </Title>
      )}
      {Object.entries(inputsConfig).map(([target, config]) => (
        <div
          key={target}
          className="flex flex-col space-y-2"
        >
          {config.label && (
            <Label>
              {config.label}
            </Label>
          )}

          {config.type === "select" ? (
            <Select
              required={config.required || false}
              className={config.className || ""}
              error={inputErrors[target]}
              value={inputs[target]}
              options={config.options || []}
              placeholder={config.placeholder}
              onFocus={() => handleFocus(target)}
              onChange={(e) => handleChange(target, e.target.value)}
              disabled={loading}
            />
          ) : config.type === "textarea" ? (
            <Textarea
              required={config.required || false}
              className={config.className || ""}
              error={inputErrors[target]}
              placeholder={config.placeholder}
              value={inputs[target]}
              onFocus={() => handleFocus(target)}
              onChange={(e) => handleChange(target, e.target.value)}
              disabled={loading}
              rows={config.rows || 3}
              maxLength={config.maxlength}
              showCharacterCount={config.showCharacterCount ?? formConfig.showCharacterCount}
            />
          ) : (
            <Input
              required={config.required || false}
              className={config.className || ""}
              type={config.type || "text"}
              error={inputErrors[target]}
              placeholder={config.placeholder}
              value={inputs[target]}
              onFocus={() => handleFocus(target)}
              onChange={(e) => handleChange(target, e.target.value)}
              disabled={loading}
              maxLength={config.maxlength}
              showCharacterCount={config.showCharacterCount ?? formConfig.showCharacterCount}
            />
          )}

          {inputErrors[target] && (
            <p className="label text-red-500">{inputErrors[target]}</p>
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
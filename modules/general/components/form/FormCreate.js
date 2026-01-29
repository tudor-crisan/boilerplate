"use client";
import Button from "@/modules/general/components/button/Button";
import Label from "@/modules/general/components/common/Label";
import Title from "@/modules/general/components/common/Title";
import Input from "@/modules/general/components/input/Input";
import MockForms from "@/modules/general/components/mock/MockForms";
import Select from "@/modules/general/components/select/Select";
import Textarea from "@/modules/general/components/textarea/Textarea";
import { useStyling } from "@/modules/general/context/ContextStyling";
import useApiRequest from "@/modules/general/hooks/useApiRequest";
import useForm from "@/modules/general/hooks/useForm";
import { clientApi } from "@/modules/general/libs/api";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import { useRouter } from "next/navigation";

export default function FormCreate({
  type,
  queryParams = {},
  skipRefresh = false,
  customConfig = {},
}) {
  const router = useRouter();

  // Merge default config with custom config
  let { formConfig, inputsConfig } = settings.forms[type];

  if (customConfig?.form) {
    // Override form config (title, button)
    formConfig = { ...formConfig, ...customConfig.form };

    // Override inputs config
    if (customConfig.form.inputs) {
      const newInputsConfig = { ...inputsConfig };
      Object.keys(customConfig.form.inputs).forEach((key) => {
        if (newInputsConfig[key]) {
          newInputsConfig[key] = {
            ...newInputsConfig[key],
            ...customConfig.form.inputs[key],
          };
        }
      });
      inputsConfig = newInputsConfig;
    }
  }
  const { styling } = useStyling();

  const defaultInputs = Object.entries(inputsConfig).reduce(
    (acc, entry) => ({
      ...acc,
      [entry[0]]: entry[1].value,
    }),
    {},
  );

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
    const url =
      Object.keys(queryParams).length > 0
        ? `${formConfig.apiUrl}?${new URLSearchParams(queryParams)}`
        : formConfig.apiUrl;

    await request(() => clientApi.post(url, { ...inputs }), {
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
      },
    });
  };

  return (
    <form
      className={`${styling.components.card} space-y-4 ${styling.general.box} ${formConfig.className || ""}`}
      onSubmit={handleSubmit}
    >
      {formConfig.title && <Title>{formConfig.title}</Title>}
      {Object.entries(inputsConfig).map(([target, config]) => (
        <div key={target} className={`${styling.flex.col} space-y-2`}>
          {config.label && <Label>{config.label}</Label>}

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
              showCharacterCount={
                config.showCharacterCount ?? formConfig.showCharacterCount
              }
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
              showCharacterCount={
                config.showCharacterCount ?? formConfig.showCharacterCount
              }
            />
          )}

          {inputErrors[target] && (
            <p className="label text-error">{inputErrors[target]}</p>
          )}
        </div>
      ))}
      <div className={styling.flex.start}>
        <Button type="submit" isLoading={loading} variant="btn-primary">
          {formConfig.button || "Create"}
        </Button>
      </div>
      <MockForms type={type} />
    </form>
  );
}

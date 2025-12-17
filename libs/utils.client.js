import { defaultSetting as settings } from "@/libs/defaults";

export function formsMock(type = "") {
  if (!type || !settings.forms[type]?.mockConfig) return "";
  const { isEnabled, isError, isSuccess } = settings.forms[type].mockConfig;
  if (!isEnabled) return "";
  if (isError) return `Mock is enabled for "${type}" to respond with errors ❌`;
  if (isSuccess) return `Mock is enabled for "${type}" to respond with success ✅`;
  return "";
}

import { defaultSetting as settings } from "@/libs/defaults";

export function frontendMock(target = "") {
  if (!target || !settings.forms[target]?.mockConfig) return "";
  const { isEnabled, isError, isSuccess } = settings.forms[target].mockConfig;
  if (!isEnabled) return "";
  if (isError) return `Mock is enabled for "${target}" to respond with errors ❌`;
  if (isSuccess) return `Mock is enabled for "${target}" to respond with success ✅`;
  return "";
}

import { defaultSetting as settings } from "@/libs/defaults";

function isMockForms(type = "") {
  return settings.forms[type]?.mockConfig?.isEnabled;
}

function textMockForms(type = "") {
  if (!isMockForms(type)) {
    return "";
  }

  const { isError } = settings.forms[type].mockConfig;

  if (isError) {
    return `Mock is enabled for "${type}" to respond with errors ❌`;
  }

  return `Mock is enabled for "${type}" to respond with success ✅`;
}

export default function MockForms({ type }) {
  if (isMockForms(type)) {
    return (
      <div role="alert" className="alert">
        <span>{textMockForms(type)}</span>
      </div>
    );
  }
  return null;
}

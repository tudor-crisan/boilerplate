import { defaultSetting as settings } from "@/libs/defaults";

const getByPath = (obj = {}, path) => {
  return path
    .split(".")
    .reduce((acc, key) => acc?.[key], obj);
};

export const getMetadata = (target = "", variables = {}) => {
  const metadata = getByPath(settings?.metadata, target);

  if (!metadata) {
    return {}
  };

  let title = metadata?.title;
  let description = metadata?.description;

  Object.keys(variables).forEach((key) => {
    title = title?.replace(new RegExp(`{${key}}`, "g"), variables[key]);
    description = description?.replace(new RegExp(`{${key}}`, "g"), variables[key]);
  });

  return {
    title,
    description,
  };
};

export const metadata = getMetadata("modules.board");

import { defaultSetting as settings } from "@/libs/defaults";

const getByPath = (obj = {}, path) => {
  return path
    .split(".")
    .reduce((acc, key) => acc?.[key], obj);
};

export const getMetadata = (target = "") => {
  const metadata = getByPath(settings?.metadata, target);

  if (!metadata) {
    return {}
  };

  return {
    title: metadata?.title,
    description: metadata?.description,
  };
};

export const metadata = getMetadata("modules.board");

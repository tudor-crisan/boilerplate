import { copywriting } from "@/libs/copywritings";

export const getMetadata = () => ({
  title: copywriting.Metadata.title,
  description: copywriting.Metadata.description
});

import { z } from "zod";

export const VideoSlideSchema = z.object({
  id: z.number(),
  type: z
    .enum(["title", "feature", "end", "split", "transition"])
    .default("feature"),
  title: z.string(),
  subtitle: z.string().optional(),
  voiceover: z.string(),
  bg: z.string().default("bg-neutral-900"),
  textColor: z.string().default("text-white"),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  audio: z.string().optional(),
  animation: z
    .enum(["fade", "zoom", "slide-left", "slide-right", "bounce"])
    .default("fade"),
  imageFit: z
    .enum(["cover", "contain", "object-cover", "object-contain"])
    .default("cover"),
  imagePosition: z.string().optional(),
});

export const VideoSchema = z.object({
  id: z.string(),
  title: z.string(),
  format: z.enum(["16:9", "9:16"]),
  width: z.number(),
  height: z.number(),
  slides: z.array(VideoSlideSchema),
  music: z.string().optional(),
  musicOffset: z.number().default(0),
});

export const VideoPathSchema = z.object({
  source: z.string(),
  destination: z.string(),
});

export const VideoAppConfigSchema = z.object({
  defaultDuration: z.number().default(2000).optional(),
  paths: z.record(z.string(), VideoPathSchema),
});

export type VideoSlide = z.infer<typeof VideoSlideSchema>;
export type Video = z.infer<typeof VideoSchema>;
export type VideoAppConfig = z.infer<typeof VideoAppConfigSchema>;

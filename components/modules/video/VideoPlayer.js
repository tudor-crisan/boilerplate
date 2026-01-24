"use client";

import VideoSlide from "@/components/modules/video/VideoSlide";
import { AnimatePresence } from "framer-motion";

export default function VideoPlayer({
  currentSlide,
  replayKey,
  isVertical,
  styling,
  className = "",
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-900 shadow-md transition-all duration-300 border border-base-300 ${styling.components.card}
        ${isVertical ? "aspect-9/16 h-[80vh]" : "aspect-video w-full sm:w-6xl"}
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        <div key={`${currentSlide.id}-${replayKey}`} className="w-full h-full">
          <VideoSlide
            slide={{
              ...currentSlide,
              bg: currentSlide.bg || "bg-neutral-900",
              textColor: currentSlide.textColor || "text-white",
              type: currentSlide.type || "feature",
            }}
            isVertical={isVertical}
          />
        </div>
      </AnimatePresence>
    </div>
  );
}

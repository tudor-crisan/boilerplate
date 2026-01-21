"use client";

import VideoControls from "@/components/video/VideoControls";
import VideoSlide from "@/components/video/VideoSlide";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function VideoContainer({ video }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides = video.slides || [];
  const currentSlide = slides[currentSlideIndex];
  const isVertical = video.format === "9:16";

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1)
      setCurrentSlideIndex((curr) => curr + 1);
  }, [currentSlideIndex, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) setCurrentSlideIndex((curr) => curr - 1);
  }, [currentSlideIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex, nextSlide, prevSlide]);

  if (!currentSlide)
    return <div className="p-10">No slides found in this video config.</div>;

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center relative">
      {/* Aspect Ratio Container */}
      <div
        className={`relative overflow-hidden bg-gray-900 shadow-2xl transition-all duration-300
          ${isVertical ? "aspect-9/16 h-[95vh]" : "aspect-video w-[95vw]"}
        `}
      >
        <AnimatePresence mode="wait">
          <div key={currentSlide.id} className="w-full h-full">
            <VideoSlide slide={currentSlide} isVertical={isVertical} />
          </div>
        </AnimatePresence>

        {/* Voiceover Cue Over/Underlay */}
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-50">
          <p className="inline-block max-w-[90%] bg-black/40 backdrop-blur-md px-4 py-2 rounded text-white/80 text-sm font-mono border border-white/10">
            VO: &ldquo;{currentSlide.voiceover}&ldquo;
          </p>
        </div>

        {/* In-Video Controls - Only visible if we want them ON the video recording, usually we want them outside or hidden. 
             Placing them absolute but checking valid interactions. 
        */}
        <VideoControls
          onNext={nextSlide}
          onPrev={prevSlide}
          hasNext={currentSlideIndex < slides.length - 1}
          hasPrev={currentSlideIndex > 0}
        />
      </div>
    </div>
  );
}

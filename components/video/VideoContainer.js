"use client";

import Button from "@/components/button/Button";
import InputCopy from "@/components/input/InputCopy";
import InputFile from "@/components/input/InputFile";
import InputToggle from "@/components/input/InputToggle";
import SvgPause from "@/components/svg/SvgPause";
import SvgPlay from "@/components/svg/SvgPlay";
import VideoSlide from "@/components/video/VideoSlide";
import styling from "@/data/modules/styling.json";
import { toast } from "@/libs/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";

export default function VideoContainer({ video }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const appId = searchParams.get("appId");
  const videoId = video.id;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const audioRef = useRef(null);
  const slides = video.slides || [];
  const currentSlide = slides[currentSlideIndex];
  const isVertical = video.format === "9:16";
  const [isUploading, setIsUploading] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  // Key to force re-render of slide for replay
  const [replayKey, setReplayKey] = useState(0);

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1)
      setCurrentSlideIndex((curr) => curr + 1);
  }, [currentSlideIndex, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) setCurrentSlideIndex((curr) => curr - 1);
  }, [currentSlideIndex]);

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (isAutoplay && currentSlideIndex < slides.length - 1) {
      nextSlide();
    }
  };

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

  // Handle slide change & auto-play
  useEffect(() => {
    let timeoutId;

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current.currentTime = 0;

      if (currentSlide?.audio) {
        audioRef.current.src = currentSlide.audio;
        audioRef.current.load();

        if (isAutoplay) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch((e) => {
                console.log("Audio play failed or was interrupted", e);
                setIsPlaying(false);
              });
          }
        }
      } else if (isAutoplay) {
        // Fallback for slides without audio: wait 5 seconds then advance
        timeoutId = setTimeout(() => {
          if (currentSlideIndex < slides.length - 1) {
            nextSlide();
          }
        }, 5000);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentSlide, isAutoplay, nextSlide, currentSlideIndex, slides.length]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("appId", appId || "loyalboards"); // Default fallback or error
    formData.append("videoId", videoId);
    formData.append("slideId", currentSlide.id);

    try {
      const res = await fetch("/api/video/voiceover", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("VO uploaded successfully!");
        // Update local state to reflect change - normally we'd revalidate path
        // For now, we manually set it to trick the player to update immediately
        currentSlide.audio = data.path;

        // Auto-play the new uploaded file
        if (audioRef.current) {
          audioRef.current.src = data.path;
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        toast.error("Failed to upload VO");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error uploading VO");
    } finally {
      setIsUploading(false);
    }
  };

  if (!currentSlide)
    return <div className="p-10">No slides found in this video config.</div>;

  const roundedClass = styling.components.card.includes("rounded-2xl")
    ? "rounded-2xl"
    : "rounded-md";

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 gap-8">
      <audio ref={audioRef} className="hidden" onEnded={handleAudioEnded} />

      {/* Video Player */}
      <div
        className={`relative overflow-hidden bg-gray-900 shadow-md transition-all duration-300 border border-base-300 ${roundedClass}
          ${isVertical ? "aspect-9/16 h-[80vh]" : "aspect-video w-full max-w-6xl"}
        `}
      >
        <AnimatePresence mode="wait">
          <div
            key={`${currentSlide.id}-${replayKey}`}
            className="w-full h-full"
          >
            <VideoSlide slide={currentSlide} isVertical={isVertical} />
          </div>
        </AnimatePresence>
      </div>

      {/* Control Bar */}
      <div
        className={`w-full max-w-3xl flex items-center justify-between bg-base-100 p-4 shadow-md border border-base-300 ${styling.components.element}`}
      >
        <Button
          onClick={() => router.push(pathname)}
          variant="btn-ghost hover:bg-base-200"
          size="btn-sm"
        >
          ← Back to Gallery
        </Button>

        <div className="flex bg-base-200 rounded-lg p-1 gap-1">
          <Button
            onClick={prevSlide}
            disabled={currentSlideIndex <= 0}
            variant="btn-ghost hover:bg-base-300"
            size="btn-sm"
          >
            Prev
          </Button>
          <span className="flex items-center px-2 text-xs font-mono opacity-50">
            {currentSlideIndex + 1} / {slides.length}
          </span>
          <Button
            onClick={nextSlide}
            disabled={currentSlideIndex >= slides.length - 1}
            variant="btn-ghost hover:bg-base-300"
            size="btn-sm"
          >
            Next
          </Button>
        </div>

        <Button onClick={handleReplay} variant="btn-outline" size="btn-sm">
          Replay Slide
        </Button>
      </div>

      {/* Voiceover Section */}
      <div className="w-full max-w-xl space-y-6">
        {/* VO Text */}
        <div>
          <p className="text-sm font-bold mb-2 ml-1">Voiceover Script</p>
          <InputCopy value={currentSlide.voiceover} tooltipCopy="Copy Script">
            {currentSlide.audio && (
              <Button
                onClick={togglePlay}
                variant="btn-square btn-ghost btn-sm text-primary"
                title={isPlaying ? "Pause Audio" : "Play Audio"}
              >
                {isPlaying ? (
                  <SvgPause size="size-5" />
                ) : (
                  <SvgPlay size="size-5" />
                )}
              </Button>
            )}
          </InputCopy>
        </div>

        {/* Upload & Autoplay Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-[300px]">
              <InputFile
                accept="audio/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                placeholder={isUploading ? "Uploading..." : "Upload New VO"}
                className="m-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-lg border border-base-200">
            <span className="text-sm font-medium opacity-70">
              Autoplay Slides
            </span>
            <InputToggle
              value={isAutoplay}
              onChange={setIsAutoplay}
              size="toggle-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

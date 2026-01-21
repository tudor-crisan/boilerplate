"use client";

import Button from "@/components/button/Button";
import Paragraph from "@/components/common/Paragraph";
import InputCopy from "@/components/input/InputCopy";
import InputFile from "@/components/input/InputFile";
import InputToggle from "@/components/input/InputToggle";
import SvgPause from "@/components/svg/SvgPause";
import SvgPlay from "@/components/svg/SvgPlay";
import VideoSlide from "@/components/video/VideoSlide";
import { useStyling } from "@/context/ContextStyling";
import { toast } from "@/libs/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";

export default function VideoContainer({ video }) {
  const { styling } = useStyling();
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
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [replayKey, setReplayKey] = useState(0);

  // Default duration from video config or 2000ms
  const defaultDuration = video.defaultDuration || 2000;

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1)
      setCurrentSlideIndex((curr) => curr + 1);
  }, [currentSlideIndex, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) setCurrentSlideIndex((curr) => curr - 1);
  }, [currentSlideIndex]);

  const handleRestart = useCallback(() => {
    setCurrentSlideIndex(0);
    setReplayKey((prev) => prev + 1);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [playbackSpeed]);

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  const goToFirst = () => setCurrentSlideIndex(0);
  const goToLast = () => setCurrentSlideIndex(slides.length - 1);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.playbackRate = playbackSpeed;
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
      if ((e.altKey && e.key.toLowerCase() === "s") || e.key === "Home") {
        e.preventDefault();
        handleRestart();
      } else if (e.key === "ArrowRight" || e.key === "Space") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "End") {
        e.preventDefault();
        goToLast();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex, nextSlide, prevSlide, handleRestart, goToLast]);

  // Handle slide change & auto-play
  useEffect(() => {
    let timeoutId;

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackSpeed;

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
        // Fallback for slides without audio: advance after default duration / speed
        const duration = defaultDuration / playbackSpeed;
        timeoutId = setTimeout(() => {
          if (currentSlideIndex < slides.length - 1) {
            nextSlide();
          }
        }, duration);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    currentSlide,
    isAutoplay,
    nextSlide,
    currentSlideIndex,
    slides.length,
    playbackSpeed,
    defaultDuration,
  ]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("appId", appId || "loyalboards");
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
        currentSlide.audio = data.path;

        if (audioRef.current) {
          audioRef.current.src = data.path;
          audioRef.current.playbackRate = playbackSpeed;
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

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 gap-8">
      <audio ref={audioRef} className="hidden" onEnded={handleAudioEnded} />

      {/* Video Player */}
      <div
        className={`relative overflow-hidden bg-gray-900 shadow-xl transition-all duration-300 border border-base-300 ${styling.components.card}
          ${isVertical ? "aspect-9/16 h-[80vh]" : "aspect-video w-full max-w-6xl"}
        `}
      >
        <AnimatePresence mode="wait">
          <div
            key={`${currentSlide.id}-${replayKey}`}
            className="w-full h-full"
          >
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

      {/* Control Bar */}
      <div
        className={`w-full max-w-6xl flex flex-col md:flex-row items-center justify-between bg-base-100 p-4 gap-4 sm:gap-6 shadow-md border border-base-300 ${styling.components.element}`}
      >
        {/* Left: Action Group */}
        <div className="flex items-center justify-center gap-2 w-full md:w-auto">
          <Button
            onClick={() => router.push(pathname)}
            size="btn-sm"
            variant="btn-ghost"
            className="flex-1 md:flex-none"
          >
            ← Gallery
          </Button>

          <div className="flex flex-col items-center gap-0.5 min-w-24">
            <Button
              onClick={handleRestart}
              variant="btn-primary"
              size="btn-sm"
              className="w-full"
            >
              Restart (ALT+S)
            </Button>
          </div>
        </div>

        {/* Center: Playback Group */}
        <div className="flex items-center justify-center gap-3 bg-base-200/50 px-4 py-2 rounded-lg w-full md:w-auto">
          <span className="text-[10px] font-bold uppercase opacity-50">
            Speed
          </span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="range range-xs range-primary w-20 sm:w-28"
          />
          <span className="text-xs font-mono w-8">{playbackSpeed}x</span>
        </div>

        {/* Right: Navigation Group */}
        <div className="flex items-center justify-center gap-1 bg-base-200/50 p-1 rounded-lg w-full md:w-auto">
          <Button
            onClick={goToFirst}
            disabled={currentSlideIndex <= 0}
            variant="btn-ghost"
            size="btn-xs"
            className="px-2"
          >
            &lt;&lt; First
          </Button>
          <div className="h-4 w-[1px] bg-base-300 mx-0.5" />
          <Button
            onClick={prevSlide}
            disabled={currentSlideIndex <= 0}
            variant="btn-outline"
            size="btn-sm"
          >
            Prev
          </Button>

          <span className="flex items-center px-3 text-[10px] sm:text-xs font-mono opacity-50 whitespace-nowrap">
            {currentSlideIndex + 1} / {slides.length}
          </span>

          <Button
            onClick={nextSlide}
            disabled={currentSlideIndex >= slides.length - 1}
            variant="btn-outline"
            size="btn-sm"
          >
            Next
          </Button>
          <div className="h-4 w-[1px] bg-base-300 mx-0.5" />
          <Button
            onClick={goToLast}
            disabled={currentSlideIndex >= slides.length - 1}
            variant="btn-ghost"
            size="btn-xs"
            className="px-2"
          >
            Last &gt;&gt;
          </Button>
        </div>
      </div>

      {/* Voiceover Section */}
      <div className="w-full max-w-xl space-y-6">
        <div>
          <Paragraph className="font-bold mb-1">Voiceover Script</Paragraph>
          <InputCopy value={currentSlide.voiceover} tooltipCopy="Copy Script">
            <div className="flex items-center gap-1 border-l border-base-300 pl-2 ml-2">
              <Button
                onClick={handleReplay}
                variant="btn-ghost btn-sm text-primary"
                size="btn-xs"
                title="Replay slide"
              >
                Replay
              </Button>
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
            </div>
          </InputCopy>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4">
          <div className="w-full sm:flex-1">
            <InputFile
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              placeholder={isUploading ? "Uploading..." : "Upload New VO"}
              className="m-0"
            />
          </div>

          <div
            className={`flex items-center justify-between sm:justify-center gap-3 bg-base-100 px-4 py-2 border border-base-200 w-full sm:w-auto ${styling.components.element}`}
          >
            <span className="text-sm font-medium opacity-70 whitespace-nowrap">
              Autoplay
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

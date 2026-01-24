"use client";

import VideoPlayer from "@/components/video/VideoPlayer";
import { useStyling } from "@/context/ContextStyling";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function RenderPage() {
  const { styling } = useStyling();
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");

  // State
  const [video, setVideo] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Refs
  const audioRef = useRef(null);

  // Load video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch("/api/video");
        const data = await res.json();
        if (data.success && data.videos) {
          const foundVideo = data.videos.find((v) => v.id === videoId);
          if (foundVideo) {
            setVideo(foundVideo);
          }
        }
      } catch (error) {
        console.error("Failed to load video", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const slides = video?.slides || [];
  const currentSlide = slides[currentSlideIndex];
  const isVertical = video?.format === "9:16";
  const defaultDuration = video?.defaultDuration || 1000;

  // Render Controller - Exposed to window for Puppeteer
  useEffect(() => {
    window.renderController = {
      start: () => setIsPlaying(true),
      next: () => {
        if (currentSlideIndex < slides.length - 1) {
          setCurrentSlideIndex((prev) => prev + 1);
          return true;
        }
        return false;
      },
      goto: (index) => setCurrentSlideIndex(index),
      getCurrentIndex: () => currentSlideIndex,
      getTotalSlides: () => slides.length,
      isPlaying: () => isPlaying,
    };
  }, [currentSlideIndex, slides.length, isPlaying]);

  // Auto-play logic (simplified for recording)
  // In recording mode, we might want to control this strictly via Puppeteer
  // But for now, let's keep it simple: Puppeteer will likely just wait for a specific duration per slide
  // OR we can make this auto-play linearly.

  // Let's rely on Puppeteer to advance slides to ensure we capture everything perfectly.
  // Actually, for fluent recording, auto-playing here with audio sync is better,
  // provided Puppeteer records in real-time.

  useEffect(() => {
    if (!isPlaying || !currentSlide) return;

    let timeoutId;

    // Handle Audio
    // Handle Audio (Timing only, no playback)
    if (currentSlide.audio) {
      const audio = new Audio(currentSlide.audio);
      audio.onloadedmetadata = () => {
        const durationMs = audio.duration * 1000;
        // console.log(`Slide ${currentSlideIndex} duration: ${durationMs}`);
        timeoutId = setTimeout(() => {
          nextSlide();
        }, durationMs);
      };

      // Fallback if audio fails to load
      audio.onerror = () => {
        console.warn("Audio load failed, using default duration");
        timeoutId = setTimeout(() => {
          nextSlide();
        }, defaultDuration);
      };
    } else {
      // No audio, use duration
      const duration = currentSlide.duration || defaultDuration;
      timeoutId = setTimeout(() => {
        nextSlide();
      }, duration);
    }

    function nextSlide() {
      if (currentSlideIndex < slides.length - 1) {
        setCurrentSlideIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
        window.videoRenderingComplete = true;
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    isPlaying,
    currentSlide,
    currentSlideIndex,
    slides.length,
    defaultDuration,
  ]);

  if (isLoading) return <div>Loading...</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div
      className={`video-render-container overflow-hidden bg-black flex items-center justify-center`}
    >
      {/* We use a specific container size to match the video format */}
      <div
        id="video-frame"
        className={`relative overflow-hidden bg-white
                ${isVertical ? "w-[1080px] h-[1920px]" : "w-[1920px] h-[1080px]"}
            `}
        style={{
          transform: "scale(1)", // Ensure no scaling affects recording
          transformOrigin: "center center",
        }}
      >
        <VideoPlayer
          currentSlide={currentSlide}
          isVertical={isVertical}
          styling={styling}
          replayKey={currentSlideIndex} // Force re-render on slide change
        />
      </div>
      <style jsx global>{`
        html {
          font-size: ${isVertical ? "18px" : "26px"};
        }
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        .nextjs-toast-errors-parent,
        [data-nextjs-toast],
        .nextjs-static-indicator-toast-wrapper,
        #devtools-indicator,
        #next-logo {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `}</style>
    </div>
  );
}

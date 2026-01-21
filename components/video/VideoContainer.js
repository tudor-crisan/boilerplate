"use client";

import Button from "@/components/button/Button";
import Paragraph from "@/components/common/Paragraph";
import TextSmall from "@/components/common/TextSmall";
import InputCopy from "@/components/input/InputCopy";
import InputFile from "@/components/input/InputFile";
import InputRange from "@/components/input/InputRange";
import InputToggle from "@/components/input/InputToggle";
import SvgPause from "@/components/svg/SvgPause";
import SvgPlay from "@/components/svg/SvgPlay";
import SvgReplay from "@/components/svg/SvgReplay";
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
  const musicRef = useRef(null);
  const slides = video.slides || [];
  const currentSlide = slides[currentSlideIndex];
  const isVertical = video.format === "9:16";
  const [isUploading, setIsUploading] = useState(false);
  const [isMusicUploading, setIsMusicUploading] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [replayKey, setReplayKey] = useState(0);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [musicInputKey, setMusicInputKey] = useState(0);

  // Music state
  const [musicUrl, setMusicUrl] = useState(video.music || "");
  const [musicOffset, setMusicOffset] = useState(video.musicOffset || 0);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [isVoMuted, setIsVoMuted] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);

  // Sync state with video prop for gallery navigation
  useEffect(() => {
    setMusicUrl(video.music || "");
    setMusicOffset(video.musicOffset || 0);
  }, [video]);

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

    // Reset VO
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => {});
    }

    // Reset Music
    if (musicRef.current) {
      musicRef.current.currentTime = musicOffset;
    }
  }, [playbackSpeed, musicOffset]);

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  const goToFirst = () => {
    setCurrentSlideIndex(0);
    if (musicRef.current) musicRef.current.currentTime = musicOffset;
  };
  const goToLast = () => setCurrentSlideIndex(slides.length - 1);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (audioRef.current) {
      if (nextState) {
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (isAutoplay && currentSlideIndex < slides.length - 1) {
      nextSlide();
    }
  };

  // Sync music volume/mute
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.muted = isMusicMuted;
      musicRef.current.volume = musicVolume;
    }
  }, [isMusicMuted, musicVolume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isVoMuted;
    }
  }, [isVoMuted]);

  // Sync music offset when it changes manually
  useEffect(() => {
    if (musicRef.current && !isPlaying) {
      musicRef.current.currentTime = musicOffset;
    }
  }, [musicOffset, isPlaying]);

  // Centralized Music Playback Control
  useEffect(() => {
    if (!musicRef.current) return;

    if (isPlaying) {
      if (musicRef.current.paused) {
        // Ensure starting at offset if it's the beginning
        if (musicRef.current.currentTime === 0 && musicOffset > 0) {
          musicRef.current.currentTime = musicOffset;
        }
        musicRef.current.play().catch(() => {});
      }
    } else {
      musicRef.current.pause();
    }
  }, [isPlaying, musicUrl, musicOffset]);

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
        setFileInputKey((prev) => prev + 1);
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

  const handleMusicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsMusicUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("appId", appId || "loyalboards");
    formData.append("videoId", videoId);
    formData.append("isGlobal", "true");

    try {
      const res = await fetch("/api/video/music", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Music uploaded successfully!");
        setMusicUrl(data.path);
        setMusicInputKey((prev) => prev + 1);
        if (musicRef.current) {
          musicRef.current.src = data.path;
        }
      } else {
        toast.error("Failed to upload music");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error uploading music");
    } finally {
      setIsMusicUploading(false);
    }
  };

  if (!currentSlide)
    return <div className="p-10">No slides found in this video config.</div>;

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 gap-8">
      <audio ref={audioRef} className="hidden" onEnded={handleAudioEnded} />
      {musicUrl && (
        <audio
          ref={musicRef}
          src={musicUrl}
          className="hidden"
          loop
          muted={isMusicMuted}
        />
      )}

      {/* Video Player */}
      <div
        className={`relative overflow-hidden bg-gray-900 shadow-xl transition-all duration-300 border border-base-300 ${styling.components.card}
          ${isVertical ? "aspect-9/16 h-[80vh]" : "aspect-video w-full sm:w-6xl"}
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
        className={`w-full sm:w-6xl flex flex-col md:flex-row items-center justify-between bg-base-100 p-4 gap-4 sm:gap-6 shadow-md border border-base-300 ${styling.components.element}`}
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
          <InputRange
            min="0.5"
            max="2"
            step="0.1"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="w-20 sm:w-28"
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

      {/* Voiceover & Music Selection */}
      <div className="w-full sm:w-6xl flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start gap-10 sm:gap-16">
          {/* Voiceover Group */}
          <div className="flex flex-col gap-4 w-full sm:w-1/2">
            <div className="flex items-center justify-between">
              <Paragraph className="font-bold opacity-70">
                Voiceover Settings
              </Paragraph>
              <div className="flex items-center gap-2 bg-base-100 px-3 py-1 border border-base-200 rounded-lg">
                <TextSmall className="font-semibold opacity-60">
                  VO Mute
                </TextSmall>
                <InputToggle
                  value={isVoMuted}
                  onChange={setIsVoMuted}
                  size="toggle-xs"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-4">
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
              <div className="w-full sm:flex-1">
                <InputFile
                  key={fileInputKey}
                  accept="audio/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  placeholder={isUploading ? "Uploading..." : "Replace VO"}
                  className="m-0"
                />
              </div>
            </div>

            <div>
              <TextSmall className="font-bold opacity-40 uppercase mb-1">
                Current Script
              </TextSmall>
              <InputCopy
                value={currentSlide.voiceover}
                tooltipCopy="Copy Script"
              >
                {currentSlide.audio && (
                  <div className="flex items-center gap-1 border-l border-base-300 pl-2 ml-2">
                    <Button
                      onClick={handleReplay}
                      variant="btn-square btn-ghost btn-sm text-primary"
                      title="Replay slide"
                    >
                      <SvgReplay size="size-5" />
                    </Button>
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
                  </div>
                )}
              </InputCopy>
            </div>
          </div>

          {/* Background Music Group */}
          <div className="flex flex-col gap-4 w-full sm:w-1/2">
            <div className="flex items-center justify-between">
              <Paragraph className="font-bold opacity-70">
                Background Music
              </Paragraph>
              <div className="flex items-center gap-2 bg-base-100 px-3 py-1 border border-base-200 rounded-lg">
                <TextSmall className="font-semibold opacity-60">
                  Music Mute
                </TextSmall>
                <InputToggle
                  value={isMusicMuted}
                  onChange={setIsMusicMuted}
                  size="toggle-xs"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <InputFile
                key={musicInputKey}
                accept="audio/*"
                onChange={handleMusicUpload}
                disabled={isMusicUploading}
                placeholder={
                  isMusicUploading ? "Uploading..." : "Choose Music Track"
                }
                className="m-0"
              />

              {/* Music Offset Slider - Now Inside Group */}
              <div
                className={`flex flex-col gap-2 bg-base-100 p-3 border border-base-200 ${styling.components.element}`}
              >
                <div className="flex justify-between items-center">
                  <TextSmall className="font-bold opacity-40 uppercase">
                    Music Start Point
                  </TextSmall>
                  <span className="text-xs font-mono opacity-60 bg-base-200 px-2 py-0.5 rounded">
                    {musicOffset}s
                  </span>
                </div>
                <InputRange
                  min="0"
                  max="120"
                  step="1"
                  value={musicOffset}
                  onChange={(e) => setMusicOffset(parseInt(e.target.value))}
                  className="w-full"
                />
                <TextSmall className="opacity-40 text-center">
                  Select where in the track to start (0 - 120s)
                </TextSmall>
              </div>

              {/* Music Volume Slider */}
              <div
                className={`flex flex-col gap-2 bg-base-100 p-3 border border-base-200 ${styling.components.element}`}
              >
                <div className="flex justify-between items-center">
                  <TextSmall className="font-bold opacity-40 uppercase">
                    Background Volume
                  </TextSmall>
                  <span className="text-xs font-mono opacity-60 bg-base-200 px-2 py-0.5 rounded">
                    {Math.round(musicVolume * 100)}%
                  </span>
                </div>
                <InputRange
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  color="primary"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

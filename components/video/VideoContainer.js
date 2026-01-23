"use client";

import VideoControlBar from "@/components/video/VideoControlBar";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoSettingsMusic from "@/components/video/VideoSettingsMusic";
import VideoSettingsVoiceover from "@/components/video/VideoSettingsVoiceover";
import { useStyling } from "@/context/ContextStyling";
import { toast } from "@/libs/toast";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const [slides, setSlides] = useState(video.slides || []);
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
  const [slideDurations, setSlideDurations] = useState([]);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);

  // Music state
  const [musicUrl, setMusicUrl] = useState(video.music || "");
  const [musicOffset, setMusicOffset] = useState(video.musicOffset || 0);
  const [musicVolume, setMusicVolume] = useState(
    video.musicVolume !== undefined ? video.musicVolume : 0.3,
  ); // Lowered from 0.5 to 0.3 default
  const [voVolume, setVoVolume] = useState(
    video.voVolume !== undefined ? video.voVolume : 1.0,
  );
  const [isVoMuted, setIsVoMuted] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  
  // Save Configuration Handler
  const saveVideoConfig = useCallback(
    async (updatedData) => {
      try {
        await fetch("/api/video/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appId: appId || "loyalboards",
            videoId: video.id,
            videoData: updatedData,
          }),
        });
      } catch (error) {
        console.error("Failed to save configuration", error);
        toast.error("Failed to save changes");
      }
    },
    [appId, video.id],
  );

  // Auto-save Volume changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveVideoConfig({
        voVolume,
        musicVolume,
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [voVolume, musicVolume, saveVideoConfig]);

  // Slide Handlers
  const handleUpdateSlide = (index, updatedSlide) => {
    const newSlides = [...slides];
    newSlides[index] = updatedSlide;
    setSlides(newSlides);
    saveVideoConfig({ slides: newSlides });
  };

  const handleAddSlide = () => {
    const newId = Math.max(...slides.map((s) => s.id || 0), 0) + 1;
    const newSlide = {
      id: newId,
      type: "feature",
      title: "New Slide",
      voiceover: "",
      bg: "bg-base-100",
      textColor: "text-neutral",
      animation: "fade",
    };
    const newSlides = [...slides, newSlide];
    setSlides(newSlides);
    saveVideoConfig({ slides: newSlides });
    setCurrentSlideIndex(newSlides.length - 1);
  };

  const handleDeleteSlide = (index) => {
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    saveVideoConfig({ slides: newSlides });
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(Math.max(0, newSlides.length - 1));
    }
  };

  const handleMoveSlide = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= slides.length) return;
    const newSlides = [...slides];
    const [movedSlide] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, movedSlide);
    setSlides(newSlides);
    saveVideoConfig({ slides: newSlides });
    if (currentSlideIndex === fromIndex) {
      setCurrentSlideIndex(toIndex);
    } else if (
        currentSlideIndex > fromIndex &&
        currentSlideIndex <= toIndex
    ) {
        setCurrentSlideIndex(currentSlideIndex - 1);
    } else if (
        currentSlideIndex < fromIndex &&
        currentSlideIndex >= toIndex
    ) {
        setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  // Sync state with video prop for gallery navigation
  useEffect(() => {
    setMusicUrl(video.music || "");
    setMusicOffset(video.musicOffset || 0);
  }, [video]);

  const defaultDuration = video.defaultDuration || 2000;

  // Initialize and pre-load slide durations
  useEffect(() => {
    const initial = slides.map((s) => s.duration || defaultDuration);
    setSlideDurations(initial);

    // Fetch actual durations for slides with audio
    const loadDurations = async () => {
      const updated = [...initial];
      const promises = slides.map((s, idx) => {
        if (s.audio) {
          return new Promise((resolve) => {
            const tempAudio = new Audio();
            tempAudio.onloadedmetadata = () => {
              updated[idx] = tempAudio.duration * 1000;
              resolve();
            };
            tempAudio.onerror = () => resolve();
            tempAudio.src = s.audio;
          });
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      setSlideDurations(updated);
    };

    loadDurations();
  }, [video, defaultDuration, slides]);

  // Track current audio time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentAudioTime(audio.currentTime * 1000);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Calculate times
  const totalTime = slideDurations.reduce((a, b) => a + b, 0) / playbackSpeed;
  const elapsedBefore =
    slideDurations.slice(0, currentSlideIndex).reduce((a, b) => a + b, 0) /
    playbackSpeed;
  const currentTime = elapsedBefore + currentAudioTime / playbackSpeed;

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
        setIsAutoplay(false); // Stop autoplay when manually paused
      }
    }
  };

  const handleAudioEnded = () => {
    if (isAutoplay && currentSlideIndex < slides.length - 1) {
      // Keep isPlaying true and move to next
      nextSlide();
    } else {
      setIsPlaying(false);
      if (currentSlideIndex === slides.length - 1) {
        setIsAutoplay(false); // Stop autoplay at the end
      }
    }
  };

  // Sync music volume/mute
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.muted = isMusicMuted;
      musicRef.current.volume = musicVolume * 0.3; // Custom scale to make music quieter as requested
    }
  }, [isMusicMuted, musicVolume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isVoMuted;
      audioRef.current.volume = voVolume;
    }
  }, [isVoMuted, voVolume]);

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
      } else if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsAutoplay((prev) => !prev);
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
      // Only set to false if we're not currently playing (prevents music flicker)
      if (!isPlaying) setIsPlaying(false);

      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackSpeed;
      setCurrentAudioTime(0);

      if (currentSlide?.audio) {
        audioRef.current.src = currentSlide.audio;
        audioRef.current.load();
        audioRef.current.playbackRate = playbackSpeed;

        if (isAutoplay || isPlaying) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                if (audioRef.current)
                  audioRef.current.playbackRate = playbackSpeed;
                setIsPlaying(true);
              })
              .catch((e) => {
                console.log("Audio play failed or was interrupted", e);
                // Don't forcefully set to false here to keep music playing if it was
              });
          }
        }
      } else if (isAutoplay || isPlaying) {
        // Fallback for slides without audio: advance after default duration / speed
        const duration = defaultDuration / playbackSpeed;
        timeoutId = setTimeout(() => {
          if (currentSlideIndex < slides.length - 1) {
            nextSlide();
          } else {
            setIsPlaying(false);
            setIsAutoplay(false); // Stop at end for non-audio slides too
          }
        }, duration);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    isPlaying,
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
      <VideoPlayer
        currentSlide={currentSlide}
        replayKey={replayKey}
        isVertical={isVertical}
        styling={styling}
      />

      {/* Control Bar */}
      <VideoControlBar
        styling={styling}
        router={router}
        pathname={pathname}
        handleRestart={handleRestart}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
        goToFirst={goToFirst}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
        goToLast={goToLast}
        currentTime={currentTime}
        totalTime={totalTime}
        currentSlideIndex={currentSlideIndex}
        slidesLength={slides.length}
      />

      {/* Voiceover & Music Selection */}
      <div className="w-full sm:w-6xl flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start gap-10 sm:gap-16">
          <VideoSettingsVoiceover
            isVoMuted={isVoMuted}
            setIsVoMuted={setIsVoMuted}
            isAutoplay={isAutoplay}
            setIsAutoplay={setIsAutoplay}
            voVolume={voVolume}
            setVoVolume={setVoVolume}
            fileInputKey={fileInputKey}
            handleFileUpload={handleFileUpload}
            isUploading={isUploading}
            currentSlide={currentSlide}
            handleReplay={handleReplay}
            togglePlay={togglePlay}
            isPlaying={isPlaying}
            styling={styling}
            currentSlideIndex={currentSlideIndex}
            totalSlides={slides.length}
            handleUpdateSlide={handleUpdateSlide}
            handleAddSlide={handleAddSlide}
            handleDeleteSlide={handleDeleteSlide}
            handleMoveSlide={handleMoveSlide}
          />

          <VideoSettingsMusic
            musicUrl={musicUrl}
            isMusicMuted={isMusicMuted}
            setIsMusicMuted={setIsMusicMuted}
            musicInputKey={musicInputKey}
            handleMusicUpload={handleMusicUpload}
            isMusicUploading={isMusicUploading}
            musicOffset={musicOffset}
            setMusicOffset={setMusicOffset}
            musicVolume={musicVolume}
            setMusicVolume={setMusicVolume}
            styling={styling}
          />
        </div>
      </div>
    </div>
  );
}

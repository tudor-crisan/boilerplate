"use client";

import { useStyling } from "@/context/ContextStyling";
import useUndoRedo from "@/hooks/useUndoRedo";
import { toast } from "@/libs/toast";
import HistoryControl from "@/modules/video/components/HistoryControl";
import VideoControlBar from "@/modules/video/components/VideoControlBar";
import VideoPlayer from "@/modules/video/components/VideoPlayer";
import VideoSettingsMusic from "@/modules/video/components/VideoSettingsMusic";
import VideoSettingsVoiceover from "@/modules/video/components/VideoSettingsVoiceover";
import VideoSlideEditor from "@/modules/video/components/VideoSlideEditor";
import useVideoAudio from "@/modules/video/hooks/useVideoAudio";
import useVideoPlayback from "@/modules/video/hooks/useVideoPlayback";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function VideoContainer({ video }) {
  const { styling } = useStyling();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const appId = searchParams.get("appId");
  const videoId = video.id;
  const audioRef = useRef(null);
  const musicRef = useRef(null);

  // Undo/Redo State Manager
  const {
    state: videoState,
    set: setVideoState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    history,
    jumpTo,
    currentIndex: historyIndex,
  } = useUndoRedo({
    slides: video.slides || [],
    music: video.music || "",
    musicOffset: video.musicOffset || 0,
    musicVolume: video.musicVolume !== undefined ? video.musicVolume : 0.3,
    voVolume: video.voVolume !== undefined ? video.voVolume : 1.0,
  });

  // Derived state from undo/redo manager
  const slides = videoState.slides;
  const musicUrl = videoState.music;
  const musicOffset = videoState.musicOffset;
  const musicVolume = videoState.musicVolume;
  const voVolume = videoState.voVolume;

  const isVertical = video.format === "9:16";
  const [isUploading, setIsUploading] = useState(false);
  const [isMusicUploading, setIsMusicUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [musicInputKey, setMusicInputKey] = useState(0);

  // Audio & Playback Hooks
  const {
    currentSlideIndex,
    setCurrentSlideIndex,
    isPlaying,
    setIsPlaying,
    isAutoplay,
    setIsAutoplay,
    playbackSpeed,
    setPlaybackSpeed,
    replayKey,
    nextSlide,
    prevSlide,
    goToFirst,
    goToLast,
    handleRestart,
    handleReplay,
    togglePlay,
  } = useVideoPlayback({
    slides,
    audioRef,
    musicRef,
    musicOffset,
  });

  const currentSlide = slides[currentSlideIndex];

  const {
    isVoMuted,
    setIsVoMuted,
    isMusicMuted,
    setIsMusicMuted,
    currentAudioTime,
    slideDurations,
  } = useVideoAudio({
    audioRef,
    musicRef,
    slides,
    musicUrl,
    musicVolume,
    voVolume,
    musicOffset,
    isPlaying,
  });

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

  // Auto-save any content changes
  useEffect(() => {
    saveVideoConfig(videoState);
  }, [videoState, saveVideoConfig]);

  // Slide Handlers
  const handleUpdateSlide = (index, updatedSlide) => {
    const newSlides = [...slides];
    newSlides[index] = updatedSlide;

    // Determine description based on changed field (simple heuristic)
    let desc = "Update Slide";
    if (updatedSlide.title !== slides[index].title) desc = "Update Title";
    if (updatedSlide.image !== slides[index].image) desc = "Update Image";
    if (updatedSlide.type !== slides[index].type) desc = "Change Slide Type";

    setVideoState({ ...videoState, slides: newSlides }, desc);
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
    setVideoState({ ...videoState, slides: newSlides }, "Add Slide");
    setCurrentSlideIndex(newSlides.length - 1);
  };

  const handleDeleteSlide = (index) => {
    const newSlides = slides.filter((_, i) => i !== index);
    setVideoState({ ...videoState, slides: newSlides }, "Delete Slide");
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(Math.max(0, newSlides.length - 1));
    }
  };

  const handleMoveSlide = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= slides.length) return;
    const newSlides = [...slides];
    const [movedSlide] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, movedSlide);
    setVideoState({ ...videoState, slides: newSlides }, "Reorder Slides");
    if (currentSlideIndex === fromIndex) {
      setCurrentSlideIndex(toIndex);
    } else if (currentSlideIndex > fromIndex && currentSlideIndex <= toIndex) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else if (currentSlideIndex < fromIndex && currentSlideIndex >= toIndex) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  // Calculate times
  const totalTime = slideDurations.reduce((a, b) => a + b, 0) / playbackSpeed;
  const elapsedBefore =
    slideDurations.slice(0, currentSlideIndex).reduce((a, b) => a + b, 0) /
    playbackSpeed;
  const currentTime = elapsedBefore + currentAudioTime / playbackSpeed;

  const handleAudioEnded = () => {
    if (isAutoplay && currentSlideIndex < slides.length - 1) {
      nextSlide();
    } else {
      setIsPlaying(false);
      if (currentSlideIndex === slides.length - 1) {
        setIsAutoplay(false);
      }
    }
  };

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
        const newSlides = [...slides];
        newSlides[currentSlideIndex] = { ...currentSlide, audio: data.path };
        setVideoState({ ...videoState, slides: newSlides }, "Upload Voiceover");

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
        setVideoState({ ...videoState, music: data.path }, "Upload Music");
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
        undoContent={
          <HistoryControl
            onUndo={undo}
            onRedo={redo}
            onReset={reset}
            onJumpTo={jumpTo}
            canUndo={canUndo}
            canRedo={canRedo}
            history={history}
            currentIndex={historyIndex}
          />
        }
      />

      {/* Settings Grid */}
      <div className="w-full sm:w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Slide Editor */}
        <div className="w-full">
          <VideoSlideEditor
            slide={currentSlide}
            index={currentSlideIndex}
            totalSlides={slides.length}
            slides={slides} // Pass all slides for navigator
            onUpdate={handleUpdateSlide}
            onAdd={handleAddSlide}
            onDelete={handleDeleteSlide}
            onMove={handleMoveSlide}
            onSelect={setCurrentSlideIndex} // Handler for navigator click
            onRefresh={handleReplay}
          />
        </div>

        {/* Right Column: Global Settings */}
        <div className="w-full flex flex-col gap-8">
          <VideoSettingsVoiceover
            isVoMuted={isVoMuted}
            setIsVoMuted={setIsVoMuted}
            isAutoplay={isAutoplay}
            setIsAutoplay={setIsAutoplay}
            voVolume={voVolume}
            setVoVolume={(val) =>
              setVideoState({ ...videoState, voVolume: val }, "Volume Change")
            }
            fileInputKey={fileInputKey}
            handleFileUpload={handleFileUpload}
            isUploading={isUploading}
            currentSlide={currentSlide}
            handleReplay={handleReplay}
            togglePlay={togglePlay}
            isPlaying={isPlaying}
            styling={styling}
            handleUpdateSlide={handleUpdateSlide}
            currentSlideIndex={currentSlideIndex}
          />

          <VideoSettingsMusic
            musicUrl={musicUrl}
            isMusicMuted={isMusicMuted}
            setIsMusicMuted={setIsMusicMuted}
            musicInputKey={musicInputKey}
            handleMusicUpload={handleMusicUpload}
            isMusicUploading={isMusicUploading}
            musicOffset={musicOffset}
            setMusicOffset={(val) =>
              setVideoState({ ...videoState, musicOffset: val }, "Music Offset")
            }
            musicVolume={musicVolume}
            setMusicVolume={(val) =>
              setVideoState({ ...videoState, musicVolume: val }, "Music Volume")
            }
            styling={styling}
          />
        </div>
      </div>
    </div>
  );
}

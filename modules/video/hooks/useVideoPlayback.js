import { useCallback, useEffect, useState } from "react";

export default function useVideoPlayback({
  slides,
  audioRef,
  musicRef,
  musicOffset,
  defaultDuration = 2000,
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [replayKey, setReplayKey] = useState(0);

  const currentSlide = slides[currentSlideIndex];

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((curr) => curr + 1);
    }
  }, [currentSlideIndex, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((curr) => curr - 1);
    }
  }, [currentSlideIndex]);

  const goToFirst = useCallback(() => {
    setCurrentSlideIndex(0);
    if (musicRef?.current) {
      musicRef.current.currentTime = musicOffset || 0;
    }
  }, [musicRef, musicOffset]);

  const goToLast = useCallback(() => {
    setCurrentSlideIndex(slides.length - 1);
  }, [slides.length]);

  const handleRestart = useCallback(() => {
    setCurrentSlideIndex(0);
    setReplayKey((prev) => prev + 1);
    setIsPlaying(true);

    if (audioRef?.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => {});
    }

    if (musicRef?.current) {
      musicRef.current.currentTime = musicOffset || 0;
    }
  }, [audioRef, musicRef, musicOffset, playbackSpeed]);

  const handleReplay = useCallback(() => {
    setReplayKey((prev) => prev + 1);
    setIsPlaying(true);
    if (audioRef?.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [audioRef, playbackSpeed]);

  const togglePlay = useCallback(() => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (audioRef?.current) {
      if (nextState) {
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
        setIsAutoplay(false);
      }
    }
  }, [audioRef, isPlaying, playbackSpeed]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid shortcuts when typing in inputs
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName))
        return;

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
  }, [handleRestart, nextSlide, prevSlide, goToLast]);

  // Autoplay and slide advance logic
  useEffect(() => {
    let timeoutId;

    if (audioRef?.current) {
      audioRef.current.pause();
      if (!isPlaying) setIsPlaying(false);

      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackSpeed;

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
              .catch(() => {});
          }
        }
      } else if (isAutoplay || isPlaying) {
        const duration =
          (currentSlide?.duration || defaultDuration) / playbackSpeed;
        timeoutId = setTimeout(() => {
          if (currentSlideIndex < slides.length - 1) {
            nextSlide();
          } else {
            setIsPlaying(false);
            setIsAutoplay(false);
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
    audioRef,
  ]);

  return {
    currentSlideIndex,
    setCurrentSlideIndex,
    isPlaying,
    setIsPlaying,
    isAutoplay,
    setIsAutoplay,
    playbackSpeed,
    setPlaybackSpeed,
    replayKey,
    setReplayKey,
    currentSlide,
    nextSlide,
    prevSlide,
    goToFirst,
    goToLast,
    handleRestart,
    handleReplay,
    togglePlay,
  };
}

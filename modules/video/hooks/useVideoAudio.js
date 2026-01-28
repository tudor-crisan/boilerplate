import { useEffect, useState } from "react";

export default function useVideoAudio({
  audioRef,
  musicRef,
  slides,
  musicUrl,
  musicVolume,
  voVolume,
  musicOffset,
  isPlaying,
  defaultDuration = 2000,
}) {
  const [isVoMuted, setIsVoMuted] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [slideDurations, setSlideDurations] = useState([]);

  // Initialize and pre-load slide durations
  useEffect(() => {
    const initial = slides.map((s) => s.duration || defaultDuration);
    setSlideDurations(initial);

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
  }, [slides, defaultDuration]);

  // Track current audio time
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentAudioTime(audio.currentTime * 1000);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [audioRef]);

  // Sync music volume/mute
  useEffect(() => {
    if (musicRef?.current) {
      musicRef.current.muted = isMusicMuted;
      musicRef.current.volume = musicVolume * 0.3; // Specific project scale
    }
  }, [musicRef, isMusicMuted, musicVolume]);

  // Sync VO volume/mute
  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.muted = isVoMuted;
      audioRef.current.volume = voVolume;
    }
  }, [audioRef, isVoMuted, voVolume]);

  // Sync music offset when manual change occurs and not playing
  useEffect(() => {
    if (musicRef?.current && !isPlaying) {
      musicRef.current.currentTime = musicOffset || 0;
    }
  }, [musicRef, musicOffset, isPlaying]);

  // Centralized Music Playback Control
  useEffect(() => {
    if (!musicRef?.current) return;

    if (isPlaying) {
      if (musicRef.current.paused) {
        if (musicRef.current.currentTime === 0 && musicOffset > 0) {
          musicRef.current.currentTime = musicOffset;
        }
        musicRef.current.play().catch(() => {});
      }
    } else {
      musicRef.current.pause();
    }
  }, [musicRef, isPlaying, musicUrl, musicOffset]);

  return {
    isVoMuted,
    setIsVoMuted,
    isMusicMuted,
    setIsMusicMuted,
    currentAudioTime,
    setCurrentAudioTime,
    slideDurations,
  };
}

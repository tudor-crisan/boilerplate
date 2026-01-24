import useVideoAudio from "@/hooks/modules/video/useVideoAudio";
import { jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

describe("useVideoAudio Hook", () => {
  const mockSlides = [
    { id: 1, title: "Slide 1" },
    { id: 2, title: "Slide 2", audio: "slide2.mp3" },
  ];

  const mockAudioRef = {
    current: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      muted: false,
      volume: 1,
      currentTime: 0,
    },
  };

  const mockMusicRef = {
    current: {
      muted: false,
      volume: 1,
      currentTime: 0,
      paused: true,
      play: jest.fn().mockResolvedValue(),
      pause: jest.fn(),
    },
  };

  it("should initialize with default values", () => {
    const { result } = renderHook(() =>
      useVideoAudio({
        audioRef: mockAudioRef,
        musicRef: mockMusicRef,
        slides: mockSlides,
        musicVolume: 0.3,
        voVolume: 1,
        isPlaying: false,
      }),
    );

    expect(result.current.isVoMuted).toBe(false);
    expect(result.current.isMusicMuted).toBe(false);
    expect(result.current.currentAudioTime).toBe(0);
  });

  it("should sync volumes to refs", () => {
    renderHook(() =>
      useVideoAudio({
        audioRef: mockAudioRef,
        musicRef: mockMusicRef,
        slides: mockSlides,
        musicVolume: 1.0,
        voVolume: 0.5,
        isPlaying: false,
      }),
    );

    expect(mockMusicRef.current.volume).toBeCloseTo(0.3); // 1.0 * 0.3 scale
    expect(mockAudioRef.current.volume).toBe(0.5);
  });

  it("should toggle mute states", () => {
    const { result } = renderHook(() =>
      useVideoAudio({
        audioRef: mockAudioRef,
        musicRef: mockMusicRef,
        slides: mockSlides,
        musicVolume: 0.3,
        voVolume: 1,
        isPlaying: false,
      }),
    );

    act(() => {
      result.current.setIsVoMuted(true);
      result.current.setIsMusicMuted(true);
    });

    expect(mockAudioRef.current.muted).toBe(true);
    expect(mockMusicRef.current.muted).toBe(true);
  });

  it("should control music playback based on isPlaying", () => {
    const { rerender } = renderHook(
      ({ isPlaying }) =>
        useVideoAudio({
          audioRef: mockAudioRef,
          musicRef: mockMusicRef,
          slides: mockSlides,
          musicVolume: 0.3,
          voVolume: 1,
          isPlaying,
        }),
      { initialProps: { isPlaying: false } },
    );

    expect(mockMusicRef.current.pause).toHaveBeenCalled();

    rerender({ isPlaying: true });
    expect(mockMusicRef.current.play).toHaveBeenCalled();
  });
});

import useVideoPlayback from "@/hooks/modules/video/useVideoPlayback";
import { jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

describe("useVideoPlayback Hook", () => {
  const mockSlides = [
    { id: 1, title: "Slide 1", duration: 1000 },
    { id: 2, title: "Slide 2", duration: 1000, audio: "slide2.mp3" },
  ];

  const mockAudioRef = {
    current: {
      play: jest.fn().mockResolvedValue(),
      pause: jest.fn(),
      load: jest.fn(),
      currentTime: 0,
      playbackRate: 1,
    },
  };

  const mockMusicRef = {
    current: {
      currentTime: 0,
    },
  };

  it("should initialize with default values", () => {
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef: mockAudioRef,
        musicRef: mockMusicRef,
      }),
    );

    expect(result.current.currentSlideIndex).toBe(0);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isAutoplay).toBe(false);
    expect(result.current.playbackSpeed).toBe(1);
  });

  it("should advance to the next slide", () => {
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef: mockAudioRef,
        musicRef: mockMusicRef,
      }),
    );

    act(() => {
      result.current.nextSlide();
    });

    expect(result.current.currentSlideIndex).toBe(1);
  });

  it("should not advance past the last slide", () => {
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef: mockAudioRef,
        musicRef: mockMusicRef,
      }),
    );

    act(() => {
      result.current.setCurrentSlideIndex(1);
    });

    act(() => {
      result.current.nextSlide();
    });

    expect(result.current.currentSlideIndex).toBe(1);
  });

  it("should toggle play state and control audio", () => {
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef: mockAudioRef,
        musicRef: mockMusicRef,
      }),
    );

    act(() => {
      result.current.togglePlay();
    });

    expect(result.current.isPlaying).toBe(true);
    expect(mockAudioRef.current.play).toHaveBeenCalled();

    act(() => {
      result.current.togglePlay();
    });

    expect(result.current.isPlaying).toBe(false);
    expect(mockAudioRef.current.pause).toHaveBeenCalled();
  });

  it("should restart playback", () => {
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef: mockAudioRef,
        musicRef: mockMusicRef,
        musicOffset: 500,
      }),
    );

    act(() => {
      result.current.setCurrentSlideIndex(1);
      result.current.handleRestart();
    });

    expect(result.current.currentSlideIndex).toBe(0);
    expect(result.current.isPlaying).toBe(true);
    expect(mockAudioRef.current.currentTime).toBe(0);
    expect(mockMusicRef.current.currentTime).toBe(500);
  });
});

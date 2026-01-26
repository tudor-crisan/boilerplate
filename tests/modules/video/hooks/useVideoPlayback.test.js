import { jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

describe("hooks/modules/video/useVideoPlayback", () => {
  let useVideoPlayback;

  const mockSlides = [
    { id: 1, audio: "audio1.mp3", duration: 3000 },
    { id: 2, audio: null, duration: 2000 },
    { id: 3, audio: "audio3.mp3", duration: 4000 },
  ];

  const createMockAudioRef = () => ({
    current: {
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      load: jest.fn(),
      currentTime: 0,
      playbackRate: 1,
      src: "",
    },
  });

  beforeAll(async () => {
    jest.useFakeTimers();
    useVideoPlayback = (await import("@/hooks/modules/video/useVideoPlayback"))
      .default;
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef: createMockAudioRef(),
        musicRef: createMockAudioRef(),
        musicOffset: 0,
      }),
    );

    expect(result.current.currentSlideIndex).toBe(0);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isAutoplay).toBe(false);
    expect(result.current.playbackSpeed).toBe(1);
  });

  it("should navigate to next slide", () => {
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef: createMockAudioRef(),
        musicRef: createMockAudioRef(),
      }),
    );

    act(() => {
      result.current.nextSlide();
    });

    expect(result.current.currentSlideIndex).toBe(1);
  });

  it("should not go past last slide", () => {
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef: createMockAudioRef(),
        musicRef: createMockAudioRef(),
      }),
    );

    act(() => {
      result.current.setCurrentSlideIndex(2);
    });

    act(() => {
      result.current.nextSlide();
    });

    expect(result.current.currentSlideIndex).toBe(2);
  });

  it("should navigate to previous slide", () => {
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef: createMockAudioRef(),
        musicRef: createMockAudioRef(),
      }),
    );

    act(() => {
      result.current.setCurrentSlideIndex(1);
    });

    act(() => {
      result.current.prevSlide();
    });

    expect(result.current.currentSlideIndex).toBe(0);
  });

  it("should not go before first slide", () => {
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef: createMockAudioRef(),
        musicRef: createMockAudioRef(),
      }),
    );

    act(() => {
      result.current.prevSlide();
    });

    expect(result.current.currentSlideIndex).toBe(0);
  });

  it("should go to first slide", () => {
    const audioRef = createMockAudioRef();
    const musicRef = createMockAudioRef();
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef,
        musicRef,
        musicOffset: 5,
      }),
    );

    act(() => {
      result.current.setCurrentSlideIndex(2);
    });

    act(() => {
      result.current.goToFirst();
    });

    expect(result.current.currentSlideIndex).toBe(0);
    expect(musicRef.current.currentTime).toBe(5);
  });

  it("should go to last slide", () => {
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef: createMockAudioRef(),
        musicRef: createMockAudioRef(),
      }),
    );

    act(() => {
      result.current.goToLast();
    });

    expect(result.current.currentSlideIndex).toBe(2);
  });

  it("should handle restart", () => {
    const audioRef = createMockAudioRef();
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef,
        musicRef: createMockAudioRef(),
      }),
    );

    act(() => {
      result.current.setCurrentSlideIndex(2);
    });

    act(() => {
      result.current.handleRestart();
    });

    expect(result.current.currentSlideIndex).toBe(0);
    expect(result.current.isPlaying).toBe(true);
    expect(audioRef.current.play).toHaveBeenCalled();
  });

  it("should handle replay", () => {
    const audioRef = createMockAudioRef();
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef,
        musicRef: createMockAudioRef(),
      }),
    );

    const initialReplayKey = result.current.replayKey;

    act(() => {
      result.current.handleReplay();
    });

    expect(result.current.replayKey).toBe(initialReplayKey + 1);
    expect(result.current.isPlaying).toBe(true);
    expect(audioRef.current.play).toHaveBeenCalled();
  });

  it("should toggle play/pause", () => {
    const audioRef = createMockAudioRef();
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef,
        musicRef: createMockAudioRef(),
      }),
    );

    act(() => {
      result.current.togglePlay();
    });

    expect(result.current.isPlaying).toBe(true);
    expect(audioRef.current.play).toHaveBeenCalled();

    act(() => {
      result.current.togglePlay();
    });

    expect(result.current.isPlaying).toBe(false);
    expect(audioRef.current.pause).toHaveBeenCalled();
  });

  it("should handle playback speed changes", () => {
    const { result } = renderHook(() =>
      useVideoPlayback({
        slides: mockSlides,
        audioRef: createMockAudioRef(),
        musicRef: createMockAudioRef(),
      }),
    );

    act(() => {
      result.current.setPlaybackSpeed(1.5);
    });

    expect(result.current.playbackSpeed).toBe(1.5);
  });
});

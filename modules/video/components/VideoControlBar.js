"use client";

import Button from "@/modules/general/components/button/Button";
import InputRange from "@/modules/general/components/input/InputRange";

export default function VideoControlBar({
  styling,
  router,
  pathname,
  handleRestart,
  playbackSpeed,
  setPlaybackSpeed,
  goToFirst,
  prevSlide,
  nextSlide,
  goToLast,
  currentTime,
  totalTime,
  currentSlideIndex,
  slidesLength,
  undoContent,
}) {
  const formatTime = (ms) => {
    if (!ms || isNaN(ms)) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`w-full max-w-6xl flex flex-col xl:flex-row items-center justify-between bg-base-100 p-4 gap-4 xl:gap-2 ${styling.components.element}`}
    >
      {/* Container 1: Action Controls */}
      <div
        className={`flex flex-wrap items-center justify-center gap-2 bg-base-200/30 p-1.5 w-full xl:w-auto ${styling.components.element}`}
      >
        <Button
          onClick={() => router.push(pathname)}
          size="btn-sm"
          variant="btn-ghost"
          className={`border border-base-200 bg-base-100/50 ${styling.components.element}`}
        >
          ← Gallery
        </Button>

        {undoContent && <div className="flex items-center">{undoContent}</div>}

        <div className="h-6 w-px bg-base-300/50 mx-1 hidden sm:block" />

        <Button
          onClick={handleRestart}
          variant="btn-primary"
          size="btn-sm"
          className={`shadow-md font-bold px-4 ${styling.components.element}`}
        >
          RELOAD{" "}
          <span className="text-[10px] opacity-60 ml-1.5 hidden sm:inline">
            (ALT+S)
          </span>
        </Button>
      </div>

      {/* Container 2: Playback Info */}
      <div
        className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-4 bg-base-200/50 px-4 py-2 w-full xl:w-auto border border-base-300/30 ${styling.components.element} shadow-inner`}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40 whitespace-nowrap">
            Playback
          </span>
          <div className="flex items-center gap-2">
            <InputRange
              min="0.5"
              max="2"
              step="0.1"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="w-20 sm:w-28"
            />
            <span
              className={`text-[10px] font-black font-mono min-w-8 text-primary bg-base-100 px-1.5 py-0.5 border border-base-200 text-center shadow-sm ${styling.components.element}`}
            >
              {playbackSpeed}x
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-base-300 hidden sm:block" />

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-0.5 whitespace-nowrap">
              Elapsed
            </span>
            <span className="text-sm font-black font-mono tracking-tighter text-primary">
              {formatTime(currentTime)}
            </span>
          </div>
          <div className="text-xl font-thin opacity-10">/</div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-0.5 whitespace-nowrap">
              Duration
            </span>
            <span className="text-sm font-black font-mono tracking-tighter text-neutral">
              {formatTime(totalTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Container 3: Navigation */}
      <div
        className={`flex items-center justify-center gap-1 bg-base-200/50 p-1.5 w-full xl:w-auto border border-base-300/30 ${styling.components.element}`}
      >
        <Button
          onClick={goToFirst}
          disabled={currentSlideIndex <= 0}
          variant="btn-ghost"
          size="btn-xs"
          className="px-2 py-1 font-bold text-[10px] opacity-60 hover:opacity-100 uppercase tracking-tighter h-8 min-h-0"
        >
          &lt;
        </Button>
        <Button
          onClick={prevSlide}
          disabled={currentSlideIndex <= 0}
          variant="btn-outline"
          size="btn-sm"
          className={`h-9 min-h-0 px-4 font-bold border-base-300 bg-base-100/50 ${styling.components.element}`}
        >
          Prev
        </Button>

        <div
          className={`px-3 py-1.5 bg-base-100 mx-1 flex items-center justify-center gap-2 border border-base-300/30 shadow-inner ${styling.components.element}`}
        >
          <span className="text-[9px] font-black uppercase opacity-20 whitespace-nowrap">
            Slide
          </span>
          <span className="text-xs font-black font-mono text-primary whitespace-nowrap">
            {currentSlideIndex + 1} <span className="opacity-20 mx-0.5">/</span>{" "}
            {slidesLength}
          </span>
        </div>

        <Button
          onClick={nextSlide}
          disabled={currentSlideIndex >= slidesLength - 1}
          variant="btn-outline"
          size="btn-sm"
          className={`h-9 min-h-0 px-4 font-bold border-base-300 bg-base-100/50 ${styling.components.element}`}
        >
          Next
        </Button>
        <Button
          onClick={goToLast}
          disabled={currentSlideIndex >= slidesLength - 1}
          variant="btn-ghost"
          size="btn-xs"
          className="px-2 py-1 font-bold text-[10px] opacity-60 hover:opacity-100 uppercase tracking-tighter h-8 min-h-0"
        >
          &gt;
        </Button>
      </div>
    </div>
  );
}

"use client";

import Button from "@/components/button/Button";
import InputRange from "@/components/input/InputRange";

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
  currentSlideIndex,
  slidesLength,
}) {
  return (
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
          {currentSlideIndex + 1} / {slidesLength}
        </span>

        <Button
          onClick={nextSlide}
          disabled={currentSlideIndex >= slidesLength - 1}
          variant="btn-outline"
          size="btn-sm"
        >
          Next
        </Button>
        <div className="h-4 w-[1px] bg-base-300 mx-0.5" />
        <Button
          onClick={goToLast}
          disabled={currentSlideIndex >= slidesLength - 1}
          variant="btn-ghost"
          size="btn-xs"
          className="px-2"
        >
          Last &gt;&gt;
        </Button>
      </div>
    </div>
  );
}

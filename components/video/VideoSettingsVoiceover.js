"use client";

import Button from "@/components/button/Button";
import Loading from "@/components/common/Loading";
import Paragraph from "@/components/common/Paragraph";
import TextSmall from "@/components/common/TextSmall";
import InputCopy from "@/components/input/InputCopy";
import InputFile from "@/components/input/InputFile";
import InputRange from "@/components/input/InputRange";
import InputToggle from "@/components/input/InputToggle";
import SvgPause from "@/components/svg/SvgPause";
import SvgPlay from "@/components/svg/SvgPlay";
import SvgReplay from "@/components/svg/SvgReplay";
import VideoSlideEditor from "@/components/video/VideoSlideEditor";

export default function VideoSettingsVoiceover({
  isVoMuted,
  setIsVoMuted,
  isAutoplay,
  setIsAutoplay,
  voVolume,
  setVoVolume,
  fileInputKey,
  handleFileUpload,
  isUploading,
  currentSlide,
  handleReplay,
  togglePlay,
  isPlaying,
  styling,
  // Slide Editor Props
  currentSlideIndex,
  totalSlides,
  handleUpdateSlide,
  handleAddSlide,
  handleDeleteSlide,
  handleMoveSlide,
}) {
  return (
    <div className="flex flex-col gap-4 w-full sm:w-1/2">
      {/* Slide Editor */}
      <VideoSlideEditor
        slide={currentSlide}
        index={currentSlideIndex}
        totalSlides={totalSlides}
        onUpdate={handleUpdateSlide}
        onAdd={handleAddSlide}
        onDelete={handleDeleteSlide}
        onMove={handleMoveSlide}
      />

      <div className="flex items-center justify-between">
        <Paragraph className="font-bold opacity-70">
          Voiceover Settings
        </Paragraph>
        <div className="flex items-center gap-2 bg-base-100 px-3 py-1 border border-base-200 rounded-lg">
          <TextSmall className="font-semibold opacity-60">VO Mute</TextSmall>
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
            Autoplay (ALT+A)
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
            className="m-0"
          />
          {!isUploading && currentSlide.audio && (
            <TextSmall className="mt-2 opacity-40 italic truncate block">
              File: {currentSlide.audio.split("/").pop()}
            </TextSmall>
          )}
          {isUploading && (
            <Loading text="Uploading VO..." className="mt-2 text-primary" />
          )}
        </div>
      </div>

      {/* Voiceover Volume Slider - Moved below Script */}
      <div
        className={`flex flex-col gap-2 bg-base-100 p-3 border border-base-200 ${styling.components.element}`}
      >
        <div className="flex justify-between items-center">
          <TextSmall className="font-bold opacity-40 uppercase">
            Voiceover Volume
          </TextSmall>
          <span className="text-xs font-mono opacity-60 bg-base-200 px-2 py-0.5 rounded">
            {Math.round(voVolume * 100)}%
          </span>
        </div>
        <InputRange
          min="0"
          max="1"
          step="0.05"
          value={voVolume}
          onChange={(e) => setVoVolume(parseFloat(e.target.value))}
          color="primary"
          className="w-full"
        />
      </div>

      <div>
        <TextSmall className="font-bold opacity-40 uppercase mb-1">
          Current Script
        </TextSmall>
        <InputCopy value={currentSlide.voiceover} tooltipCopy="Copy Script">
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
  );
}

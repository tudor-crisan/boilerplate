import Button from "@/modules/general/components/button/Button";
import ButtonCopy from "@/modules/general/components/button/ButtonCopy";
import Loading from "@/modules/general/components/common/Loading";
import Paragraph from "@/modules/general/components/common/Paragraph";
import TextSmall from "@/modules/general/components/common/TextSmall";
import Tooltip from "@/modules/general/components/common/Tooltip";
import InputFile from "@/modules/general/components/input/InputFile";
import InputRange from "@/modules/general/components/input/InputRange";
import InputToggle from "@/modules/general/components/input/InputToggle";
import SvgPause from "@/modules/general/components/svg/SvgPause";
import SvgPlay from "@/modules/general/components/svg/SvgPlay";
import SvgReplay from "@/modules/general/components/svg/SvgReplay";
import Textarea from "@/modules/general/components/textarea/Textarea";
import { useEffect, useState } from "react";

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
  handleUpdateSlide,
  currentSlideIndex,
}) {
  // Local state for debouncing
  const [localVolume, setLocalVolume] = useState(voVolume);
  useEffect(() => {
    setLocalVolume(voVolume);
  }, [voVolume]);
  const handleCommitVolume = () => setVoVolume(localVolume);

  // Local state for script to prevent history flood
  const [localScript, setLocalScript] = useState(currentSlide.voiceover || "");
  // Sync when slide changes (switched slide or undo/redo)
  useEffect(() => {
    setLocalScript(currentSlide.voiceover || "");
  }, [currentSlide.voiceover, currentSlide.id]);

  const handleCommitScript = () => {
    if (localScript !== currentSlide.voiceover) {
      handleUpdateSlide(currentSlideIndex, {
        ...currentSlide,
        voiceover: localScript,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
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

      {/* Voiceover Volume */}
      <div
        className={`flex flex-col gap-2 bg-base-100 p-3 border border-base-200 ${styling.components.element}`}
      >
        <div className="flex justify-between items-center">
          <TextSmall className="font-bold opacity-40 uppercase">
            Voiceover Volume
          </TextSmall>
          <span className="text-xs font-mono opacity-60 bg-base-200 px-2 py-0.5 rounded">
            {Math.round(localVolume * 100)}%
          </span>
        </div>
        <InputRange
          min="0"
          max="1"
          step="0.05"
          value={localVolume}
          onChange={(e) => setLocalVolume(parseFloat(e.target.value))}
          onMouseUp={handleCommitVolume}
          onTouchEnd={handleCommitVolume}
          color="primary"
          className="w-full"
        />
      </div>

      {/* Editable Script */}
      <div>
        <TextSmall className="font-bold opacity-40 uppercase mb-1">
          Current Script
        </TextSmall>

        <div
          className={`${styling.components.input_copy} ${styling.general.element} w-full`}
        >
          <Textarea
            className="bg-transparent border-none outline-none w-full mr-2 text-current p-0 focus:ring-0 resize-none h-12 leading-normal shadow-none min-h-0"
            value={localScript}
            onChange={(e) => setLocalScript(e.target.value)}
            onBlur={handleCommitScript}
            placeholder="Enter voiceover script here..."
          />

          <div
            className={`${styling.flex.items_center} gap-2 shrink-0 border-l border-base-300 pl-2`}
          >
            <Tooltip text="Copy Script">
              <ButtonCopy copyText={currentSlide.voiceover || ""} />
            </Tooltip>

            {currentSlide.audio && (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

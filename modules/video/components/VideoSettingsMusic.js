"use client";
import Loading from "@/modules/general/components/common/Loading";
import Paragraph from "@/modules/general/components/common/Paragraph";
import TextSmall from "@/modules/general/components/common/TextSmall";
import InputFile from "@/modules/general/components/input/InputFile";
import InputRange from "@/modules/general/components/input/InputRange";
import InputToggle from "@/modules/general/components/input/InputToggle";
import { useEffect, useState } from "react";

export default function VideoSettingsMusic({
  musicUrl,
  isMusicMuted,
  setIsMusicMuted,
  musicInputKey,
  handleMusicUpload,
  isMusicUploading,
  musicOffset,
  setMusicOffset,
  musicVolume,
  setMusicVolume,
  styling,
}) {
  // Local state for sliders to prevent history spam on drag
  const [localOffset, setLocalOffset] = useState(musicOffset);
  const [localVolume, setLocalVolume] = useState(musicVolume);

  // Sync local state when parent props change (e.g. undo/redo)
  useEffect(() => {
    setLocalOffset(musicOffset);
  }, [musicOffset]);
  useEffect(() => {
    setLocalVolume(musicVolume);
  }, [musicVolume]);

  const handleCommitOffset = () => setMusicOffset(localOffset);
  const handleCommitVolume = () => setMusicVolume(localVolume);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <Paragraph className="font-bold opacity-70">Background Music</Paragraph>
        <div className="flex items-center gap-2 bg-base-100 px-3 py-1 border border-base-200 rounded-lg">
          <TextSmall className="font-semibold opacity-60">Music Mute</TextSmall>
          <InputToggle
            value={isMusicMuted}
            onChange={setIsMusicMuted}
            size="toggle-xs"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <InputFile
          key={musicInputKey}
          accept="audio/*"
          onChange={handleMusicUpload}
          disabled={isMusicUploading}
          className="m-0"
        />
        {!isMusicUploading && musicUrl && (
          <TextSmall className="mt-1 opacity-40 italic truncate block">
            File: {musicUrl.split("/").pop()}
          </TextSmall>
        )}
        {isMusicUploading && (
          <Loading text="Uploading Music..." className="mt-1 text-primary" />
        )}

        {/* Music Offset Slider */}
        <div
          className={`flex flex-col gap-2 bg-base-100 p-3 border border-base-200 ${styling.components.element}`}
        >
          <div className="flex justify-between items-center">
            <TextSmall className="font-bold opacity-40 uppercase">
              Music Start Point
            </TextSmall>
            <span className="text-xs font-mono opacity-60 bg-base-200 px-2 py-0.5 rounded">
              {localOffset}s
            </span>
          </div>
          <InputRange
            min="0"
            max="120"
            step="1"
            value={localOffset}
            onChange={(e) => setLocalOffset(parseInt(e.target.value))}
            onMouseUp={handleCommitOffset}
            onTouchEnd={handleCommitOffset}
            className="w-full"
          />
          <TextSmall className="opacity-40 text-center">
            Select where in the track to start (0 - 120s)
          </TextSmall>
        </div>

        {/* Music Volume Slider */}
        <div
          className={`flex flex-col gap-2 bg-base-100 p-3 border border-base-200 ${styling.components.element}`}
        >
          <div className="flex justify-between items-center">
            <TextSmall className="font-bold opacity-40 uppercase">
              Background Volume
            </TextSmall>
            <span className="text-xs font-mono opacity-60 bg-base-200 px-2 py-0.5 rounded">
              {Math.round(localVolume * 100)}%
            </span>
          </div>
          <InputRange
            min="0"
            max="1"
            step="0.01"
            value={localVolume}
            onChange={(e) => setLocalVolume(parseFloat(e.target.value))}
            onMouseUp={handleCommitVolume}
            onTouchEnd={handleCommitVolume}
            color="primary"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

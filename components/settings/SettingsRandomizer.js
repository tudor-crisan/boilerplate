"use client";

import { useState } from "react";
import InputCheckbox from "@/components/input/InputCheckbox";
import Button from "@/components/button/Button";
import Grid from "@/components/common/Grid";
import Tooltip from "@/components/common/Tooltip";

export default function SettingsRandomizer({ config, onConfigChange, onShuffle, isLoading, title }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!config) return null;

  const isThemeEnabled = config.theme !== false;
  const isFontEnabled = config.font !== false;
  const isStylingEnabled = config.styling !== false;

  const isShuffleDisabled = !isThemeEnabled && !isFontEnabled && !isStylingEnabled;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {title}
        <div className="flex items-center gap-2">
          <InputCheckbox
            label="Auto Shuffle"
            className="toggle-sm"
            value={config.auto || false}
            onChange={(checked) => onConfigChange("auto", checked)}
            disabled={isLoading}
          />
        </div>
      </div>

      <Grid>
        <div className="flex items-center gap-4 col-span-2 sm:col-span-1">
          <InputCheckbox
            label="Theme"
            value={isThemeEnabled}
            onChange={(checked) => onConfigChange("theme", checked)}
            className="checkbox-sm"
            disabled={isLoading}
          />
          <InputCheckbox
            label="Font"
            value={isFontEnabled}
            onChange={(checked) => onConfigChange("font", checked)}
            className="checkbox-sm"
            disabled={isLoading}
          />
          <InputCheckbox
            label="Styling"
            value={isStylingEnabled}
            onChange={(checked) => onConfigChange("styling", checked)}
            className="checkbox-sm"
            disabled={isLoading}
          />
        </div>

        <div className="col-span-2 sm:col-span-1 flex justify-end">
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Tooltip
              text="Select an option first"
              isVisible={isShuffleDisabled && isHovered}
            >
              <Button
                onClick={onShuffle}
                className="w-full sm:w-auto btn-outline"
                type="button"
                disabled={isLoading || isShuffleDisabled}
              >
                Shuffle Now
              </Button>
            </Tooltip>
          </div>
        </div>
      </Grid>
    </div>
  );
}

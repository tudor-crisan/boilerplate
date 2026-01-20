"use client";

import Button from "@/components/button/Button";
import Tooltip from "@/components/common/Tooltip";
import InputCheckbox from "@/components/input/InputCheckbox";
import { useStyling } from "@/context/ContextStyling";

export default function SettingsRandomizer({ config, onConfigChange, onShuffle, isLoading, title }) {
  const { styling } = useStyling();

  if (!config) return null;

  const isThemeEnabled = config.theme !== false;
  const isFontEnabled = config.font !== false;
  const isStylingEnabled = config.styling !== false;
  const isShuffleDisabled = !isThemeEnabled && !isFontEnabled && !isStylingEnabled;

  return (
    <div className="space-y-4">
      <div className={styling.flex.between}>
        {title}
        <div className={`${styling.flex.items_center} gap-2`}>
          <InputCheckbox
            label="Auto Shuffle"
            className="toggle-sm"
            value={config.auto || false}
            onChange={(checked) => onConfigChange("auto", checked)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Checkboxes Area */}
        <div className={`${styling.flex.items_center} flex-wrap gap-x-4 gap-y-2`}>
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

        {/* Shuffle Button Area */}
        <div className="flex justify-end">
          <Tooltip
            text={isShuffleDisabled ? "Select an option first" : ""}
          >
            <Button
              onClick={onShuffle}
              className="w-full sm:w-auto btn-outline btn-sm min-h-[2.5rem]"
              type="button"
              disabled={isLoading || isShuffleDisabled}
            >
              Shuffle Now
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

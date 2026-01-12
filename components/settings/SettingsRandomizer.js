"use client";

import InputCheckbox from "@/components/input/InputCheckbox";
import Button from "@/components/button/Button";
import Grid from "@/components/common/Grid";
import Title from "@/components/common/Title";

export default function SettingsRandomizer({ config, onConfigChange, onShuffle, isLoading, title }) {
  if (!config) return null;

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
            value={config.theme !== false} // Default to true if undefined
            onChange={(checked) => onConfigChange("theme", checked)}
            className="checkbox-sm"
            disabled={isLoading}
          />
          <InputCheckbox
            label="Font"
            value={config.font !== false} // Default to true if undefined
            onChange={(checked) => onConfigChange("font", checked)}
            className="checkbox-sm"
            disabled={isLoading}
          />
          <InputCheckbox
            label="Styling"
            value={config.styling !== false} // Default to true if undefined
            onChange={(checked) => onConfigChange("styling", checked)}
            className="checkbox-sm"
            disabled={isLoading}
          />
        </div>

        <div className="col-span-2 sm:col-span-1 flex justify-end">
          <Button
            onClick={onShuffle}
            className="w-full sm:w-auto btn-outline"
            type="button"
            disabled={isLoading}
          >
            Shuffle Now
          </Button>
        </div>
      </Grid>
    </div>
  );
}

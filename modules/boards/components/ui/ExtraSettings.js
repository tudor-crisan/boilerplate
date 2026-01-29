"use client";

import BoardSettingsAppearance from "@/modules/boards/components/settings/Appearance";
import BoardSettingsEmptyState from "@/modules/boards/components/settings/EmptyState";
import BoardSettingsGeneralForm from "@/modules/boards/components/settings/GeneralForm";
import BoardPreview from "@/modules/boards/components/settings/Preview";
import { useBoardRandomizer } from "@/modules/boards/hooks/useBoardRandomizer";
import { useBoardSettingsForm } from "@/modules/boards/hooks/useBoardSettingsForm";
import CommentSettings from "@/modules/general/components/comments/CommentSettings";
import Accordion from "@/modules/general/components/common/Accordion";
import SettingsFormField from "@/modules/general/components/settings/SettingsFormField";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { appStyling, defaultStyling } from "@/modules/general/libs/defaults";

export default function BoardExtraSettings({ settings, onChange, disabled }) {
  const { styling } = useStyling();

  const { handleChange, getVal, previewStyling } = useBoardSettingsForm({
    settings,
    onChange,
  });

  // Randomizer Hook
  const { handleShuffle } = useBoardRandomizer({
    settings,
    handleChange,
    getVal,
  });

  const accordionItems = [
    {
      title: "General Form Settings",
      content: (
        <BoardSettingsGeneralForm
          getVal={getVal}
          handleChange={handleChange}
          disabled={disabled}
        />
      ),
    },
    {
      title: "Input: Title",
      content: (
        <SettingsFormField
          getVal={getVal}
          handleChange={handleChange}
          disabled={disabled}
          prefix="form.inputs.title"
          config={{
            maxLengthConfig: { min: 10, max: 100, default: 60 },
            placeholderConfig: { maxLength: 60 },
          }}
        />
      ),
    },
    {
      title: "Input: Description",
      content: (
        <SettingsFormField
          getVal={getVal}
          handleChange={handleChange}
          disabled={disabled}
          prefix="form.inputs.description"
          config={{
            showRows: true,
            maxLengthConfig: { min: 50, max: 700, default: 400 },
          }}
        />
      ),
    },
    {
      title: "Empty State",
      content: (
        <BoardSettingsEmptyState
          getVal={getVal}
          handleChange={handleChange}
          disabled={disabled}
        />
      ),
    },
    {
      title: "Comment Section",
      content: (
        <CommentSettings
          getVal={getVal}
          handleChange={handleChange}
          disabled={disabled}
        />
      ),
    },
    {
      title: "Appearance",
      content: (
        <BoardSettingsAppearance
          getVal={getVal}
          handleChange={handleChange}
          disabled={disabled}
          defaultStyling={defaultStyling}
          appStyling={appStyling}
          handleShuffle={handleShuffle}
          styling={styling}
        />
      ),
    },
  ];

  return (
    <div className={`${styling.flex.col} sm:flex-row gap-6 sm:h-full`}>
      {/* Editor Column */}
      <div className="flex-none sm:flex-1 sm:overflow-y-auto pr-2">
        <div className="text-sm uppercase font-bold text-base-content/50 mb-4">
          SETTINGS
        </div>
        <Accordion items={accordionItems} />
      </div>

      {/* Preview Column */}
      <BoardPreview
        previewStyling={previewStyling}
        getVal={getVal}
        handleChange={handleChange}
      />
    </div>
  );
}

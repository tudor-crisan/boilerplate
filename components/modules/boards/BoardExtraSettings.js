"use client";

import Accordion from "@/components/common/Accordion";
import BoardSettingsGeneralForm from "@/components/modules/boards/settings/BoardSettingsGeneralForm";
import BoardSettingsInputTitle from "@/components/modules/boards/settings/BoardSettingsInputTitle";
import BoardSettingsInputDescription from "@/components/modules/boards/settings/BoardSettingsInputDescription";
import BoardSettingsEmptyState from "@/components/modules/boards/settings/BoardSettingsEmptyState";
import BoardSettingsComments from "@/components/modules/boards/settings/BoardSettingsComments";
import BoardSettingsAppearance from "@/components/modules/boards/settings/BoardSettingsAppearance";
import BoardPreview from "@/components/modules/boards/settings/BoardPreview";
import { useBoardRandomizer } from "@/hooks/modules/boards/useBoardRandomizer";
import { useBoardSettingsForm } from "@/hooks/modules/boards/useBoardSettingsForm";
import { defaultStyling, appStyling } from "@/libs/defaults";
import { useStyling } from "@/context/ContextStyling";

export default function BoardExtraSettings({ settings, onChange, disabled }) {
  const { styling } = useStyling();

  const { handleChange, getVal, previewStyling } = useBoardSettingsForm({
    settings,
    onChange
  });

  // Randomizer Hook
  const { handleShuffle } = useBoardRandomizer({ settings, handleChange, getVal });

  const accordionItems = [
    {
      title: "General Form Settings",
      content: <BoardSettingsGeneralForm getVal={getVal} handleChange={handleChange} disabled={disabled} />
    },
    {
      title: "Input: Title",
      content: <BoardSettingsInputTitle getVal={getVal} handleChange={handleChange} disabled={disabled} />
    },
    {
      title: "Input: Description",
      content: <BoardSettingsInputDescription getVal={getVal} handleChange={handleChange} disabled={disabled} />
    },
    {
      title: "Empty State",
      content: <BoardSettingsEmptyState getVal={getVal} handleChange={handleChange} disabled={disabled} />
    },
    {
      title: "Comment Section",
      content: <BoardSettingsComments getVal={getVal} handleChange={handleChange} disabled={disabled} />
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
      )
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-full">
      {/* Editor Column */}
      <div className="flex-none lg:flex-1 lg:overflow-y-auto pr-2">
        <div className="text-sm uppercase font-bold text-base-content/50 mb-4">SETTINGS</div>
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


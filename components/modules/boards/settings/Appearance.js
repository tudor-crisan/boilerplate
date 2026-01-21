import SettingsAppearance from "@/components/settings/SettingsAppearance";
import { SettingsContainer } from "@/components/settings/SettingsLayout";
import SettingsRandomizer from "@/components/settings/SettingsRandomizer";

export const BoardSettingsAppearance = ({
  getVal,
  handleChange,
  disabled,
  defaultStyling,
  appStyling,
  handleShuffle,
  styling,
}) => (
  <SettingsContainer>
    <SettingsAppearance
      styling={getVal("appearance", defaultStyling)}
      onChange={(newStyling) => handleChange("appearance", newStyling)}
      isLoading={disabled}
    />

    <div className="pt-4 border-t border-base-200">
      <div className="font-bold text-sm mb-4">Randomizer</div>
      <SettingsRandomizer
        config={getVal("randomizer", {
          theme: true,
          font: true,
          styling: true,
          auto: false,
        })}
        onConfigChange={(key, val) => handleChange(`randomizer.${key}`, val)}
        onShuffle={handleShuffle}
        isLoading={disabled}
      />
    </div>

    <div className="flex justify-between items-center gap-3 mt-4 pt-4 border-t border-base-200 border-dashed">
      <button
        type="button"
        onClick={() => handleChange("appearance", appStyling)}
        className="text-xs text-base-content/50 hover:text-base-content transition-colors underline cursor-pointer"
      >
        Reset to default
      </button>
      <button
        type="button"
        onClick={() => handleChange("appearance", styling)}
        className="text-xs text-base-content/50 hover:text-base-content transition-colors underline cursor-pointer"
      >
        Use profile settings
      </button>
    </div>
  </SettingsContainer>
);

export default BoardSettingsAppearance;

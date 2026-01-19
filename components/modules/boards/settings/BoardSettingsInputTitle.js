import Input from "@/components/input/Input";
import InputCheckbox from "@/components/input/InputCheckbox";
import Label from "@/components/common/Label";
import TextSmall from "@/components/common/TextSmall";
import { SettingsContainer, SettingsItem, SettingsRow } from "@/components/settings/SettingsLayout";

export const BoardSettingsInputTitle = ({ getVal, handleChange, disabled }) => (
  <SettingsContainer>
    <SettingsItem>
      <Label>Label</Label>
      <Input
        value={getVal("form.inputs.title.label", "")}
        onChange={(e) => handleChange("form.inputs.title.label", e.target.value)}
        disabled={disabled}
        maxLength={50}
        showCharacterCount={true}
      />
    </SettingsItem>
    <SettingsItem>
      <Label>Placeholder</Label>
      <Input
        value={getVal("form.inputs.title.placeholder", "")}
        onChange={(e) => handleChange("form.inputs.title.placeholder", e.target.value)}
        disabled={disabled}
        maxLength={60}
        showCharacterCount={true}
      />
    </SettingsItem>
    <SettingsRow>
      <SettingsItem>
        <Label>Max Length</Label>
        <Input
          type="number"
          value={getVal("form.inputs.title.maxlength", 60)}
          onChange={(e) => {
            let val = parseInt(e.target.value) || 0;
            if (val > 100) val = 100;
            handleChange("form.inputs.title.maxlength", val);
          }}
          min={10}
          max={100}
          disabled={disabled}
        />
        <TextSmall className="mt-1">Min: 10, Max: 100</TextSmall>
      </SettingsItem>
      <InputCheckbox
        label="Show Count"
        value={getVal("form.inputs.title.showCharacterCount", true)}
        onChange={(checked) => handleChange("form.inputs.title.showCharacterCount", checked)}
        className="pb-3"
        disabled={disabled}
      />
    </SettingsRow>
  </SettingsContainer>
);

export default BoardSettingsInputTitle;

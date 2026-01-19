import Input from "@/components/input/Input";
import InputCheckbox from "@/components/input/InputCheckbox";
import Label from "@/components/common/Label";
import TextSmall from "@/components/common/TextSmall";
import { SettingsContainer, SettingsItem, SettingsRow } from "@/components/settings/SettingsLayout";

export const BoardSettingsInputDescription = ({ getVal, handleChange, disabled }) => (
  <SettingsContainer>
    <SettingsItem>
      <Label>Label</Label>
      <Input
        value={getVal("form.inputs.description.label", "")}
        onChange={(e) => handleChange("form.inputs.description.label", e.target.value)}
        disabled={disabled}
        maxLength={50}
        showCharacterCount={true}
      />
    </SettingsItem>
    <SettingsItem>
      <Label>Placeholder</Label>
      <Input
        value={getVal("form.inputs.description.placeholder", "")}
        onChange={(e) => handleChange("form.inputs.description.placeholder", e.target.value)}
        disabled={disabled}
        maxLength={100}
        showCharacterCount={true}
      />
    </SettingsItem>
    <SettingsRow>
      <SettingsItem>
        <Label>Max Length</Label>
        <Input
          type="number"
          value={getVal("form.inputs.description.maxlength", 400)}
          onChange={(e) => {
            let val = parseInt(e.target.value) || 0;
            if (val > 700) val = 700;
            handleChange("form.inputs.description.maxlength", val);
          }}
          min={50}
          max={700}
          disabled={disabled}
        />
        <TextSmall className="mt-1">Min: 50, Max: 700</TextSmall>
      </SettingsItem>
      <SettingsItem>
        <Label>Rows</Label>
        <Input
          type="number"
          value={getVal("form.inputs.description.rows", 4)}
          onChange={(e) => {
            let val = parseInt(e.target.value) || 0;
            if (val > 10) val = 10;
            handleChange("form.inputs.description.rows", val);
          }}
          min={2}
          max={10}
          disabled={disabled}
        />
        <TextSmall className="mt-1">Min: 2, Max: 10</TextSmall>
      </SettingsItem>
    </SettingsRow>
    <InputCheckbox
      label="Show Character Count"
      value={getVal("form.inputs.description.showCharacterCount", true)}
      onChange={(checked) => handleChange("form.inputs.description.showCharacterCount", checked)}
      className="pt-2"
      disabled={disabled}
    />
  </SettingsContainer>
);

export default BoardSettingsInputDescription;

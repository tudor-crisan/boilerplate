import Label from "@/modules/general/components/common/Label";
import Input from "@/modules/general/components/input/Input";
import {
  SettingsContainer,
  SettingsItem,
} from "@/modules/general/components/settings/SettingsLayout";

export const BoardSettingsGeneralForm = ({
  getVal,
  handleChange,
  disabled,
}) => (
  <SettingsContainer>
    <SettingsItem>
      <Label>Form Title</Label>
      <Input
        value={getVal("form.title", "")}
        onChange={(e) => handleChange("form.title", e.target.value)}
        placeholder="Suggest a feature"
        disabled={disabled}
        maxLength={50}
        showCharacterCount={true}
      />
    </SettingsItem>
    <SettingsItem>
      <Label>Submit Button Text</Label>
      <Input
        value={getVal("form.button", "")}
        onChange={(e) => handleChange("form.button", e.target.value)}
        placeholder="Add Post"
        disabled={disabled}
        maxLength={30}
        showCharacterCount={true}
      />
    </SettingsItem>
  </SettingsContainer>
);

export default BoardSettingsGeneralForm;

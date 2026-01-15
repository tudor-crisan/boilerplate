import Input from "@/components/input/Input";
import Label from "@/components/common/Label";
import { SettingsContainer, SettingsItem } from "./BoardSettingsLayout";

export const BoardSettingsEmptyState = ({ getVal, handleChange, disabled }) => (
  <SettingsContainer>
    <SettingsItem>
      <Label>Title</Label>
      <Input
        value={getVal("emptyState.title", "")}
        onChange={(e) => handleChange("emptyState.title", e.target.value)}
        disabled={disabled}
        maxLength={50}
        showCharacterCount={true}
      />
    </SettingsItem>
    <SettingsItem>
      <Label>Description</Label>
      <Input
        value={getVal("emptyState.description", "")}
        onChange={(e) => handleChange("emptyState.description", e.target.value)}
        disabled={disabled}
        maxLength={100}
        showCharacterCount={true}
      />
    </SettingsItem>
  </SettingsContainer>
);

export default BoardSettingsEmptyState;

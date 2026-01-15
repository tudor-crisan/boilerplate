import Input from "@/components/input/Input";
import InputCheckbox from "@/components/input/InputCheckbox";
import Label from "@/components/common/Label";
import TextSmall from "@/components/common/TextSmall";
import { SettingsContainer, SettingsItem, SettingsRow } from "./BoardSettingsLayout";

export const BoardSettingsComments = ({ getVal, handleChange, disabled }) => (
  <SettingsContainer>
    <SettingsRow>
      <InputCheckbox
        label="Show Date"
        value={getVal("comments.showDate", true)}
        onChange={(checked) => handleChange("comments.showDate", checked)}
        disabled={disabled}
      />
      <InputCheckbox
        label="Allow Deletion"
        value={getVal("comments.allowDeletion", true)}
        onChange={(checked) => handleChange("comments.allowDeletion", checked)}
        disabled={disabled}
      />
    </SettingsRow>

    <SettingsItem>
      <Label>Owner Badge Text</Label>
      <Input
        value={getVal("comments.ownerBadgeText", "Owner")}
        onChange={(e) => handleChange("comments.ownerBadgeText", e.target.value)}
        placeholder="Owner"
        disabled={disabled}
        maxLength={20}
        showCharacterCount={true}
      />
    </SettingsItem>

    <SettingsItem>
      <Label>Empty State Text</Label>
      <Input
        value={getVal("comments.emptyStateText", "Be the first to comment")}
        onChange={(e) => handleChange("comments.emptyStateText", e.target.value)}
        placeholder="Be the first to comment"
        disabled={disabled}
        maxLength={50}
        showCharacterCount={true}
      />
    </SettingsItem>

    <SettingsItem>
      <Label>Input Label</Label>
      <Input
        value={getVal("comments.label", "Your comment")}
        onChange={(e) => handleChange("comments.label", e.target.value)}
        placeholder="Your comment"
        disabled={disabled}
        maxLength={50}
        showCharacterCount={true}
      />
    </SettingsItem>

    <SettingsItem>
      <Label>Placeholder</Label>
      <Input
        value={getVal("comments.placeholder", "What do you think?")}
        onChange={(e) => handleChange("comments.placeholder", e.target.value)}
        placeholder="What do you think?"
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
          value={getVal("comments.maxLength", 1000)}
          onChange={(e) => {
            let val = parseInt(e.target.value) || 0;
            if (val > 2000) val = 2000;
            handleChange("comments.maxLength", val);
          }}
          min={100}
          max={2000}
          disabled={disabled}
        />
        <TextSmall className="mt-1">Min: 100, Max: 2000</TextSmall>
      </SettingsItem>
      <SettingsItem>
        <Label>Rows</Label>
        <Input
          type="number"
          value={getVal("comments.rows", 3)}
          onChange={(e) => {
            let val = parseInt(e.target.value) || 0;
            if (val > 10) val = 10;
            handleChange("comments.rows", val);
          }}
          min={2}
          max={10}
          disabled={disabled}
        />
        <TextSmall className="mt-1">Min: 2, Max: 10</TextSmall>
      </SettingsItem>
    </SettingsRow>

    <SettingsItem>
      <Label>Button Text</Label>
      <Input
        value={getVal("comments.buttonText", "Post Comment")}
        onChange={(e) => handleChange("comments.buttonText", e.target.value)}
        placeholder="Post Comment"
        disabled={disabled}
        maxLength={30}
        showCharacterCount={true}
      />
    </SettingsItem>
  </SettingsContainer>
);

export default BoardSettingsComments;

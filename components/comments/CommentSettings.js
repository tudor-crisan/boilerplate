"use client";

import Input from "@/components/input/Input";
import InputCheckbox from "@/components/input/InputCheckbox";
import Label from "@/components/common/Label";
import TextSmall from "@/components/common/TextSmall";
import { SettingsContainer, SettingsItem, SettingsRow } from "@/components/settings/SettingsLayout";

const CommentSettings = ({
  getVal,
  handleChange,
  disabled,
  prefix = "comments" // Default prefix for comment settings
}) => {
  return (
    <SettingsContainer>
      <SettingsRow>
        <InputCheckbox
          label="Show Date"
          value={getVal(`${prefix}.showDate`, true)}
          onChange={(checked) => handleChange(`${prefix}.showDate`, checked)}
          disabled={disabled}
        />
        <InputCheckbox
          label="Allow Deletion"
          value={getVal(`${prefix}.allowDeletion`, true)}
          onChange={(checked) => handleChange(`${prefix}.allowDeletion`, checked)}
          disabled={disabled}
        />
      </SettingsRow>

      <SettingsItem>
        <Label>Owner Badge Text</Label>
        <Input
          value={getVal(`${prefix}.ownerBadgeText`, "Owner")}
          onChange={(e) => handleChange(`${prefix}.ownerBadgeText`, e.target.value)}
          placeholder="Owner"
          disabled={disabled}
          maxLength={20}
          showCharacterCount={true}
        />
      </SettingsItem>

      <SettingsItem>
        <Label>Empty State Text</Label>
        <Input
          value={getVal(`${prefix}.emptyStateText`, "Be the first to comment")}
          onChange={(e) => handleChange(`${prefix}.emptyStateText`, e.target.value)}
          placeholder="Be the first to comment"
          disabled={disabled}
          maxLength={50}
          showCharacterCount={true}
        />
      </SettingsItem>

      <SettingsItem>
        <Label>Input Label</Label>
        <Input
          value={getVal(`${prefix}.label`, "Your comment")}
          onChange={(e) => handleChange(`${prefix}.label`, e.target.value)}
          placeholder="Your comment"
          disabled={disabled}
          maxLength={50}
          showCharacterCount={true}
        />
      </SettingsItem>

      <SettingsItem>
        <Label>Placeholder</Label>
        <Input
          value={getVal(`${prefix}.placeholder`, "What do you think?")}
          onChange={(e) => handleChange(`${prefix}.placeholder`, e.target.value)}
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
            value={getVal(`${prefix}.maxLength`, 1000)}
            onChange={(e) => {
              let val = parseInt(e.target.value) || 0;
              if (val > 2000) val = 2000;
              handleChange(`${prefix}.maxLength`, val);
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
            value={getVal(`${prefix}.rows`, 3)}
            onChange={(e) => {
              let val = parseInt(e.target.value) || 0;
              if (val > 10) val = 10;
              handleChange(`${prefix}.rows`, val);
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
          value={getVal(`${prefix}.buttonText`, "Post Comment")}
          onChange={(e) => handleChange(`${prefix}.buttonText`, e.target.value)}
          placeholder="Post Comment"
          disabled={disabled}
          maxLength={30}
          showCharacterCount={true}
        />
      </SettingsItem>
    </SettingsContainer>
  );
};

export default CommentSettings;

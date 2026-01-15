import Input from "@/components/input/Input";
import InputCheckbox from "@/components/input/InputCheckbox";
import InputToggle from "@/components/input/InputToggle";
import Textarea from "@/components/textarea/Textarea";
import Label from "@/components/common/Label";
import TextSmall from "@/components/common/TextSmall";
import SettingsAppearance from "@/components/settings/SettingsAppearance";
import SettingsRandomizer from "@/components/settings/SettingsRandomizer";

// Layout Components
export const SettingsContainer = ({ children }) => (
  <div className="space-y-4 pb-2">{children}</div>
);

export const SettingsItem = ({ children }) => (
  <div className="space-y-1">{children}</div>
);

export const SettingsRow = ({ children }) => (
  <div className="grid grid-cols-2 gap-4">{children}</div>
);

// Form Components
export const GeneralFormSettings = ({ getVal, handleChange, disabled }) => (
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

export const InputTitleSettings = ({ getVal, handleChange, disabled }) => (
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

export const InputDescriptionSettings = ({ getVal, handleChange, disabled }) => (
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

export const EmptyStateSettings = ({ getVal, handleChange, disabled }) => (
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

export const CommentSectionSettings = ({ getVal, handleChange, disabled }) => (
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

export const AppearanceSettingsSection = ({ getVal, handleChange, disabled, defaultStyling, appStyling, handleShuffle, styling, children }) => (
  <SettingsContainer>
    <SettingsAppearance
      styling={getVal("appearance", defaultStyling)}
      onChange={(newStyling) => handleChange("appearance", newStyling)}
      isLoading={disabled}
    />

    <div className="flex justify-end gap-3 mt-2">
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

    <div className="pt-4 border-t border-base-200">
      <div className="font-bold text-sm mb-4">Randomizer</div>
      <SettingsRandomizer
        config={getVal("randomizer", { theme: true, font: true, styling: true, auto: false })}
        onConfigChange={(key, val) => handleChange(`randomizer.${key}`, val)}
        onShuffle={handleShuffle}
        isLoading={disabled}
      />
    </div>
  </SettingsContainer>
);

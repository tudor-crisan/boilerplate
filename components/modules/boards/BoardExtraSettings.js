"use client";

import Input from "@/components/input/Input";
import InputCheckbox from "@/components/input/InputCheckbox";
import Textarea from "@/components/textarea/Textarea";
import Label from "@/components/common/Label";
import Title from "@/components/common/Title";
import Button from "@/components/button/Button";
import EmptyState from "@/components/common/EmptyState";
import SvgPost from "@/components/svg/SvgPost";
import { defaultSetting } from "@/libs/defaults";
import { useStyling } from "@/context/ContextStyling";
import Accordion from "@/components/common/Accordion";
import TextSmall from "@/components/common/TextSmall";

// Helper to safely get nested values
const getNestedValue = (obj, path, defaultValue) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const SettingsContainer = ({ children }) => (
  <div className="space-y-4 pb-2">{children}</div>
);

const SettingsItem = ({ children }) => (
  <div className="space-y-1">{children}</div>
);

const SettingsRow = ({ children }) => (
  <div className="grid grid-cols-2 gap-4">{children}</div>
);

export default function BoardExtraSettings({ settings, onChange, disabled }) {
  const { styling } = useStyling();
  // const [openSection, setOpenSection] = useState("formGeneral"); // No longer needed

  const handleChange = (path, value) => {
    const newSettings = JSON.parse(JSON.stringify(settings));
    const parts = path.split('.');
    let current = newSettings;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    onChange(newSettings);
  };

  const getVal = (path, fallback) => {
    const val = getNestedValue(settings, path); // Call getNestedValue without fallback
    return val !== undefined ? val : fallback; // Use strict undefined check
  };

  const accordionItems = [
    {
      title: "General Form Settings",
      content: (
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
      )
    },
    {
      title: "Input: Title",
      content: (
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
                  // We don't enforce min 10 regarding typing (preventing deletion), but could on blur/save.
                  // For now, let's just let them type and maybe clamp max.
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
      )
    },
    {
      title: "Input: Description",
      content: (
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
      )
    },
    {
      title: "Empty State",
      content: (
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
      <div className="flex-none lg:flex-1 border-t pt-6 lg:border-t-0 lg:pt-0 lg:border-l border-base-300 lg:pl-6">
        <div className="sticky top-0 space-y-8">
          <div className="text-sm uppercase font-bold text-base-content/50 mb-4">PREVIEW</div>
          <div className="space-y-6">
            <div className={`${styling.components.card} space-y-4 ${styling.general.box} p-6 border border-base-200 shadow-sm`}>
              <Title>{getVal("form.title", "Suggest a feature")}</Title>

              <div className="space-y-2">
                <Label>{getVal("form.inputs.title.label", "Short, descriptive title")}</Label>
                <Input
                  placeholder={getVal("form.inputs.title.placeholder", "")}
                  maxLength={getVal("form.inputs.title.maxlength", 60)}
                  showCharacterCount={getVal("form.inputs.title.showCharacterCount", true)}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>{getVal("form.inputs.description.label", "Description")}</Label>
                <Textarea
                  placeholder={getVal("form.inputs.description.placeholder", "")}
                  rows={getVal("form.inputs.description.rows", 4)}
                  maxLength={getVal("form.inputs.description.maxlength", 400)}
                  showCharacterCount={getVal("form.inputs.description.showCharacterCount", true)}
                  readOnly
                  className="w-full"
                />
              </div>

              <Button variant="btn-primary">
                {getVal("form.button", "Add Post")}
              </Button>
            </div>
            <EmptyState
              title={getVal("emptyState.title", defaultSetting.defaultExtraSettings.emptyState.title)}
              description={getVal("emptyState.description", defaultSetting.defaultExtraSettings.emptyState.description)}
              icon={<SvgPost size="size-16" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

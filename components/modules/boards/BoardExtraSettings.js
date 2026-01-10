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
import { useState } from "react";
import { useStyling } from "@/context/ContextStyling";

// Helper to safely get nested values
const getNestedValue = (obj, path, defaultValue) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
};

// Simple accordion section
const Section = ({ title, children, isOpen, onToggle }) => (
  <div className="border border-base-300 rounded-lg overflow-hidden mb-2">
    <button
      className="w-full px-4 py-3 bg-base-200 text-left font-medium flex justify-between items-center"
      onClick={onToggle}
    >
      {title}
      <span>{isOpen ? "−" : "+"}</span>
    </button>
    {isOpen && <div className="p-4 bg-base-100 space-y-4">{children}</div>}
  </div>
);

export default function BoardExtraSettings({ settings, onChange }) {
  const { styling } = useStyling();
  const [openSection, setOpenSection] = useState("formGeneral");

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

  const getVal = (path, fallback) => getNestedValue(settings, path, fallback);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Editor Column */}
      <div className="flex-1 overflow-y-auto pr-2">
        <Section
          title="General Form Settings"
          isOpen={openSection === "formGeneral"}
          onToggle={() => setOpenSection(openSection === "formGeneral" ? "" : "formGeneral")}
        >
          <div className="space-y-3">
            <div>
              <Label>Form Title</Label>
              <Input
                value={getVal("form.title", "")}
                onChange={(e) => handleChange("form.title", e.target.value)}
                placeholder="Suggest a feature"
              />
            </div>
            <div>
              <Label>Submit Button Text</Label>
              <Input
                value={getVal("form.button", "")}
                onChange={(e) => handleChange("form.button", e.target.value)}
                placeholder="Add Post"
              />
            </div>
          </div>
        </Section>

        <Section
          title="Input: Title"
          isOpen={openSection === "inputTitle"}
          onToggle={() => setOpenSection(openSection === "inputTitle" ? "" : "inputTitle")}
        >
          <div className="space-y-3">
            <div>
              <Label>Label</Label>
              <Input
                value={getVal("form.inputs.title.label", "")}
                onChange={(e) => handleChange("form.inputs.title.label", e.target.value)}
              />
            </div>
            <div>
              <Label>Placeholder</Label>
              <Input
                value={getVal("form.inputs.title.placeholder", "")}
                onChange={(e) => handleChange("form.inputs.title.placeholder", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Max Length</Label>
                <Input
                  type="number"
                  value={getVal("form.inputs.title.maxlength", 60)}
                  onChange={(e) => handleChange("form.inputs.title.maxlength", parseInt(e.target.value) || 0)}
                />
              </div>
              <InputCheckbox
                label="Show Count"
                value={getVal("form.inputs.title.showCharacterCount", true)}
                onChange={(checked) => handleChange("form.inputs.title.showCharacterCount", checked)}
                className="pb-3"
              />
            </div>
          </div>
        </Section>

        <Section
          title="Input: Description"
          isOpen={openSection === "inputDescription"}
          onToggle={() => setOpenSection(openSection === "inputDescription" ? "" : "inputDescription")}
        >
          <div className="space-y-3">
            <div>
              <Label>Label</Label>
              <Input
                value={getVal("form.inputs.description.label", "")}
                onChange={(e) => handleChange("form.inputs.description.label", e.target.value)}
              />
            </div>
            <div>
              <Label>Placeholder</Label>
              <Input
                value={getVal("form.inputs.description.placeholder", "")}
                onChange={(e) => handleChange("form.inputs.description.placeholder", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Max Length</Label>
                <Input
                  type="number"
                  value={getVal("form.inputs.description.maxlength", 400)}
                  onChange={(e) => handleChange("form.inputs.description.maxlength", parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Rows</Label>
                <Input
                  type="number"
                  value={getVal("form.inputs.description.rows", 4)}
                  onChange={(e) => handleChange("form.inputs.description.rows", parseInt(e.target.value) || 4)}
                />
              </div>
            </div>
            <InputCheckbox
              label="Show Character Count"
              value={getVal("form.inputs.description.showCharacterCount", true)}
              onChange={(checked) => handleChange("form.inputs.description.showCharacterCount", checked)}
              className="pt-2"
            />
          </div>
        </Section>

        <Section
          title="Empty State"
          isOpen={openSection === "emptyState"}
          onToggle={() => setOpenSection(openSection === "emptyState" ? "" : "emptyState")}
        >
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input
                value={getVal("emptyState.title", "")}
                onChange={(e) => handleChange("emptyState.title", e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={getVal("emptyState.description", "")}
                onChange={(e) => handleChange("emptyState.description", e.target.value)}
              />
            </div>
          </div>
        </Section>
      </div>

      {/* Preview Column */}
      <div className="flex-1 border-l border-base-300 pl-6 hidden lg:block">
        <div className="sticky top-0 space-y-8">
          <div>
            <div className="text-xs uppercase font-bold text-base-content/50 mb-2">Form Preview</div>
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
                />
              </div>

              <Button variant="btn-primary">
                {getVal("form.button", "Add Post")}
              </Button>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase font-bold text-base-content/50 mb-2">Empty State Preview</div>
            <div className="border border-base-200 rounded-lg p-4 bg-base-100">
              <EmptyState
                title={getVal("emptyState.title", defaultSetting.defaultExtraSettings.emptyState.title)}
                description={getVal("emptyState.description", defaultSetting.defaultExtraSettings.emptyState.description)}
                icon={<SvgPost size="size-16" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

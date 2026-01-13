"use client";

import { useMemo, useEffect, useCallback, useRef } from "react";
import Input from "@/components/input/Input";
import InputCheckbox from "@/components/input/InputCheckbox";
import InputToggle from "@/components/input/InputToggle";
import Textarea from "@/components/textarea/Textarea";
import Label from "@/components/common/Label";
import Title from "@/components/common/Title";
import Button from "@/components/button/Button";
import EmptyState from "@/components/common/EmptyState";
import SvgPost from "@/components/svg/SvgPost";
import BoardCommentUI from "./BoardCommentUI";
import SvgComment from "@/components/svg/SvgComment";
import SvgVote from "@/components/svg/SvgVote";
import { defaultSetting, defaultStyling } from "@/libs/defaults";
import { useStyling, ContextStyling } from "@/context/ContextStyling";
import Accordion from "@/components/common/Accordion";
import TextSmall from "@/components/common/TextSmall";
import SettingsAppearance from "@/components/settings/SettingsAppearance";
import SettingsRandomizer from "@/components/settings/SettingsRandomizer";
import themes from "@/lists/themes";
import { fontMap } from "@/lists/fonts";

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

  const handleChange = useCallback((path, value) => {
    const newSettings = JSON.parse(JSON.stringify(settings));
    const parts = path.split('.');
    let current = newSettings;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    onChange(newSettings);
  }, [settings, onChange]);

  const getVal = useCallback((path, fallback) => {
    const val = getNestedValue(settings, path);
    return val !== undefined ? val : fallback;
  }, [settings]);

  // Preview styling: merge global styling with board specific appearance settings
  const previewStyling = useMemo(() => {
    const appearance = getNestedValue(settings, "appearance", {});
    if (!appearance || Object.keys(appearance).length === 0) return defaultStyling;

    return {
      ...defaultStyling,
      ...appearance,
      components: { ...defaultStyling.components, ...appearance.components },
      pricing: { ...defaultStyling.pricing, ...appearance.pricing },
    };
  }, [settings]);

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const handleShuffle = useCallback(() => {
    const config = getVal("randomizer", { theme: true, font: true, styling: true });

    // Start with current appearance or default styling if empty
    let newAppearance = getVal("appearance", JSON.parse(JSON.stringify(defaultStyling)));

    if (config.theme !== false) {
      newAppearance.theme = getRandomItem(themes);
    }

    if (config.font !== false) {
      const fontsKeys = Object.keys(fontMap);
      newAppearance.font = getRandomItem(fontsKeys);
    }

    if (config.styling !== false) {
      const radiusOptions = ["rounded-none", "rounded-md"];
      const randomRadius = getRandomItem(radiusOptions);

      // Ensure objects exist
      if (!newAppearance.components) newAppearance.components = JSON.parse(JSON.stringify(defaultStyling.components));
      if (!newAppearance.pricing) newAppearance.pricing = JSON.parse(JSON.stringify(defaultStyling.pricing));

      const newComponents = { ...newAppearance.components };
      const newPricing = { ...newAppearance.pricing };

      const replaceRadius = (str) =>
        str.replace(/rounded-(none|md|full|lg|xl|2xl|3xl|sm)/g, "").trim() + " " + randomRadius;

      Object.keys(newComponents).forEach((key) => {
        if (typeof newComponents[key] === "string" && newComponents[key].includes("rounded")) {
          newComponents[key] = replaceRadius(newComponents[key]);
        }
      });

      Object.keys(newPricing).forEach((key) => {
        if (typeof newPricing[key] === "string" && newPricing[key].includes("rounded")) {
          newPricing[key] = replaceRadius(newPricing[key]);
        }
      });

      newAppearance.components = newComponents;
      newAppearance.pricing = newPricing;
    }

    handleChange("appearance", newAppearance);
  }, [styling, settings, handleChange, getVal]);

  // Auto Shuffle Effect
  const randomizerConfig = getVal("randomizer", {});
  const isAutoShuffle = randomizerConfig.auto === true;

  const handleShuffleRef = useRef(handleShuffle);

  useEffect(() => {
    handleShuffleRef.current = handleShuffle;
  }, [handleShuffle]);

  useEffect(() => {
    if (!isAutoShuffle) return;

    // Initial shuffle
    handleShuffleRef.current();

    const id = setInterval(() => {
      handleShuffleRef.current();
    }, 3000);

    return () => clearInterval(id);
  }, [isAutoShuffle]);


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
    },
    {
      title: "Appearance",
      content: (
        <SettingsContainer>
          <SettingsAppearance
            styling={getVal("appearance", defaultStyling)}
            onChange={(newStyling) => handleChange("appearance", newStyling)}
            isLoading={disabled}
          />

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
      )
    },
    {
      title: "Comment Section",
      content: (
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
                min={1}
                max={10}
                disabled={disabled}
              />
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
        <ContextStyling.Provider value={{ styling: previewStyling }}>
          <div className="sticky top-0 space-y-8">
            <div className="text-sm uppercase font-bold text-base-content/50 mb-4">PREVIEW</div>
            <div className="space-y-6">
              {/* Wrapper for Theme Isolation */}
              <div
                data-theme={previewStyling.theme?.toLowerCase()}
                className="p-1 space-y-6"
                style={{ fontFamily: fontMap[previewStyling.font] }}
              >
                <div
                  className={`${previewStyling.components.card} space-y-4 ${previewStyling.general.box} p-6 border border-base-200 shadow-sm transition-all duration-300 bg-base-100 text-base-content`}
                >
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

                {/* Comment Section Preview */}
                <div className={`${previewStyling.components.card} ${previewStyling.general.box} p-6 border border-base-200 shadow-sm transition-all duration-300 bg-base-100 text-base-content`}>

                  {/* Mock Post Item for Context */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">This is a preview post</h3>
                      <p className="opacity-80">Here goes the description of what a potential user might write</p>
                    </div>
                    <div className="flex gap-2 text-sm font-medium">
                      <Button
                        className="btn-ghost btn-sm opacity-70 hover:opacity-100 gap-1.5 px-2"
                      >
                        <SvgComment size="size-5" />
                        <span className="text-xs font-normal">1</span>
                      </Button>
                      <Button
                        className="btn-ghost btn-sm gap-1.5 px-2"
                        startIcon={<SvgVote />}
                      >
                        <span className="text-sm font-medium">1</span>
                      </Button>
                    </div>
                  </div>

                  <BoardCommentUI
                    // Mock Comments only if NOT showing empty state
                    comments={getVal("comments.showEmptyStatePreview", false) ? [] : [
                      {
                        _id: "preview-1",
                        userId: { name: "Admin", _id: "admin-id" },
                        boardId: { userId: "admin-id" },
                        text: "Hello, I've left this test comment",
                        createdAt: new Date(),
                      }
                    ]}
                    user={{ isLoggedIn: true, id: "admin-id" }}
                    settings={{
                      showDate: getVal("comments.showDate", true),
                      allowDeletion: getVal("comments.allowDeletion", true),
                      ownerBadgeText: getVal("comments.ownerBadgeText", "Owner"),
                      emptyStateText: getVal("comments.emptyStateText", "Be the first to comment"),
                      label: getVal("comments.label", "Your comment"),
                      placeholder: getVal("comments.placeholder", "What do you think?"),
                      maxLength: getVal("comments.maxLength", 1000),
                      rows: getVal("comments.rows", 3),
                      buttonText: getVal("comments.buttonText", "Post Comment"),
                      showCharacterCount: true
                    }}
                    localCommentIds={["preview-1"]}
                    styling={previewStyling}
                    onTextChange={() => { }}
                    onNameChange={() => { }}
                    onSubmit={(e) => e.preventDefault()}
                    onDelete={() => { }}
                  />

                  {/* Toggle for Previewing Empty State */}
                  <div className="mt-4 pt-4 border-t border-base-200 flex justify-end">
                    <InputToggle
                      label="Preview Empty State"
                      value={getVal("comments.showEmptyStatePreview", false)}
                      onChange={(checked) => handleChange("comments.showEmptyStatePreview", checked)}
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </ContextStyling.Provider>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useEffect, useCallback, useRef } from "react";
import Input from "@/components/input/Input";
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
import { defaultSetting, defaultStyling, appStyling } from "@/libs/defaults";
import { useStyling, ContextStyling } from "@/context/ContextStyling";
import Accordion from "@/components/common/Accordion";
import themes from "@/lists/themes";
import { fontMap } from "@/lists/fonts";
import {
  GeneralFormSettings,
  InputTitleSettings,
  InputDescriptionSettings,
  EmptyStateSettings,
  CommentSectionSettings,
  AppearanceSettingsSection
} from "./BoardSettingsPartials";

// Helper to safely get nested values
const getNestedValue = (obj, path, defaultValue) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

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
      content: <GeneralFormSettings getVal={getVal} handleChange={handleChange} disabled={disabled} />
    },
    {
      title: "Input: Title",
      content: <InputTitleSettings getVal={getVal} handleChange={handleChange} disabled={disabled} />
    },
    {
      title: "Input: Description",
      content: <InputDescriptionSettings getVal={getVal} handleChange={handleChange} disabled={disabled} />
    },
    {
      title: "Empty State",
      content: <EmptyStateSettings getVal={getVal} handleChange={handleChange} disabled={disabled} />
    },
    {
      title: "Comment Section",
      content: <CommentSectionSettings getVal={getVal} handleChange={handleChange} disabled={disabled} />
    },
    {
      title: "Appearance",
      content: (
        <AppearanceSettingsSection
          getVal={getVal}
          handleChange={handleChange}
          disabled={disabled}
          defaultStyling={defaultStyling}
          appStyling={appStyling}
          handleShuffle={handleShuffle}
        // Missing passing 'styling' in partial, but can pass it as children prop or just not use that reset button there
        // Actually, AppearanceSettingsSection expects 'styling' for the "Use profile settings" button
        />
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
                      <h3 className="font-bold text-lg mb-1 line-clamp-1">This is a preview post</h3>
                      <p className="opacity-80 line-clamp-2">Here goes the description of what a potential user might write</p>
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


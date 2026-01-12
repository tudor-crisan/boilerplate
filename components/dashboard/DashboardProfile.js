"use client";

import { useState, useEffect, useCallback } from "react";
import { getNameInitials } from "@/libs/utils.client";
import { useAuth } from "@/context/ContextAuth";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import Avatar from "@/components/common/Avatar";
import Modal from "@/components/common/Modal";
import Button from "@/components/button/Button";
import Label from "@/components/common/Label";
import Input from "@/components/input/Input";
import useForm from "@/hooks/useForm";
import Upload from "@/components/common/Upload";
import ImageCropper from "@/components/common/ImageCropper";
import SettingsAppearance from "@/components/settings/SettingsAppearance";
import SettingsRandomizer from "@/components/settings/SettingsRandomizer";
import Tooltip from "@/components/common/Tooltip";
import useTooltip from "@/hooks/useTooltip";
import { useStyling } from "@/context/ContextStyling";
import themes from "@/lists/themes";
import { fontMap } from "@/lists/fonts";

export default function DashboardProfile() {
  const { styling, setStyling } = useStyling();
  const { isLoggedIn, email, name, initials, image, updateProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const emailTooltip = useTooltip();
  const [tempImage, setTempImage] = useState(null);

  const { inputs, handleChange, resetInputs } = useForm({
    name: name || "",
    image: image || ""
  });

  const [originalStyling, setOriginalStyling] = useState(null);

  // Shuffle Configuration
  const [shuffleConfig, setShuffleConfig] = useState({
    theme: true,
    font: true,
    styling: true,
    auto: false
  });

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const handleShuffle = useCallback(() => {
    setStyling((prev) => {
      const newStyling = { ...prev };

      if (shuffleConfig.theme) {
        newStyling.theme = getRandomItem(themes);
      }

      if (shuffleConfig.font) {
        const fontsKeys = Object.keys(fontMap);
        newStyling.font = getRandomItem(fontsKeys);
      }

      if (shuffleConfig.styling) {
        const radiusOptions = ["rounded-none", "rounded-md"];
        const randomRadius = getRandomItem(radiusOptions);

        const newComponents = { ...newStyling.components };
        const newPricing = { ...newStyling.pricing };

        // Replace any rounded class with new radius
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

        newStyling.components = newComponents;
        newStyling.pricing = newPricing;
      }

      return newStyling;
    });
  }, [shuffleConfig, setStyling]);

  useEffect(() => {
    let interval;
    if (shuffleConfig.auto) {
      handleShuffle(); // Shuffle immediately on enable
      interval = setInterval(handleShuffle, 3000); // Shuffle every 3 seconds
    }
    return () => clearInterval(interval);
  }, [shuffleConfig.auto, handleShuffle]);

  const handleEditClick = () => {
    resetInputs({ name: name || "", image: image || "" });
    setOriginalStyling(JSON.parse(JSON.stringify(styling))); // Deep copy current styling
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    if (originalStyling) {
      setStyling(originalStyling);
    }
    setShuffleConfig(prev => ({ ...prev, auto: false }));
    setIsModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setShuffleConfig(prev => ({ ...prev, auto: false }));
    setIsLoading(true);
    const success = await updateProfile({ ...inputs, styling });
    setIsLoading(false);
    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleFileSelect = (dataUri) => {
    setTempImage(dataUri);
    setIsModalOpen(false);
    setShowCropper(true);
  };

  const handleCropComplete = (croppedImage) => {
    handleChange("image", croppedImage);
    setShowCropper(false);
    setTempImage(null);
    setIsModalOpen(true);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImage(null);
    setIsModalOpen(true);
  };

  if (isLoggedIn) {
    const containerClass = `${styling.flex.responsive} ${styling.components.card} gap-4 ${styling.general.box} items-center`;

    return (
      <div className={containerClass}>
        <div className="space-y-3 text-center sm:text-left w-full sm:w-auto">
          <div className="space-y-1">
            <Title>
              Profile
            </Title>
            <Paragraph>
              Welcome <span className="font-bold">{name}</span>. <br className="hidden sm:block" /> You&apos;re logged in from <span className="font-bold">{email}</span>
            </Paragraph>
          </div>
          <Button onClick={handleEditClick}>
            Edit Profile
          </Button>
        </div>

        <div className="shrink-0 order-first sm:order-0">
          <Avatar
            initials={getNameInitials(name) || initials}
            src={image}
            size="xl"
            className="border-4 border-base-200"
          />
        </div>

        <Modal
          isModalOpen={isModalOpen}
          onClose={handleCancel}
          title="Edit Profile"
          actions={
            <>
              <Button
                className="btn-ghost"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                isLoading={isLoading}
              >
                Save
              </Button>
            </>
          }
        >
          <div className="space-y-6">
            <div className={styling.flex.center}>
              <Avatar
                initials={getNameInitials(inputs.name) || initials}
                src={inputs.image}
                size="xl"
              />
            </div>

            <Upload
              onFileSelect={handleFileSelect}
            />

            {inputs.image && (
              <div className={styling.flex.center}>
                <button
                  type="button"
                  onClick={() => handleChange("image", "")}
                  className={styling.components.link}
                >
                  Remove Image
                </button>
              </div>
            )}

            <div className="w-full space-y-3">
              <div className="space-y-1">
                <Label>
                  Email
                </Label>
                <div onMouseEnter={emailTooltip.show} onMouseLeave={emailTooltip.hide}>
                  <Tooltip text="Email address can't be edited" isVisible={emailTooltip.isVisible}>
                    <Input
                      type="email"
                      value={email}
                      disabled={true}
                      placeholder="your@email.com"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="space-y-1">
                <Label>
                  Display Name
                </Label>
                <Input
                  required
                  type="text"
                  value={inputs.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your Name"
                  maxLength={30}
                  showCharacterCount
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="w-full space-y-6 pt-4 border-t border-base-200">
              <Title>Appearance</Title>
              <SettingsAppearance
                styling={styling}
                onChange={setStyling}
                isLoading={isLoading}
              />
            </div>

            <div className="w-full space-y-6 pt-4 border-t border-base-200">
              <SettingsRandomizer
                title={<Title>Randomizer</Title>}
                config={shuffleConfig}
                onConfigChange={(key, val) => setShuffleConfig(prev => ({ ...prev, [key]: val }))}
                onShuffle={handleShuffle}
                isLoading={isLoading}
              />
            </div>
          </div>
        </Modal>

        {showCropper && tempImage && (
          <ImageCropper
            imageSrc={tempImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        )}
      </div>
    );
  }

  return null;
}
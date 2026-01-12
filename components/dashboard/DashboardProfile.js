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
import Select from "@/components/select/Select";
import InputButton from "@/components/input/InputButton";
import InputCheckbox from "@/components/input/InputCheckbox";
import { useStyling } from "@/context/ContextStyling";
import themes from "@/lists/themes";
import { fontMap } from "@/lists/fonts";
import Grid from "../common/Grid";

export default function DashboardProfile() {
  const { styling, setStyling } = useStyling();
  const { isLoggedIn, email, name, initials, image, updateProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
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
    styling: true
  });
  const [isAutoShuffle, setIsAutoShuffle] = useState(false);

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
    if (isAutoShuffle) {
      handleShuffle(); // Shuffle immediately on enable
      interval = setInterval(handleShuffle, 3000); // Shuffle every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoShuffle, handleShuffle]);

  const handleEditClick = () => {
    resetInputs({ name: name || "", image: image || "" });
    setOriginalStyling(JSON.parse(JSON.stringify(styling))); // Deep copy current styling
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    if (originalStyling) {
      setStyling(originalStyling);
    }
    setIsAutoShuffle(false);
    setIsModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsAutoShuffle(false);
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
              <Grid>
                <div className="space-y-1">
                  <Label>Theme</Label>
                  <Select
                    className="w-full capitalize"
                    value={styling.theme}
                    onChange={(e) => setStyling((prev) => ({ ...prev, theme: e.target.value }))}
                    options={themes}
                    withNavigation={true}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1">
                  <Label>Font</Label>
                  <Select
                    className="w-full"
                    value={styling.font}
                    onChange={(e) => setStyling((prev) => ({ ...prev, font: e.target.value }))}
                    options={Object.entries(fontMap).map(([key, name]) => ({ label: name, value: key }))}
                    withNavigation={true}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Styling</Label>
                  <InputButton
                    options={[
                      { label: "Square", value: "rounded-none" },
                      { label: "Rounded", value: "rounded-md" }
                    ]}
                    value={styling.components.input.split(" ").find(c => c.startsWith("rounded-")) || "rounded-md"}
                    onChange={(radius) => {
                      const newComponents = { ...styling.components };
                      const newPricing = { ...styling.pricing };

                      // Replace any rounded class with new radius
                      const replaceRadius = (str) =>
                        str.replace(/rounded-(none|md|full|lg|xl|2xl|3xl|sm)/g, "").trim() + " " + radius;

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

                      setStyling((prev) => ({ ...prev, components: newComponents, pricing: newPricing }));
                    }}
                    disabled={isLoading}
                  />
                </div>
              </Grid>
            </div>

            <div className="w-full space-y-6 pt-4 border-t border-base-200">
              <div className="flex items-center justify-between">
                <Title>Randomizer</Title>
                <div className="flex items-center gap-2">
                  <InputCheckbox
                    label="Auto Shuffle"
                    className="toggle-sm"
                    value={isAutoShuffle}
                    onChange={(checked) => setIsAutoShuffle(checked)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Grid>
                <div className="flex items-center gap-4 col-span-2 sm:col-span-1">
                  <InputCheckbox
                    label="Theme"
                    value={shuffleConfig.theme}
                    onChange={(checked) => setShuffleConfig(prev => ({ ...prev, theme: checked }))}
                    className="checkbox-sm"
                    disabled={isLoading}
                  />
                  <InputCheckbox
                    label="Font"
                    value={shuffleConfig.font}
                    onChange={(checked) => setShuffleConfig(prev => ({ ...prev, font: checked }))}
                    className="checkbox-sm"
                    disabled={isLoading}
                  />
                  <InputCheckbox
                    label="Styling"
                    value={shuffleConfig.styling}
                    onChange={(checked) => setShuffleConfig(prev => ({ ...prev, styling: checked }))}
                    className="checkbox-sm"
                    disabled={isLoading}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1 flex justify-end">
                  <Button
                    onClick={handleShuffle}
                    className="w-full sm:w-auto btn-outline"
                    type="button"
                    disabled={isLoading}
                  >
                    Shuffle Now
                  </Button>
                </div>
              </Grid>
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
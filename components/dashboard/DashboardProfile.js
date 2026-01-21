"use client";

import Button from "@/components/button/Button";
import ImageCropper from "@/components/common/ImageCropper";
import Paragraph from "@/components/common/Paragraph";
import ProfileImage from "@/components/common/ProfileImage";
import Title from "@/components/common/Title";
import DashboardProfileEditModal from "@/components/dashboard/DashboardProfileEditModal";
import { useAuth } from "@/context/ContextAuth";
import { useStyling } from "@/context/ContextStyling";
import useForm from "@/hooks/useForm";
import { useStylingRandomizer } from "@/hooks/useStylingRandomizer";
import { cn, getNameInitials } from "@/libs/utils.client";
import { useState } from "react";

export default function DashboardProfile() {
  const { styling, setStyling } = useStyling();
  const { isLoggedIn, email, name, initials, image, updateProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  const [tempImage, setTempImage] = useState(null);

  const { inputs, handleChange, resetInputs } = useForm({
    name: name || "",
    image: image || "",
  });

  const [originalStyling, setOriginalStyling] = useState(null);

  // Randomizer Hook
  const { shuffleConfig, setShuffleConfig, handleShuffle } =
    useStylingRandomizer({ setStyling });

  const handleEditClick = () => {
    resetInputs({ name: name || "", image: image || "" });
    setOriginalStyling(JSON.parse(JSON.stringify(styling))); // Deep copy current styling
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    if (originalStyling) {
      setStyling(originalStyling);
    }
    setShuffleConfig((prev) => ({ ...prev, auto: false }));
    setIsModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setShuffleConfig((prev) => ({ ...prev, auto: false }));
    setIsLoading(true);
    const success = await updateProfile({
      ...inputs,
      styling,
    });
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

  if (!isLoggedIn) return null;

  const containerClass = cn(
    styling.flex.responsive,
    styling.components.card,
    "gap-4",
    styling.general.box,
    styling.flex.items_center,
  );

  return (
    <div className={containerClass}>
      <div
        className={cn(
          styling.flex.col,
          "space-y-3 text-center sm:text-left w-full sm:w-auto",
        )}
      >
        <div className="space-y-1">
          <Title>Profile</Title>
          <Paragraph className="overflow-hidden">
            Welcome <span className="font-bold">{name}</span>.{" "}
            <br className="hidden sm:block" /> You&apos;re logged in from{" "}
            <span className="font-bold">{email}</span>
          </Paragraph>
        </div>
        <Button
          onClick={handleEditClick}
          className="w-fit self-center sm:self-start"
        >
          Edit Profile
        </Button>
      </div>

      <div className="shrink-0 order-first sm:order-0">
        <ProfileImage
          initials={getNameInitials(name) || initials}
          src={image}
          size="xl"
          className="border-4 border-base-200"
        />
      </div>

      <DashboardProfileEditModal
        isModalOpen={isModalOpen}
        onClose={handleCancel}
        isLoading={isLoading}
        onSave={handleSave}
        inputs={inputs}
        handleChange={handleChange}
        styling={styling}
        setStyling={setStyling}
        email={email}
        initials={initials}
        onFileSelect={handleFileSelect}
        shuffleConfig={shuffleConfig}
        setShuffleConfig={setShuffleConfig}
        handleShuffle={handleShuffle}
      />

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

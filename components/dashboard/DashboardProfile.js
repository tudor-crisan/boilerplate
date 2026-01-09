"use client";
import { useState } from "react";
import { getNameInitials } from "@/libs/utils.client";
import { useAuth } from "@/context/ContextAuth";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import Avatar from "@/components/common/Avatar";
import Modal from "@/components/common/Modal";
import Button from "@/components/button/Button";
import Form from "@/components/common/Form";
import Label from "@/components/common/Label";
import Input from "@/components/input/Input";
import useForm from "@/hooks/useForm";
import Upload from "@/components/common/Upload";
import { useStyling } from "@/context/ContextStyling";

export default function DashboardProfile() {
  const { styling } = useStyling();
  const { isLoggedIn, email, name, initials, image, updateProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { inputs, handleChange, resetInputs } = useForm({
    name: name || "",
    image: image || ""
  });

  const handleEditClick = () => {
    resetInputs({ name: name || "", image: image || "" });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await updateProfile(inputs);
    setIsSaving(false);
    if (success) {
      setIsModalOpen(false);
    }
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
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Profile"
        >
          <Form onSubmit={handleSave} className="space-y-6">
            <div className={styling.flex.center}>
              <Avatar
                initials={getNameInitials(inputs.name) || initials}
                src={inputs.image}
                size="xl"
              />
            </div>

            <Upload
              onFileSelect={(dataUri) => handleChange("image", dataUri)}
            />

            {inputs.image && (
              <div className={styling.flex.center}>
                <button
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
                />
              </div>
              <div className="w-full text-center">
                <Button
                  type="submit"
                  isLoading={isSaving}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }

  return null;
}
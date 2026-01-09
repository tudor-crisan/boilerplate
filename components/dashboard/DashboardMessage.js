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

export default function DashboardMessage() {
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
        <div className="space-y-3 text-center sm:text-left">
          <div className="space-y-1">
            <Title>
              Dashboard
            </Title>
            <Paragraph>
              Welcome <span className="font-bold">&quot;{name}&quot;</span>. <br /> You&apos;re logged in from <span className="font-bold">&quot;{email}&quot;</span>
            </Paragraph>
          </div>
          <Button onClick={handleEditClick}>
            Edit Profile
          </Button>
        </div>

        <div className="shrink-0">
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
            <div className={`flex justify-center ${styling.flex.center}`}>
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
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => handleChange("image", "")}
                  className="text-error text-sm hover:underline"
                >
                  Remove Image
                </button>
              </div>
            )}

            <div className="w-full">
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

            <div className="pt-4">
              <Button
                type="submit"
                className="btn-primary w-full"
                isLoading={isSaving}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }

  return null;
}
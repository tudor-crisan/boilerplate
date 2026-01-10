"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button/Button";
import Modal from "@/components/common/Modal";
import Input from "@/components/input/Input";
import Label from "@/components/common/Label";
import useApiRequest from "@/hooks/useApiRequest";
import { clientApi } from "@/libs/api";
import { defaultSetting as settings } from "@/libs/defaults";
import TextSmall from "@/components/common/TextSmall";
import { createSlug } from "@/libs/utils.client";

export default function BoardEditModal({ boardId, currentSlug, currentName, className = "" }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slug, setSlug] = useState(currentSlug || "");
  const { loading, request } = useApiRequest();

  // Default slug generation from name if empty and no current slug
  const handleOpen = () => {
    if (!slug && !currentSlug) {
      setSlug(createSlug(currentName));
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await request(
      () => clientApi.put(settings.paths.api.boardsDetail, { boardId, slug }),
      {
        onSuccess: () => {
          setIsModalOpen(false);
          router.refresh();
        },
        showToast: true
      }
    );
  };

  return (
    <div className={className}>
      <Button
        onClick={handleOpen}
        variant="btn-secondary"
      >
        Edit board
      </Button>

      <Modal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Board"
        actions={
          <>
            <Button
              className="btn-ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              isLoading={loading}
            >
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Board Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(createSlug(e.target.value, false))}
              placeholder="e.g. my-awesome-board"
              maxLength={30}
              showCharacterCount={true}
              disabled={loading}
            />
          </div>
          <TextSmall>
            This will change the public link to your board. You can only change this once per day.
          </TextSmall>
        </div>
      </Modal>
    </div>
  );
}

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
import Textarea from "@/components/textarea/Textarea";

export default function BoardEditModal({ boardId, currentSlug, currentName, extraSettings = {}, className = "" }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slug, setSlug] = useState(currentSlug || "");
  const defaultTemplate = {
    form: {
      title: "Suggest a feature",
      button: "Add Post",
      inputs: {
        title: {
          label: "Short, descriptive title",
          placeholder: "Green buttons plz"
        },
        description: {
          label: "Description",
          placeholder: "The login button color should be green to match our brand colors."
        }
      }
    },
    emptyState: {
      title: "Be the first to post",
      description: "Create a new post to see it here"
    }
  };

  // Check if extraSettings is empty object or null/undefined
  const hasSettings = extraSettings && Object.keys(extraSettings).length > 0;

  const [settingsJSON, setSettingsJSON] = useState(
    hasSettings
      ? JSON.stringify(extraSettings, null, 2)
      : JSON.stringify(defaultTemplate, null, 2)
  );
  const { loading, request } = useApiRequest();

  // Reset/Sync state when modal opens
  const handleOpen = () => {
    if (!slug && !currentSlug) {
      setSlug(createSlug(currentName));
    }

    // Always sync with latest prop when opening
    if (extraSettings && Object.keys(extraSettings).length > 0) {
      setSettingsJSON(JSON.stringify(extraSettings, null, 2));
    } else {
      setSettingsJSON(JSON.stringify(defaultTemplate, null, 2));
    }

    setIsModalOpen(true);
  };

  const handleSave = async () => {
    let parsedSettings = {};
    try {
      parsedSettings = JSON.parse(settingsJSON);
    } catch (e) {
      alert("Invalid JSON in Extra Settings");
      return;
    }

    await request(
      () => clientApi.put(settings.paths.api.boardsDetail, { boardId, slug, extraSettings: parsedSettings }),
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

          <div className="space-y-2">
            <Label>Extra Settings (JSON)</Label>
            <Textarea
              value={settingsJSON}
              onChange={(e) => setSettingsJSON(e.target.value)}
              className="w-full"
              placeholder="{}"
              rows={10}
              disabled={loading}
            />
            <TextSmall>
              Override default texts. Valid JSON required.
            </TextSmall>
          </div>
        </div>
      </Modal>
    </div>
  );
}

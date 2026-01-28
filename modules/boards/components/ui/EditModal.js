"use client";
import Button from "@/components/button/Button";
import Label from "@/components/common/Label";
import Modal from "@/components/common/Modal";
import TextSmall from "@/components/common/TextSmall";
import Input from "@/components/input/Input";
import { useStyling } from "@/context/ContextStyling";
import useApiRequest from "@/hooks/useApiRequest";
import { clientApi } from "@/libs/api";
import { defaultSetting as settings } from "@/libs/defaults";
import { createSlug } from "@/libs/utils.client";
import BoardExtraSettings from "@/modules/boards/components/ui/ExtraSettings";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BoardEditModal({
  boardId,
  currentSlug,
  currentName,
  extraSettings = {},
  className = "",
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slug, setSlug] = useState(currentSlug || "");
  const [name, setName] = useState(currentName || "");
  const defaultTemplate = settings.defaultExtraSettings;
  const { styling } = useStyling();

  // Check if extraSettings is empty object or null/undefined
  const hasSettings = extraSettings && Object.keys(extraSettings).length > 0;

  const [settingsState, setSettingsState] = useState(
    hasSettings ? extraSettings : defaultTemplate,
  );

  const { loading, request } = useApiRequest();

  // Reset/Sync state when modal opens
  const handleOpen = () => {
    if (!slug && !currentSlug) {
      setSlug(createSlug(currentName));
    }
    if (!name && !currentName) {
      setName(currentName);
    }

    // Always sync with latest prop when opening
    if (extraSettings && Object.keys(extraSettings).length > 0) {
      setSettingsState(extraSettings);
    } else {
      setSettingsState(defaultTemplate);
    }

    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await request(
      () =>
        clientApi.put(settings.paths.api.boardsDetail, {
          boardId,
          slug,
          name,
          extraSettings: settingsState,
        }),
      {
        onSuccess: () => {
          setIsModalOpen(false);
          router.refresh();
        },
        showToast: true,
      },
    );
  };

  return (
    <div className={className}>
      <Button onClick={handleOpen}>Edit board</Button>

      <Modal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Board"
        boxClassName="max-w-7xl"
        actions={
          <>
            <Button
              className="btn-ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={loading}>
              Save
            </Button>
          </>
        }
      >
        <div className={`${styling.flex.col} gap-6`}>
          <div className="space-y-2 border-b border-base-200 pb-6">
            <Label>Board Name</Label>
            <Input
              required={true}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Awesome Board"
              maxLength={settings.forms.Board.inputsConfig.name.maxlength || 50}
              showCharacterCount={
                settings.forms.Board.inputsConfig.name.showCharacterCount
              }
              disabled={loading}
            />
          </div>
          <div className="space-y-2 border-b border-base-200 pb-6">
            <Label>Board Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(createSlug(e.target.value, false))}
              placeholder="e.g. my-awesome-board"
              maxLength={30}
              showCharacterCount={true}
              disabled={loading}
              className="w-full"
            />
            <TextSmall>
              This will change the public link to your board. You can only
              change this once per day.
            </TextSmall>
          </div>

          <div className="min-h-0">
            <BoardExtraSettings
              settings={settingsState}
              onChange={setSettingsState}
              disabled={loading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button/Button";
import Modal from "@/components/common/Modal";
import Input from "@/components/input/Input";
import Label from "@/components/common/Label";
import useApiRequest from "@/hooks/useApiRequest";
import { clientApi } from "@/libs/api";

export default function BoardEditSlug({ boardId, currentSlug, currentName, className = "" }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [slug, setSlug] = useState(currentSlug || "");
  const { loading, request } = useApiRequest();

  // Default slug generation from name if empty and no current slug
  const handleOpen = () => {
    if (!slug && !currentSlug) {
      setSlug(currentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    await request(
      () => clientApi.put("/api/modules/boards/board", { boardId, slug }),
      {
        onSuccess: (data) => {
          const newSlug = data?.slug;
          setIsOpen(false);
          if (newSlug && newSlug !== currentSlug) {
            // Redirect to new slug URL
            router.push(`/b/${newSlug}`);
          } else {
            router.refresh();
          }
        },
        showToast: true
      }
    );
  };

  return (
    <div className={className}>
      <Button onClick={handleOpen} variant="btn-secondary" className="w-full mb-2">
        Edit board
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Board Slug"
        actions={
          <>
            <Button className="btn-ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} isLoading={loading}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Board Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. my-awesome-board"
              maxLength={50}
              showCharacterCount={true}
            />
            <p className="text-xs text-base-content/70 mt-1">
              This will change the public link to your board. You can only change this once per day.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

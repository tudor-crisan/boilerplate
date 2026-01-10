"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "@/libs/api";
import useApiRequest from "@/hooks/useApiRequest";
import SvgTrash from "@/components/svg/SvgTrash";
import Button from "@/components/button/Button";
import Modal from "@/components/common/Modal";
import { defaultSetting as settings } from "@/libs/defaults";
import Paragraph from "@/components/common/Paragraph";

export default function ButtonDelete({
  url = "",
  buttonText = "Delete",
  withConfirm = true,
  confirmMessage = "Are you sure you want to delete?",
  withRedirect = true,
  redirectUrl = settings.paths.dashboard.source,
  refreshOnSuccess = false,
  withToast = true,
}) {
  const router = useRouter();
  const { loading, request } = useApiRequest();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    if (withConfirm) {
      setIsOpen(true);
      return;
    }
    await confirmDelete();
  };

  const confirmDelete = async () => {
    await request(
      () => clientApi.delete(url),
      {
        onSuccess: () => {
          if (refreshOnSuccess) {
            router.refresh();
          } else if (withRedirect) {
            router.push(redirectUrl);
          }
          setIsOpen(false);
        },
        keepLoadingOnSuccess: withRedirect,
        showToast: withToast
      }
    );
  };

  return (
    <>
      <Button
        isLoading={loading}
        variant="btn-error"
        onClick={() => handleDelete()}
        startIcon={<SvgTrash />}
      >
        {buttonText}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Deletion"
        actions={
          <>
            <Button
              className="btn-ghost"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="btn-error"
              onClick={confirmDelete}
              isLoading={loading}
            >
              Delete
            </Button>
          </>
        }
      >
        <Paragraph>{confirmMessage}</Paragraph>
      </Modal>
    </>
  );
}
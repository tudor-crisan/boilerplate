"use client";
import Button from "@/components/button/Button";
import Modal from "@/components/common/Modal";
import Paragraph from "@/components/common/Paragraph";
import SvgTrash from "@/components/svg/SvgTrash";
import { useStyling } from "@/context/ContextStyling";
import useApiRequest from "@/hooks/useApiRequest";
import { clientApi } from "@/libs/api";
import { defaultSetting as settings } from "@/libs/defaults";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { styling } = useStyling();

  const handleDelete = async () => {
    if (withConfirm) {
      setIsModalOpen(true);
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
          setIsModalOpen(false);
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
        variant="btn-error btn-outline"
        onClick={() => handleDelete()}
        startIcon={<SvgTrash />}
      >
        {buttonText}
      </Button>

      <Modal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Deletion"
        contentClassName="p-0! pb-2!"
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
              variant="btn-error btn-outline"
              onClick={confirmDelete}
              isLoading={loading}
            >
              Delete
            </Button>
          </>
        }
      >
        <Paragraph className={`${styling.general.element} text-center`}>
          {confirmMessage}
        </Paragraph>
      </Modal>
    </>
  );
}
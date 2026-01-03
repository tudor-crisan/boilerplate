"use client";
import { useRouter } from "next/navigation";
import { clientApi } from "@/libs/api";
import useApiRequest from "@/hooks/useApiRequest";
import SvgTrash from "@/components/svg/SvgTrash";
import Button from "@/components/button/Button";
import { defaultSetting as settings } from "@/libs/defaults";

export default function ButtonDelete({
  url = "",
  buttonText = "Delete",
  withConfirm = true,
  confirmMessage = "Are you sure you want to delete?",
  withRedirect = true,
  redirectUrl = settings.paths.dashboard.source,
  refreshOnSuccess = false,
}) {
  const router = useRouter();
  const { loading, request } = useApiRequest();

  const handleDelete = async () => {
    if (withConfirm && !window.confirm(confirmMessage)) {
      return;
    }

    await request(
      () => clientApi.delete(url),
      {
        onSuccess: () => {
          if (refreshOnSuccess) {
            router.refresh();
          } else if (withRedirect) {
            router.push(redirectUrl);
          }
        },
        keepLoadingOnSuccess: withRedirect
      }
    );
  };

  return (
    <Button
      isLoading={loading}
      variant="btn-error"
      onClick={() => handleDelete()}
      startIcon={<SvgTrash />}
    >
      {buttonText}
    </Button>
  )
}
"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import useApiRequest from "@/hooks/useApiRequest";
import SvgTrash from "@/components/svg/SvgTrash";
import Button from "@/components/button/Button";

export default function ButtonDelete({
  url = "/api/...",
  buttonText = "Delete",
  withConfirm = true,
  confirmMessage = "Are you sure you want to delete?",
  withRedirect = true,
  redirectUrl = "/dashboard",
  refreshOnSuccess = false,
}) {
  const router = useRouter();
  const { loading, request } = useApiRequest();

  const handleDelete = async () => {
    if (withConfirm && !window.confirm(confirmMessage)) {
      return;
    }

    await request(
      () => axios.delete(url),
      {
        onSuccess: () => {
          if (refreshOnSuccess) {
            router.refresh();
          } else {
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
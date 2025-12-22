"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import useApiRequest from "@/hooks/useApiRequest";
import SvgTrash from "@/components/svg/SvgTrash";
import { useStyling } from "@/context/ContextStyling";
import IconLoading from "../icon/IconLoading";

export default function ButtonDelete({
  url = "/api/...",
  buttonText = "Delete",
  withConfirm = true,
  confirmMessage = "Are you sure you want to delete?",
  withRedirect = true,
  redirectUrl = "/dashboard"
}) {
  const { styling } = useStyling();
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
          router.push(redirectUrl);
        },
        keepLoadingOnSuccess: withRedirect
      }
    );
  };

  return (
    <button
      disabled={loading}
      className={`${styling.roundness[0]} ${styling.shadows[0]} btn-sm sm:btn-md btn btn-error`}
      onClick={() => handleDelete()}
    >
      {loading ? <IconLoading /> : <SvgTrash />}
      {buttonText}
    </button>
  )
}
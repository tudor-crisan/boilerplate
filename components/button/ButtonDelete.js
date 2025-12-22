"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setDataError, setDataSuccess } from "@/libs/api";
import { toast } from "react-hot-toast";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      toast.success(message);
      setMessage("");
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError("");
    }
  }, [error]);

  const errorCallback = (error = "", inputErrors = {}) => {
    setError(error);
  }

  const successCallback = (message) => {
    setMessage(message);
    router.push(redirectUrl);
  }

  const handleDelete = async () => {
    if (withConfirm && !window.confirm(confirmMessage)) {
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.delete(url);

      if (setDataError(response, errorCallback)) {
        return;
      }

      if (setDataSuccess(response, successCallback)) {
        return;
      }
    } catch (err) {
      setDataError(err?.response, errorCallback);

    } finally {
      if (!withRedirect) {
        setLoading(false);
      }
    }
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
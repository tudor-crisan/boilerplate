"use client";

import Paragraph from "@/components/common/Paragraph";
import SvgCheck from "@/components/svg/SvgCheck";
import SvgClose from "@/components/svg/SvgClose";
import SvgError from "@/components/svg/SvgError";
import { useStyling } from "@/context/ContextStyling";
import { toast } from "@/libs/toast";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastItem = ({ t, styling }) => {
  const isSuccess = t.type === "success";
  const isError = t.type === "error";

  // Base styles from configuration
  const baseClasses =
    styling.components.toaster || "rounded-lg shadow-lg border p-4";

  // Specific variants based on user request
  // Success: primary border, base background
  // Error: red background, red border
  const variantClasses = isSuccess
    ? "bg-base-100 border-primary text-base-content"
    : isError
      ? "bg-red-50 border-red-500 text-red-900"
      : "bg-white text-gray-900 border-base-200";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`
        pointer-events-auto 
        flex w-full max-w-sm
        ${baseClasses}
        ${variantClasses}
      `}
    >
      <div className="flex-1 w-0">
        <div className="flex items-center gap-4">
          {isSuccess && (
            <div className="shrink-0">
              <SvgCheck className="size-8 text-primary" />
            </div>
          )}
          {isError && (
            <div className="shrink-0">
              <SvgError className="size-8 text-red-500" />
            </div>
          )}
          <div className="flex-1">
            {/* If it's a string, wrap in p, else render directly (for custom jsx) */}
            {typeof t.message === "string" ? (
              <Paragraph className="text-sm font-medium">{t.message}</Paragraph>
            ) : (
              t.message
            )}
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="shrink-0 flex items-center justify-center ml-4 text-current opacity-50 hover:opacity-100 focus:outline-none transition-opacity curosor-pointer"
          >
            <SvgClose className="size-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function Toaster() {
  const [toasts, setToasts] = useState([]);
  const { styling } = useStyling();

  useEffect(() => {
    return toast.subscribe((newToasts) => {
      setToasts([...newToasts]);
    });
  }, []);

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 z-53 flex flex-col items-center justify-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end sm:justify-end gap-2"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} t={t} styling={styling} />
        ))}
      </AnimatePresence>
    </div>
  );
}

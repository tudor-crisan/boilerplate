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
  const baseClasses = styling.components.toaster || "";

  // Specific variants based on user request
  // Success: primary border, base background
  // Error: red background, red border
  const variantClasses = isSuccess
    ? "bg-base-100 border-primary text-base-content"
    : isError
      ? "bg-red-50 border-red-500 text-red-900"
      : "bg-white text-gray-900 border-base-200";

  const iconClasses = styling.components.toaster_icons || "";
  const successIconClasses = `${iconClasses} bg-primary border-primary text-primary-content`;
  const errorIconClasses = `${iconClasses} bg-error border-error text-error-content`;

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
            <div className={`shrink-0 ${successIconClasses}`}>
              <SvgCheck className="size-6" />
            </div>
          )}
          {isError && (
            <div className={`shrink-0 ${errorIconClasses}`}>
              <SvgError className="size-6" />
            </div>
          )}
          <div className="flex-1">
            {/* If it's a string, wrap in p, else render directly (for custom jsx) */}
            {typeof t.message === "string" ? (
              <Paragraph
                className={`text-sm font-medium overflow-hidden ${isError ? "text-error" : ""}`}
              >
                {t.message}
              </Paragraph>
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

export default function Toaster({ isGlobal = false }) {
  const [toasts, setToasts] = useState([]);
  const { styling } = useStyling();
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    return toast.subscribe((newToasts) => {
      setToasts([...newToasts]);
    });
  }, []);

  // If this is the global toaster and we are on a board page (/b/), do not render
  // because the board page has its own local toaster with custom styling.
  if (isGlobal && pathname.startsWith("/b/")) {
    return null;
  }

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

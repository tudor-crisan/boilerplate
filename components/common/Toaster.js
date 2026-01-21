"use client";

import SvgCheck from "@/components/svg/SvgCheck";
import SvgClose from "@/components/svg/SvgClose";
import SvgError from "@/components/svg/SvgError";
import { toast } from "@/libs/toast";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastItem = ({ t }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`
        pointer-events-auto 
        flex w-full max-w-sm rounded-lg shadow-lg ring-1 ring-black/5 
        ${t.type === "error" ? "bg-red-50 text-red-900 border-red-200" : "bg-white text-gray-900 border-base-200"}
        border p-4
      `}
    >
      <div className="flex-1 w-0 p-1">
        <div className="flex items-start gap-3">
          {t.type === "success" && (
            <div className="shrink-0 pt-0.5">
              <SvgCheck className="size-5 text-green-500" />
            </div>
          )}
          {t.type === "error" && (
            <div className="shrink-0 pt-0.5">
              <SvgError className="size-5 text-red-500" />
            </div>
          )}
          <div className="flex-1">
            {/* If it's a string, wrap in p, else render directly (for custom jsx) */}
            {typeof t.message === "string" ? (
              <p className="text-sm font-medium">{t.message}</p>
            ) : (
              t.message
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200 ml-3">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0"
        >
          <SvgClose className="size-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return toast.subscribe((newToasts) => {
      setToasts([...newToasts]);
    });
  }, []);

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 z-51 flex flex-col items-center justify-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end sm:justify-end gap-2"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} t={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}

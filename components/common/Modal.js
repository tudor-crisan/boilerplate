"use client";
import Button from "@/components/button/Button";
import Title from "@/components/common/Title";
import { useStyling } from "@/context/ContextStyling";
import { cn } from "@/libs/utils.client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = ({
  isModalOpen,
  onClose,
  title,
  children,
  boxClassName = "",
  contentClassName = "",
  actions
}) => {
  const { styling } = useStyling();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn("modal modal-bottom sm:modal-middle z-50", isModalOpen && "modal-open")}
      role="dialog"
    >
      <div className={cn(`${styling.components.modal} modal-box max-h-[calc(100vh-10rem)] p-0 pb-4 sm:pb-0 ${styling.flex.col} overflow-hidden`, boxClassName)}>
        {title && (
          <div className="w-full text-center p-4 sm:p-6 pb-2 sm:pb-2 flex-none z-10 bg-base-100 border-b border-base-200">
            <Title>{title}</Title>
          </div>
        )}

        <div className={cn(`flex-1 overflow-y-auto p-4 sm:p-6 pt-2`, contentClassName)}>
          <div className="space-y-3">
            {children}
          </div>
        </div>

        <div className="modal-action justify-center p-4 sm:p-6 pt-2 mt-0 flex-none bg-base-100 z-10 border-t border-base-200">
          {actions ? actions : (
            <Button className="btn-ghost" onClick={onClose}>Close</Button>
          )}
        </div>
      </div>
      <div
        className={cn(
          "modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 -z-10",
          isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      >
        <button className="cursor-default w-full h-full outline-none">close</button>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

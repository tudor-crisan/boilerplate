"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/libs/utils.client";
import Button from "@/components/button/Button";
import Title from "@/components/common/Title";
import { useStyling } from "@/context/ContextStyling";

const Modal = ({
  isModalOpen,
  onClose,
  title,
  children,
  className = "",
  boxClassName = "",
  contentClassName = "",
  actions
}) => {
  const { styling } = useStyling();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isModalOpen, onClose]);

  return (
    <div className={cn("modal modal-bottom sm:modal-middle", isModalOpen && "modal-open")} role="dialog">

      <div className={cn(`${styling.components.modal} modal-box max-h-[calc(100vh-4rem)] p-0 flex flex-col overflow-hidden`, boxClassName)}>
        {title && (
          <div className="w-full text-center p-4 sm:p-6 pb-2 sm:pb-2 flex-none z-10 bg-base-100">
            <Title>{title}</Title>
          </div>
        )}

        <div className={cn(`flex-1 overflow-y-auto p-4 sm:p-6 pt-2`, contentClassName)}>
          <div className="space-y-3">
            {children}
          </div>
        </div>

        <div className="modal-action justify-center p-4 sm:p-6 pt-2 mt-0 flex-none bg-base-100 z-10">
          {actions ? actions : (
            <Button className="btn-ghost" onClick={onClose}>Close</Button>
          )}
        </div>
      </div>
      <div className="modal-backdrop bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <button className="cursor-default">close</button>
      </div>
    </div>
  );
};

export default Modal;

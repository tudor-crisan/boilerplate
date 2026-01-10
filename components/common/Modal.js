"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/libs/utils.client";
import Button from "@/components/button/Button";
import Title from "@/components/common/Title";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  boxClassName = "",
  actions
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <div className={cn("modal modal-bottom sm:modal-middle", isOpen && "modal-open", className)} role="dialog">

      <div className={cn("modal-box", boxClassName)}>
        {title && <Title className="mb-4">{title}</Title>}

        {children}

        <div className="modal-action justify-center">
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

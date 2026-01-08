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
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  // Handle ESC key and backdrop click manually if needed, 
  // but DaisyUI dialog with method="dialog" handles backdrop click if we structure it right.
  // Actually, standard HTML dialog close on backdrop needs a form method="dialog" or click handler.

  return (
    <dialog ref={modalRef} className={cn("modal modal-bottom sm:modal-middle", className)} onClose={onClose}>
      <div className={cn("modal-box", boxClassName)}>
        {title && <Title className="mb-4">{title}</Title>}

        {children}

        <div className="modal-action justify-center">
          {actions ? actions : (
            <Button className="btn-ghost" onClick={onClose}>Close</Button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/60 backdrop-blur-sm">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default Modal;

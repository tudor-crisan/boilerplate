import Button from "@/components/button/Button";
import Modal from "@/components/common/Modal";
import Paragraph from "@/components/common/Paragraph";
import SvgHistory from "@/components/svg/SvgHistory";
import SvgRedo from "@/components/svg/SvgRedo";
import SvgReset from "@/components/svg/SvgReset";
import SvgUndo from "@/components/svg/SvgUndo";
import { useStyling } from "@/context/ContextStyling";
import { useEffect, useRef, useState } from "react";

export default function HistoryControl({
  onUndo,
  onRedo,
  onReset,
  onJumpTo,
  canUndo,
  canRedo,
  history,
  currentIndex,
}) {
  const { styling } = useStyling();
  const [isOpen, setIsOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-1 bg-base-100/50 p-1 rounded-lg border border-base-200">
      {/* Undo */}
      <div className="tooltip tooltip-bottom" data-tip="Undo">
        <Button
          size="btn-sm"
          variant="btn-ghost btn-square"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <SvgUndo />
        </Button>
      </div>

      {/* Redo */}
      <div className="tooltip tooltip-bottom" data-tip="Redo">
        <Button
          size="btn-sm"
          variant="btn-ghost btn-square"
          onClick={onRedo}
          disabled={!canRedo}
        >
          <SvgRedo />
        </Button>
      </div>

      {/* History Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div className="tooltip tooltip-bottom" data-tip="History">
          <Button
            size="btn-sm"
            variant="btn-ghost btn-square"
            onClick={() => setIsOpen(!isOpen)}
            className={isOpen ? "bg-base-200 text-primary" : ""}
          >
            <SvgHistory />
          </Button>
        </div>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-64 max-h-80 overflow-y-auto bg-base-100 rounded-lg shadow-xl border border-base-200 z-50 flex flex-col p-2">
            <div className="text-xs font-bold opacity-50 px-2 py-1 mb-1">
              History
            </div>

            {/* Initial State Item */}
            <div
              className={`
                                text-xs p-2 rounded cursor-pointer flex justify-between items-center
                                ${currentIndex === -1 ? "bg-primary text-primary-content font-bold" : "hover:bg-base-200"}
                            `}
              onClick={() => {
                onReset(); // or jumpTo(-1) if implemented logic supports it, but onReset is safer for "Initial"
                setIsOpen(false);
              }}
            >
              <span>Initial Version</span>
            </div>

            {history.length === 0 && (
              <div className="text-xs opacity-50 p-2 text-center">
                No changes yet
              </div>
            )}

            {history.map((item, idx) => (
              <div
                key={item.id}
                className={`
                                    text-xs p-2 rounded cursor-pointer flex flex-col gap-0.5
                                    ${idx === currentIndex ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-base-200 border-l-2 border-transparent"}
                                    ${idx > currentIndex ? "opacity-40" : ""} 
                                `}
                onClick={() => {
                  onJumpTo(idx);
                  setIsOpen(false);
                }}
              >
                <span
                  className={`font-medium ${idx === currentIndex ? "text-primary" : ""}`}
                >
                  {item.description}
                </span>
                <span className="text-[10px] opacity-60">
                  {item.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-4 bg-base-300 mx-1"></div>

      {/* Reset w/ Confirmation */}
      <div className="tooltip tooltip-bottom" data-tip="Reset to Initial">
        <Button
          size="btn-sm"
          variant="btn-ghost btn-square text-error"
          onClick={() => setIsResetModalOpen(true)}
          disabled={history.length === 0}
        >
          <SvgReset />
        </Button>
      </div>

      <Modal
        isModalOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Configuration"
        contentClassName="pb-2"
        actions={
          <>
            <Button
              className="btn-ghost"
              onClick={() => setIsResetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="btn-error btn-outline"
              onClick={() => {
                onReset();
                setIsResetModalOpen(false);
              }}
            >
              Reset
            </Button>
          </>
        }
      >
        <Paragraph className={`${styling.general.element} text-center`}>
          Are you sure you want to discard all changes and reset to the initial
          version? This action cannot be undone.
        </Paragraph>
      </Modal>
    </div>
  );
}

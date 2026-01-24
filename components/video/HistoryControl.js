import Button from "@/components/button/Button";
import Dropdown from "@/components/common/Dropdown";
import Modal from "@/components/common/Modal";
import Paragraph from "@/components/common/Paragraph";
import SvgHistory from "@/components/svg/SvgHistory";
import SvgRedo from "@/components/svg/SvgRedo";
import SvgReset from "@/components/svg/SvgReset";
import SvgUndo from "@/components/svg/SvgUndo";
import { useStyling } from "@/context/ContextStyling";
import { useState } from "react";

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
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  return (
    <div
      className={`flex items-center gap-1 bg-white p-0.5 border border-base-200 ${styling.components.element}`}
    >
      {/* Undo */}
      <div className="tooltip tooltip-bottom shrink-0" data-tip="Undo">
        <Button
          size="btn-sm"
          variant="btn-ghost btn-square"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8 w-8 min-h-0"
        >
          <SvgUndo />
        </Button>
      </div>

      {/* Redo */}
      <div className="tooltip tooltip-bottom shrink-0" data-tip="Redo">
        <Button
          size="btn-sm"
          variant="btn-ghost btn-square"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8 w-8 min-h-0"
        >
          <SvgRedo />
        </Button>
      </div>

      {/* History Dropdown */}
      <Dropdown
        label={<SvgHistory className="size-4 opacity-70" />}
        className="dropdown-end"
      >
        <div
          className={`w-64 max-h-80 overflow-y-auto flex flex-col p-1 ${styling.components.dropdown}`}
        >
          <div className="text-[10px] font-black uppercase tracking-widest opacity-30 px-3 py-2">
            History Log
          </div>

          <ul className="menu p-0 gap-1">
            {/* Initial State */}
            <li>
              <button
                className={`flex flex-col items-start px-3 py-2 ${styling.components.element} h-auto leading-tight w-full ${currentIndex === -1 ? "active" : ""}`}
                onClick={() => onReset()}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs">Initial Version</span>
                  <span className="text-[10px] opacity-40 font-mono">
                    ORIGIN
                  </span>
                </div>
                <span className="text-[10px] opacity-60 font-mono text-left">
                  Original video state
                </span>
              </button>
            </li>

            {history.length === 0 && (
              <div className="text-xs opacity-40 p-4 text-center italic">
                No changes recorded
              </div>
            )}

            {[...history].reverse().map((item, id) => {
              const actualIdx = history.length - 1 - id;
              const isActive = actualIdx === currentIndex;
              return (
                <li key={item.id}>
                  <button
                    className={`flex flex-col items-start px-3 py-2 ${styling.components.element} h-auto leading-tight w-full ${isActive ? "active font-bold" : ""} ${actualIdx > currentIndex ? "opacity-40" : ""}`}
                    onClick={() => onJumpTo(actualIdx)}
                  >
                    <span className="text-xs text-left w-full truncate">
                      {item.description}
                    </span>
                    <span className="text-[10px] opacity-50 font-mono text-left">
                      {item.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Dropdown>

      <div className="w-px h-4 bg-base-200 mx-1 shrink-0"></div>

      {/* Reset w/ Confirmation */}
      <div
        className="tooltip tooltip-bottom shrink-0"
        data-tip="Reset to Initial"
      >
        <Button
          size="btn-sm"
          variant="btn-ghost btn-square text-error"
          onClick={() => setIsResetModalOpen(true)}
          disabled={history.length === 0}
          className="h-8 w-8 min-h-0"
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

"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/ContextAuth";
import { defaultSetting as settings } from "@/libs/defaults";
import Button from "@/components/button/Button";
import Modal from "@/components/common/Modal";
import Paragraph from "@/components/common/Paragraph";
import useBoardComments from "@/hooks/modules/boards/useBoardComments";
import { useStyling } from "@/context/ContextStyling";
import CommentUI from "@/components/comments/CommentUI";

const BoardCommentSection = ({ postId, settings: customSettings }) => {
  const { styling } = useStyling();
  const session = useAuth();
  const { comments, isLoading, isSubmitting, addComment, deleteComment, inputErrors } = useBoardComments(postId);

  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [isNameSaved, setIsNameSaved] = useState(false);
  const [localCommentIds, setLocalCommentIds] = useState([]);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem("board_local_comments") || "[]");
    setLocalCommentIds(savedIds);
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem("board_guest_name");
    if (savedName) {
      setName(savedName);
      setIsNameSaved(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session.isLoggedIn && name) {
      localStorage.setItem("board_guest_name", name);
      setIsNameSaved(true);
    }

    await addComment({
      text,
      name: session.isLoggedIn ? undefined : name
    }, (newComment) => {
      setText("");

      if (newComment?._id && !session.isLoggedIn) {
        const updatedIds = [...localCommentIds, newComment._id];
        setLocalCommentIds(updatedIds);
        localStorage.setItem("board_local_comments", JSON.stringify(updatedIds));
      }
    });
  };

  const defaultFormConfig = settings.forms.Comment;

  const uiSettings = {
    // Merge custom settings with defaults
    // Note: customSettings comes from board.extraSettings.comments

    label: customSettings?.label || defaultFormConfig.inputsConfig.text.label,
    placeholder: customSettings?.placeholder || "What do you think?",
    buttonText: customSettings?.buttonText || defaultFormConfig.formConfig.button,
    maxLength: customSettings?.maxLength || defaultFormConfig.inputsConfig.text.maxlength,
    rows: customSettings?.rows, // BoardCommentUI handles default

    // Toggles / Texts
    showDate: customSettings?.showDate !== false, // Default true
    allowDeletion: customSettings?.allowDeletion !== false, // Default true
    ownerBadgeText: customSettings?.ownerBadgeText,
    emptyStateText: customSettings?.emptyStateText,
  };

  return (
    <>
      <CommentUI
        comments={comments}
        user={session}
        settings={uiSettings}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        inputErrors={inputErrors}
        text={text}
        name={name}
        isNameSaved={isNameSaved}
        onTextChange={setText}
        onNameChange={setName}
        onSubmit={handleSubmit}
        onDelete={setCommentToDelete}
        localCommentIds={localCommentIds}
        styling={styling}
      />

      <Modal
        isModalOpen={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        title="Delete Comment"
        actions={
          <>
            <Button
              className="btn-ghost"
              onClick={() => setCommentToDelete(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="btn-error btn-outline"
              onClick={async () => {
                await deleteComment(commentToDelete);
                setCommentToDelete(null);
              }}
              isLoading={isSubmitting}
            >
              Delete
            </Button>
          </>
        }
      >
        <Paragraph className="text-center">
          Are you sure you want to delete this comment?
        </Paragraph>
      </Modal>
    </>
  );
};

export default BoardCommentSection;

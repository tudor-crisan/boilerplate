"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/ContextAuth";
import { defaultSetting as settings } from "@/libs/defaults";
import Button from "@/components/button/Button";
import Modal from "@/components/common/Modal";
import Paragraph from "@/components/common/Paragraph";
import useBoardComments from "@/hooks/modules/boards/useBoardComments";
import { useStyling } from "@/context/ContextStyling";
import BoardCommentUI from "./BoardCommentUI";

const BoardCommentSection = ({ postId }) => {
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

  const formConfig = settings.forms.Comment;

  // Map legacy settings structure to BoardCommentUI flat structure if needed, 
  // or BoardCommentUI defaults handle it. 
  // For now, we are using defaults or hardcoded values where settings would be.
  // Ideally, 'settings' would be passed as a prop from the board data.
  // Since we don't have board settings here yet, we pass what we have from defaults.

  const uiSettings = {
    // Map existing default settings to UI component props if feasible,
    // otherwise it uses its internal defaults which match the requirements.
    // e.g. label: formConfig.inputsConfig.text.label
    label: formConfig.inputsConfig.text.label,
    placeholder: "What do you think?", // Or from default settings if it exists there
    buttonText: formConfig.formConfig.button,
    maxLength: formConfig.inputsConfig.text.maxlength,
    // Use defaults for others (showDate, allowDeletion etc.) as they were hardcoded before
  };

  return (
    <>
      <BoardCommentUI
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

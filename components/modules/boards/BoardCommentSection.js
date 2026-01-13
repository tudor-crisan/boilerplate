"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/ContextAuth";
import { defaultSetting as settings } from "@/libs/defaults";
import { formatCommentDate } from "@/libs/utils.client";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Textarea from "@/components/textarea/Textarea";
import Label from "@/components/common/Label";
import Modal from "@/components/common/Modal";
import Paragraph from "@/components/common/Paragraph";
import useBoardComments from "@/hooks/modules/boards/useBoardComments";
import SvgTrash from "@/components/svg/SvgTrash";
import IconLoading from "@/components/icon/IconLoading";
import TextSmall from "@/components/common/TextSmall";
import { useStyling } from "@/context/ContextStyling";

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

  if (isLoading) return (
    <div className="py-4">
      <Paragraph className="text-sm">
        <IconLoading /> Loading comments ...
      </Paragraph>
    </div>
  );

  return (
    <div className="mt-4 border-t border-base-200 pt-4 space-y-4">
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3 items-start">
            <Avatar
              src={comment.userId?.image}
              initials={(comment.userId?.name || comment.name || "?").substring(0, 2)}
              size="sm"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm">
                  {comment.userId?.name || comment.name || "Anonymous"}
                  {/* Owner Badge */}
                  {comment.userId?._id && comment.boardId?.userId === comment.userId._id && (
                    <span className={`${styling.components.element} badge badge-outline badge-xs h-5 pointer-events-none select-none ml-2`}>
                      Owner
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <TextSmall className="line-clamp-2 max-w-20 text-center text-base-content/50">
                    {formatCommentDate(comment.createdAt)}
                  </TextSmall>

                  {/* Delete button logic */}
                  {((session?.id && comment.userId?._id === session.id) ||
                    (session?.id && comment.boardId?.userId === session.id) ||
                    (localCommentIds.includes(comment._id))
                  ) && (
                      <Button
                        onClick={() => setCommentToDelete(comment._id)}
                        variant="btn-error btn-outline"
                        size="btn-xs px-2!"
                      >
                        <SvgTrash />
                      </Button>
                    )}
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-sm opacity-50 italic">Be the first to comment.</div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        {!session.isLoggedIn && (
          <div className="space-y-1">
            <Label>{formConfig.inputsConfig.name.label}</Label>
            {(() => {
              const { maxlength, ...nameProps } = formConfig.inputsConfig.name;
              return (
                <Input
                  {...nameProps}
                  maxLength={10}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting || isNameSaved}
                  error={inputErrors?.name}
                />
              );
            })()}
          </div>
        )}

        <div className="space-y-1">
          <Label>{formConfig.inputsConfig.text.label}</Label>
          {(() => {
            const { maxlength, ...textProps } = formConfig.inputsConfig.text;
            return (
              <Textarea
                {...textProps}
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isSubmitting}
                maxLength={maxlength}
                error={inputErrors?.text}
              />
            );
          })()}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!text || (!session.isLoggedIn && !name)}
          >
            {formConfig.formConfig.button}
          </Button>
        </div>
      </form>

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
    </div >
  );
};

export default BoardCommentSection;

"use client";

import { useState } from "react";

import { useAuth } from "@/context/ContextAuth";
import { defaultSetting as settings } from "@/libs/defaults";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Textarea from "@/components/textarea/Textarea";
import Label from "@/components/common/Label";
import Modal from "@/components/common/Modal";
import Paragraph from "@/components/common/Paragraph";
import useBoardComments from "@/hooks/modules/boards/useBoardComments";

const BoardCommentSection = ({ postId }) => {
  const session = useAuth();
  const { comments, isLoading, isSubmitting, addComment, deleteComment, inputErrors } = useBoardComments(postId);

  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addComment({
      text,
      name: session.isLoggedIn ? undefined : name
    }, () => {
      setText("");
      if (!session.isLoggedIn) setName("");
    });
  };

  const formConfig = settings.forms.Comment;

  if (isLoading) return <div className="text-sm opacity-70 p-4">Loading comments...</div>;

  return (
    <div className="mt-4 border-t border-base-200 pt-4 space-y-4">
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            <Avatar
              src={comment.userId?.image}
              initials={(comment.userId?.name || comment.name || "?").substring(0, 2)}
              size="sm"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm">
                  {comment.userId?.name || comment.name || "Anonymous"}
                </span>
                <span className="text-xs opacity-50">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.text}</p>

              {/* Delete button logic could go here if user has permission */}
              {((session?.id && comment.userId?._id === session.id) || (session?.id && comment.boardId?.userId === session.id)) && (
                <div className="flex justify-end mt-1">
                  <Button
                    onClick={() => setCommentToDelete(comment._id)}
                    className="btn-outline btn-xs text-error font-normal"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-sm opacity-50 italic">No comments yet.</div>
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
                  maxLength={maxlength}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
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

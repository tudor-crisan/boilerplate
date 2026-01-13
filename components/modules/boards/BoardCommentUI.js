import { formatCommentDate } from "@/libs/utils.client";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Textarea from "@/components/textarea/Textarea";
import Label from "@/components/common/Label";
import SvgTrash from "@/components/svg/SvgTrash";
import TextSmall from "@/components/common/TextSmall";
import IconLoading from "@/components/icon/IconLoading";
import Paragraph from "@/components/common/Paragraph";
import EmptyState from "@/components/common/EmptyState"; // Assuming this is desirable or use custom text
import SvgPost from "@/components/svg/SvgPost"; // For empty state icon

const BoardCommentUI = ({
  comments = [],
  user,
  settings,
  isLoading,
  isSubmitting,
  inputErrors,
  text,
  name,
  isNameSaved,
  onTextChange,
  onNameChange,
  onSubmit,
  onDelete, // (commentId) => void
  localCommentIds = [],
  styling // Dictionary having { components: { element: ... } }
}) => {

  // Fallback defaults if settings are partial
  const config = {
    showDate: true,
    allowDeletion: true,
    ownerBadgeText: "Owner",
    emptyStateText: "Be the first to comment.",
    label: "Your comment",
    placeholder: "What do you think?",
    maxLength: 1000,
    rows: 3,
    buttonText: "Post Comment",
    showCharacterCount: true,
    ...settings
  };

  const formConfig = {
    inputsConfig: {
      name: {
        label: "Name",
        maxlength: 20
      },
      text: {
        label: config.label,
        maxlength: config.maxLength
      }
    },
    formConfig: {
      button: config.buttonText
    }
  };


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
                    <span className={`${styling?.components?.element || ""} badge badge-outline badge-xs h-5 pointer-events-none select-none ml-2`}>
                      {config.ownerBadgeText}
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  {config.showDate && (
                    <TextSmall className="line-clamp-2 max-w-20 text-center text-base-content/50">
                      {/* If comment.createdAt is string/date, format it. If null (preview), use now */}
                      {formatCommentDate(comment.createdAt || new Date())}
                    </TextSmall>
                  )}

                  {/* Delete button logic */}
                  {config.allowDeletion && ((user?.id && comment.userId?._id === user.id) ||
                    (user?.id && comment.boardId?.userId === user.id) ||
                    (localCommentIds.includes(comment._id))
                  ) && (
                      <Button
                        onClick={() => onDelete && onDelete(comment._id)}
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
          <div className="text-sm opacity-50 italic">{config.emptyStateText}</div>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-3 pt-2">
        {(!user?.isLoggedIn && !isNameSaved) && (
          <div className="space-y-1">
            <Label>{formConfig.inputsConfig.name.label}</Label>
            <Input
              maxLength={formConfig.inputsConfig.name.maxlength}
              value={name}
              onChange={(e) => onNameChange && onNameChange(e.target.value)}
              disabled={isSubmitting || isNameSaved}
              error={inputErrors?.name}
            />
          </div>
        )}

        <div className="space-y-1">
          <Label>{formConfig.inputsConfig.text.label}</Label>
          <Textarea
            value={text}
            onChange={(e) => onTextChange && onTextChange(e.target.value)}
            disabled={isSubmitting}
            maxLength={formConfig.inputsConfig.text.maxlength}
            placeholder={config.placeholder}
            rows={config.rows}
            showCharacterCount={config.showCharacterCount}
            error={inputErrors?.text}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!text || (!user?.isLoggedIn && !name && !isNameSaved)}
          >
            {formConfig.formConfig.button}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BoardCommentUI;

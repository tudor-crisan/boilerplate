import Button from "@/modules/general/components/button/Button";
import CommentItem from "@/modules/general/components/comments/CommentItem";
import Label from "@/modules/general/components/common/Label";
import Loading from "@/modules/general/components/common/Loading";
import Tooltip from "@/modules/general/components/common/Tooltip";
import Input from "@/modules/general/components/input/Input";
import Textarea from "@/modules/general/components/textarea/Textarea";

const CommentUI = ({
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
  styling, // Dictionary having { components: { element: ... } }
}) => {
  // Fallback defaults if settings are partial
  const config = {
    showDate: true,
    allowDeletion: true,
    ownerBadgeText: "Owner",
    emptyStateText: "Be the first to comment.",
    label: "Your comment",
    placeholder: "What do you think?",
    maxLength: 700,
    rows: 3,
    buttonText: "Post Comment",
    showCharacterCount: true,
    ...settings,
  };

  const formConfig = {
    inputsConfig: {
      name: {
        label: "Name",
        maxlength: 20,
      },
      text: {
        label: config.label,
        maxlength: config.maxLength,
      },
    },
    formConfig: {
      button: config.buttonText,
    },
  };

  if (isLoading)
    return (
      <div className="py-4">
        <Loading text="Loading comments ..." className="mt-2" />
      </div>
    );

  return (
    <div className="mt-4 border-t border-base-200 pt-4 space-y-4">
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            user={user}
            config={config}
            styling={styling}
            onDelete={onDelete}
            localCommentIds={localCommentIds}
          />
        ))}

        {comments.length === 0 && (
          <div className="text-sm opacity-50 italic">
            {config.emptyStateText || "Be the first to comment."}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-3 pt-2">
        {!user?.isLoggedIn && (
          <div className="space-y-1">
            <Label>{formConfig.inputsConfig.name.label}</Label>
            <Tooltip
              text={
                isNameSaved ? "Name can't be changed once it has been set" : ""
              }
            >
              <Input
                maxLength={formConfig.inputsConfig.name.maxlength}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => onNameChange && onNameChange(e.target.value)}
                disabled={isSubmitting || isNameSaved}
                error={inputErrors?.name}
                showCharacterCount={true}
              />
            </Tooltip>
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

export default CommentUI;

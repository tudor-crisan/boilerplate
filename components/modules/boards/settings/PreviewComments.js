import Button from "@/components/button/Button";
import CommentUI from "@/components/comments/CommentUI";
import InputToggle from "@/components/input/InputToggle";
import SvgComment from "@/components/svg/SvgComment";
import SvgVote from "@/components/svg/SvgVote";
import React from "react";

export default function BoardPreviewComments({
  previewStyling,
  getVal,
  handleChange,
}) {
  return (
    <div
      className={`${previewStyling.components.card} ${previewStyling.general.box} p-6 border border-base-200 transition-all duration-300 bg-base-100 text-base-content`}
    >
      {/* Mock Post Item for Context */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">
            This is a preview post
          </h3>
          <p className="opacity-80 line-clamp-2">
            Here goes the description of what a potential user might write
          </p>
        </div>
        <div className="flex gap-2 text-sm font-medium">
          <Button className="btn-ghost btn-sm opacity-70 hover:opacity-100 gap-1.5 px-2">
            <SvgComment size="size-5" />
            <span className="text-xs font-normal">1</span>
          </Button>
          <Button
            className="btn-ghost btn-sm gap-1.5 px-2"
            startIcon={<SvgVote />}
          >
            <span className="text-sm font-medium">1</span>
          </Button>
        </div>
      </div>

      <CommentUI
        // Mock Comments only if NOT showing empty state
        comments={
          getVal("comments.showEmptyStatePreview", false)
            ? []
            : [
                {
                  _id: "preview-1",
                  userId: { name: "Admin", _id: "admin-id" },
                  boardId: { userId: "admin-id" },
                  text: "Hello, I've left this test comment",
                  createdAt: new Date(),
                },
              ]
        }
        user={{ isLoggedIn: true, id: "admin-id" }}
        settings={{
          showDate: getVal("comments.showDate", true),
          allowDeletion: getVal("comments.allowDeletion", true),
          ownerBadgeText: getVal("comments.ownerBadgeText", "Owner"),
          emptyStateText: getVal(
            "comments.emptyStateText",
            "Be the first to comment",
          ),
          label: getVal("comments.label", "Your comment"),
          placeholder: getVal("comments.placeholder", "What do you think?"),
          maxLength: getVal("comments.maxLength", 1000),
          rows: getVal("comments.rows", 3),
          buttonText: getVal("comments.buttonText", "Post Comment"),
          showCharacterCount: true,
        }}
        localCommentIds={["preview-1"]}
        styling={previewStyling}
        onTextChange={() => {}}
        onNameChange={() => {}}
        onSubmit={(e) => e.preventDefault()}
        onDelete={() => {}}
      />

      {/* Toggle for Previewing Empty State */}
      <div className="mt-4 pt-4 border-t border-base-200 flex justify-end">
        <InputToggle
          label="Preview Empty State"
          value={getVal("comments.showEmptyStatePreview", false)}
          onChange={(checked) =>
            handleChange("comments.showEmptyStatePreview", checked)
          }
        />
      </div>
    </div>
  );
}

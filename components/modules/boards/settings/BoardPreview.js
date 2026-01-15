import Link from "next/link";
import Input from "@/components/input/Input";
import InputToggle from "@/components/input/InputToggle";
import Textarea from "@/components/textarea/Textarea";
import Label from "@/components/common/Label";
import Title from "@/components/common/Title";
import Button from "@/components/button/Button";
import EmptyState from "@/components/common/EmptyState";
import SvgPost from "@/components/svg/SvgPost";
import BoardCommentUI from "../BoardCommentUI";
import SvgComment from "@/components/svg/SvgComment";
import SvgVote from "@/components/svg/SvgVote";
import { defaultSetting } from "@/libs/defaults";
import { ContextStyling } from "@/context/ContextStyling";
import { fontMap } from "@/lists/fonts";

export default function BoardPreview({
  previewStyling,
  getVal,
  handleChange
}) {
  return (
    <div className="flex-none lg:flex-1 border-t pt-6 lg:border-t-0 lg:pt-0 lg:border-l border-base-300 lg:pl-6">
      <ContextStyling.Provider value={{ styling: previewStyling }}>
        <div className="sticky top-0 space-y-8">
          <div className="text-sm uppercase font-bold text-base-content/50 mb-4">PREVIEW</div>
          <div className="space-y-6">
            {/* Wrapper for Theme Isolation */}
            <div
              data-theme={previewStyling.theme?.toLowerCase()}
              className="p-1 space-y-6"
              style={{ fontFamily: fontMap[previewStyling.font] }}
            >
              <div
                className={`${previewStyling.components.card} space-y-4 ${previewStyling.general.box} p-6 border border-base-200 shadow-sm transition-all duration-300 bg-base-100 text-base-content`}
              >
                <Title>{getVal("form.title", "Suggest a feature")}</Title>

                <div className="space-y-2">
                  <Label>{getVal("form.inputs.title.label", "Short, descriptive title")}</Label>
                  <Input
                    placeholder={getVal("form.inputs.title.placeholder", "")}
                    maxLength={getVal("form.inputs.title.maxlength", 60)}
                    showCharacterCount={getVal("form.inputs.title.showCharacterCount", true)}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label>{getVal("form.inputs.description.label", "Description")}</Label>
                  <Textarea
                    placeholder={getVal("form.inputs.description.placeholder", "")}
                    rows={getVal("form.inputs.description.rows", 4)}
                    maxLength={getVal("form.inputs.description.maxlength", 400)}
                    showCharacterCount={getVal("form.inputs.description.showCharacterCount", true)}
                    readOnly
                    className="w-full"
                  />
                </div>

                <Button variant="btn-primary">
                  {getVal("form.button", "Add Post")}
                </Button>
              </div>

              <EmptyState
                title={getVal("emptyState.title", defaultSetting.defaultExtraSettings.emptyState.title)}
                description={getVal("emptyState.description", defaultSetting.defaultExtraSettings.emptyState.description)}
                icon={<SvgPost size="size-16" />}
              />

              {/* Comment Section Preview */}
              <div className={`${previewStyling.components.card} ${previewStyling.general.box} p-6 border border-base-200 shadow-sm transition-all duration-300 bg-base-100 text-base-content`}>

                {/* Mock Post Item for Context */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">This is a preview post</h3>
                    <p className="opacity-80 line-clamp-2">Here goes the description of what a potential user might write</p>
                  </div>
                  <div className="flex gap-2 text-sm font-medium">
                    <Button
                      className="btn-ghost btn-sm opacity-70 hover:opacity-100 gap-1.5 px-2"
                    >
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

                <BoardCommentUI
                  // Mock Comments only if NOT showing empty state
                  comments={getVal("comments.showEmptyStatePreview", false) ? [] : [
                    {
                      _id: "preview-1",
                      userId: { name: "Admin", _id: "admin-id" },
                      boardId: { userId: "admin-id" },
                      text: "Hello, I've left this test comment",
                      createdAt: new Date(),
                    }
                  ]}
                  user={{ isLoggedIn: true, id: "admin-id" }}
                  settings={{
                    showDate: getVal("comments.showDate", true),
                    allowDeletion: getVal("comments.allowDeletion", true),
                    ownerBadgeText: getVal("comments.ownerBadgeText", "Owner"),
                    emptyStateText: getVal("comments.emptyStateText", "Be the first to comment"),
                    label: getVal("comments.label", "Your comment"),
                    placeholder: getVal("comments.placeholder", "What do you think?"),
                    maxLength: getVal("comments.maxLength", 1000),
                    rows: getVal("comments.rows", 3),
                    buttonText: getVal("comments.buttonText", "Post Comment"),
                    showCharacterCount: true
                  }}
                  localCommentIds={["preview-1"]}
                  styling={previewStyling}
                  onTextChange={() => { }}
                  onNameChange={() => { }}
                  onSubmit={(e) => e.preventDefault()}
                  onDelete={() => { }}
                />

                {/* Toggle for Previewing Empty State */}
                <div className="mt-4 pt-4 border-t border-base-200 flex justify-end">
                  <InputToggle
                    label="Preview Empty State"
                    value={getVal("comments.showEmptyStatePreview", false)}
                    onChange={(checked) => handleChange("comments.showEmptyStatePreview", checked)}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </ContextStyling.Provider>
    </div>
  );
}

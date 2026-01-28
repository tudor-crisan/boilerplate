import EmptyState from "@/components/common/EmptyState";
import ThemeWrapper from "@/components/common/ThemeWrapper";
import SvgPost from "@/components/svg/SvgPost";
import { ContextStyling } from "@/context/ContextStyling";
import { defaultSetting } from "@/libs/defaults";
import BoardPreviewComments from "@/modules/boards/components/settings/PreviewComments";
import BoardPreviewForm from "@/modules/boards/components/settings/PreviewForm";

export default function BoardPreview({ previewStyling, getVal, handleChange }) {
  return (
    <div className="flex-none sm:flex-1 border-t pt-6 sm:border-t-0 sm:pt-0 sm:border-l border-base-300 sm:pl-6">
      <ContextStyling.Provider value={{ styling: previewStyling }}>
        <div className="sticky top-0 space-y-8">
          <div className="text-sm uppercase font-bold text-base-content/50 mb-4">
            PREVIEW
          </div>
          <div className="space-y-6">
            {/* Wrapper for Theme Isolation */}
            <ThemeWrapper
              theme={previewStyling.theme}
              font={previewStyling.font}
              className="p-1 space-y-6"
            >
              <BoardPreviewForm
                previewStyling={previewStyling}
                getVal={getVal}
              />

              <EmptyState
                title={getVal(
                  "emptyState.title",
                  defaultSetting.defaultExtraSettings.emptyState.title,
                )}
                description={getVal(
                  "emptyState.description",
                  defaultSetting.defaultExtraSettings.emptyState.description,
                )}
                icon={<SvgPost size="size-16" />}
              />

              <BoardPreviewComments
                previewStyling={previewStyling}
                getVal={getVal}
                handleChange={handleChange}
              />
            </ThemeWrapper>
          </div>
        </div>
      </ContextStyling.Provider>
    </div>
  );
}

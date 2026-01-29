import BoardPreviewComments from "@/modules/boards/components/settings/PreviewComments";
import BoardPreviewForm from "@/modules/boards/components/settings/PreviewForm";
import EmptyState from "@/modules/general/components/common/EmptyState";
import ThemeWrapper from "@/modules/general/components/common/ThemeWrapper";
import SvgPost from "@/modules/general/components/svg/SvgPost";
import { ContextStyling } from "@/modules/general/context/ContextStyling";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";

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
                  settings.defaultExtraSettings.emptyState.title,
                )}
                description={getVal(
                  "emptyState.description",
                  settings.defaultExtraSettings.emptyState.description,
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

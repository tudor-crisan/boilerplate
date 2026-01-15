
import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";
import SvgPost from "@/components/svg/SvgPost";
import { defaultSetting } from "@/libs/defaults";
import { ContextStyling } from "@/context/ContextStyling";
import { fontMap } from "@/lists/fonts";
import BoardPreviewForm from "./BoardPreviewForm";
import BoardPreviewComments from "./BoardPreviewComments";

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
              <BoardPreviewForm
                previewStyling={previewStyling}
                getVal={getVal}
              />

              <EmptyState
                title={getVal("emptyState.title", defaultSetting.defaultExtraSettings.emptyState.title)}
                description={getVal("emptyState.description", defaultSetting.defaultExtraSettings.emptyState.description)}
                icon={<SvgPost size="size-16" />}
              />

              <BoardPreviewComments
                previewStyling={previewStyling}
                getVal={getVal}
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>
      </ContextStyling.Provider>
    </div>
  );
}

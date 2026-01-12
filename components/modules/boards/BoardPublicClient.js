"use client";

import Title from "@/components/common/Title";
import Main from "@/components/common/Main";
import Columns from "@/components/common/Columns";
import Sidebar from "@/components/common/Sidebar";
import FormCreate from "@/components/form/FormCreate";
import BoardPublicPostsList from "@/components/modules/boards/BoardPublicPostsList";
import { defaultStyling } from "@/libs/defaults";
import { ContextStyling } from "@/context/ContextStyling";
import { fontMap } from "@/lists/fonts";

export default function BoardPublicClient({ board }) {
  // Construct custom styling from board settings
  const appearance = board.extraSettings?.appearance || {};

  // Merge styling components to override roundedness etc.
  const customStyling = {
    ...defaultStyling,
    ...appearance,
    components: {
      ...defaultStyling.components,
      ...(appearance.components || {})
    },
    // We can also merge pricing if needed, though not used here
    pricing: {
      ...defaultStyling.pricing,
      ...(appearance.pricing || {})
    }
  };

  const themeName = (customStyling.theme || "light").toLowerCase();
  const fontName = customStyling.font || "Inter";
  const fontFamilyValue = fontMap[fontName] || fontMap["Inter"];

  return (
    <ContextStyling.Provider value={{ styling: customStyling }}>
      <div
        data-theme={themeName}
        style={{ fontFamily: fontFamilyValue }}
        className="min-h-screen bg-base-200 text-base-content"
      >
        <Main className={`!bg-transparent ${defaultStyling.general.box}`}>
          <div className="max-w-5xl space-y-4 mx-auto w-full">
            <Title>
              {board.name}
            </Title>
            <Columns>
              <Sidebar>
                <FormCreate
                  type="Post"
                  queryParams={{ boardId: board._id.toString() }}
                  skipRefresh={true}
                  customConfig={board.extraSettings}
                />
              </Sidebar>
              <BoardPublicPostsList
                posts={board.posts}
                boardId={board._id.toString()}
                emptyStateConfig={board.extraSettings?.emptyState}
              />
            </Columns>
          </div>
        </Main>
      </div>
    </ContextStyling.Provider>
  )
}

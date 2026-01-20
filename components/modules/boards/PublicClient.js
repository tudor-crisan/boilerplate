"use client";

import Columns from "@/components/common/Columns";
import FilterBar from "@/components/common/FilterBar";
import Main from "@/components/common/Main";
import Sidebar from "@/components/common/Sidebar";
import Title from "@/components/common/Title";
import FormCreate from "@/components/form/FormCreate";
import BoardPublicPostsList from "@/components/modules/boards/posts/PublicList";
import { ContextStyling } from "@/context/ContextStyling";
import useBoardFiltering from "@/hooks/modules/boards/useBoardFiltering";
import { defaultStyling } from "@/libs/defaults";
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

  const {
    search,
    setSearch,
    sort,
    setSort,
    sortOptions
  } = useBoardFiltering();

  return (
    <ContextStyling.Provider value={{ styling: customStyling }}>
      <div
        data-theme={themeName}
        style={{ fontFamily: fontFamilyValue }}
        className="min-h-screen bg-base-200 text-base-content"
      >
        <Main className={`bg-transparent! ${defaultStyling.general.box}`}>
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
              <div className="flex-1 w-full min-w-0">
                {board.posts?.length > 0 && (
                  <FilterBar
                    search={search}
                    setSearch={setSearch}
                    sort={sort}
                    setSort={setSort}
                    sortOptions={sortOptions}
                  />
                )}
                <BoardPublicPostsList
                  posts={board.posts}
                  boardId={board._id.toString()}
                  emptyStateConfig={board.extraSettings?.emptyState}
                  commentSettings={board.extraSettings?.comments}
                  search={search}
                  sort={sort}
                />
              </div>
            </Columns>
          </div>
        </Main>
      </div>
    </ContextStyling.Provider>
  )
}

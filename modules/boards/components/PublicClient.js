"use client";

import Columns from "@/components/common/Columns";
import FilterBar from "@/components/common/FilterBar";
import GdprPopup from "@/components/common/GdprPopup";
import Main from "@/components/common/Main";
import Sidebar from "@/components/common/Sidebar";
import Title from "@/components/common/Title";
import Toaster from "@/components/common/Toaster";
import FormCreate from "@/components/form/FormCreate";
import { ContextStyling } from "@/context/ContextStyling";
import { defaultStyling } from "@/libs/defaults";
import { fontMap } from "@/lists/fonts";
import BoardPublicPostsList from "@/modules/boards/components/posts/PublicList";
import useBoardFiltering from "@/modules/boards/hooks/useBoardFiltering";

export default function BoardPublicClient({ board }) {
  // Construct custom styling from board settings
  const appearance = board.extraSettings?.appearance || {};

  // Merge styling components to override roundedness etc.
  const customStyling = {
    ...defaultStyling,
    ...appearance,
    components: {
      ...defaultStyling.components,
      ...(appearance.components || {}),
    },
    // We can also merge pricing if needed, though not used here
    pricing: {
      ...defaultStyling.pricing,
      ...(appearance.pricing || {}),
    },
  };

  const themeName = (customStyling.theme || "light").toLowerCase();
  const fontName = customStyling.font || "Inter";
  const fontFamilyValue = fontMap[fontName] || fontMap["Inter"];

  const { search, setSearch, sort, setSort, sortOptions } = useBoardFiltering();

  return (
    <ContextStyling.Provider value={{ styling: customStyling }}>
      <div
        data-theme={themeName}
        style={{ fontFamily: fontFamilyValue }}
        className="min-h-screen bg-base-200 text-base-content"
      >
        <Main className={`bg-transparent! ${defaultStyling.general.box}`}>
          <div className="max-w-5xl space-y-8 mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Title className="mb-0! text-2xl sm:text-3xl">{board.name}</Title>
              {board.posts?.length > 0 && (
                <FilterBar
                  search={search}
                  setSearch={setSearch}
                  sort={sort}
                  setSort={setSort}
                  sortOptions={sortOptions}
                  className="mb-0! flex-1 sm:max-w-md sm:justify-end"
                />
              )}
            </div>
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
        <GdprPopup />
        <Toaster />
      </div>
    </ContextStyling.Provider>
  );
}

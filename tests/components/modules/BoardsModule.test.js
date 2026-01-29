import React from "react";
import { jest } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react";

// Mocks
jest.unstable_mockModule("@/modules/auth/context/ContextAuth", () => ({
  useAuth: () => ({ isLoggedIn: false, name: "Guest" }),
}));
jest.unstable_mockModule("@/modules/general/context/ContextStyling", () => ({
  useStyling: () => ({
    styling: {
      components: { element: "", card: "", header: "" },
      general: { box: "" },
      flex: { items_center: "flex items-center" },
    },
  }),
  ContextStyling: { Provider: ({ children }) => <div>{children}</div> },
}));
jest.unstable_mockModule("@/modules/boards/hooks/useBoardComments", () => ({
  default: () => ({
    comments: [{ _id: "c1", text: "Nice!", userId: { name: "User" } }],
    isLoading: false,
    isSubmitting: false,
    addComment: jest.fn(),
    deleteComment: jest.fn(),
  }),
}));
jest.unstable_mockModule("@/modules/boards/hooks/useBoardFiltering", () => ({
  default: () => ({
    search: "",
    setSearch: jest.fn(),
    sort: "newest",
    setSort: jest.fn(),
    sortOptions: [],
  }),
}));
jest.unstable_mockModule("@/modules/general/libs/defaults", () => ({
  defaultStyling: { general: { box: "" }, components: { element: "" } },
  defaultSetting: {
    forms: {
      Comment: {
        inputsConfig: { text: { label: "Comment" } },
        formConfig: { button: "Send" },
      },
    },
  },
}));
jest.unstable_mockModule("@/modules/general/lists/fonts", () => ({
  fontMap: { Inter: "Inter" },
}));
jest.unstable_mockModule("@/modules/general/libs/api", () => ({
  clientApi: { post: jest.fn(), delete: jest.fn() },
}));
jest.unstable_mockModule("@/modules/general/hooks/useApiRequest", () => ({
  default: () => ({ request: jest.fn(), loading: false }),
}));
jest.unstable_mockModule("@/modules/general/hooks/useLocalStorage", () => ({
  default: (key, init) => [init, jest.fn()],
}));
jest.unstable_mockModule("@/modules/general/components/common/GdprPopup", () => ({
  default: () => null,
}));
jest.unstable_mockModule("@/modules/general/components/form/FormCreate", () => ({
  default: () => null,
}));
jest.unstable_mockModule(
  "@/modules/boards/components/posts/PublicList",
  () => ({ default: () => null }),
);

// Components usually need to be imported AFTER mocks in ESM
const BoardPublicClient = (
  await import("../../../modules/boards/components/PublicClient")
).default;
const BoardCommentSection = (
  await import("../../../modules/boards/components/ui/CommentSection")
).default;
const BoardUpvoteButton = (
  await import("../../../modules/boards/components/ui/UpvoteButton")
).default;

describe("Boards Module UI", () => {
  const mockBoard = {
    _id: "b1",
    name: "Feedback Board",
    posts: [],
    extraSettings: {
      appearance: { theme: "light", font: "Inter" },
    },
  };

  describe("BoardPublicClient", () => {
    it("should render the board name", () => {
      render(<BoardPublicClient board={mockBoard} />);
      expect(screen.getByText("Feedback Board")).toBeTruthy();
    });
  });

  describe("BoardCommentSection", () => {
    it("should display comments list", () => {
      render(<BoardCommentSection postId="p1" settings={{}} />);
      expect(screen.getByText("Nice!")).toBeTruthy();
    });
  });

  describe("BoardUpvoteButton", () => {
    it("should render initial votes", () => {
      render(<BoardUpvoteButton postId="p1" initialVotesCounter={10} />);
      expect(screen.getByText("10")).toBeTruthy();
    });

    it("should optimistically update on click", async () => {
      render(<BoardUpvoteButton postId="p1" initialVotesCounter={10} />);
      const btn = screen.getByRole("button");
      await act(async () => {
        fireEvent.click(btn);
      });
      expect(screen.getByText("11")).toBeTruthy();
    });
  });
});

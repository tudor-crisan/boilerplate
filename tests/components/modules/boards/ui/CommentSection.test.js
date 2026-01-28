import { jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("components/modules/boards/ui/CommentSection", () => {
  let CommentSection;
  let useBoardCommentsMock;
  let useAuthMock;
  let useStylingMock;

  const mockComments = [
    {
      _id: "1",
      text: "Comment 1",
      user: { name: "User 1" },
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      text: "Comment 2",
      user: { name: "User 2" },
      createdAt: new Date().toISOString(),
    },
  ];

  beforeAll(async () => {
    useBoardCommentsMock = jest.fn();
    useAuthMock = jest.fn();
    useStylingMock = jest.fn();

    jest.unstable_mockModule("@/hooks/modules/boards/useBoardComments", () => ({
      default: useBoardCommentsMock,
    }));
    jest.unstable_mockModule("@/modules/auth/context/ContextAuth", () => ({
      useAuth: useAuthMock,
    }));
    jest.unstable_mockModule("@/context/ContextStyling", () => ({
      useStyling: useStylingMock,
    }));
    jest.unstable_mockModule("@/libs/defaults", () => ({
      defaultSetting: {
        forms: {
          Comment: {
            inputsConfig: { text: { label: "Comment", maxlength: 500 } },
            formConfig: { button: "Post" },
          },
        },
      },
    }));

    // Mock Child Components
    jest.unstable_mockModule("@/components/comments/CommentUI", () => ({
      default: (props) => (
        <div data-testid="comment-ui">
          <button onClick={() => props.onSubmit({ preventDefault: () => {} })}>
            Submit
          </button>
          <input
            data-testid="comment-input"
            value={props.text}
            onChange={(e) => props.onTextChange(e.target.value)}
          />
          <input
            data-testid="name-input"
            value={props.name}
            onChange={(e) => props.onNameChange(e.target.value)}
          />
          {props.comments.map((c) => (
            <div key={c._id}>
              {c.text}
              <button onClick={() => props.onDelete(c._id)}>
                Delete {c._id}
              </button>
            </div>
          ))}
          {props.isLoading && <div>Loading...</div>}
        </div>
      ),
    }));
    jest.unstable_mockModule("@/components/common/Modal", () => ({
      default: ({ isModalOpen, actions, children, onClose }) =>
        isModalOpen ? (
          <div data-testid="modal">
            {children}
            {actions}
            <button onClick={onClose}>Close Modal</button>
          </div>
        ) : null,
    }));
    jest.unstable_mockModule("@/components/button/Button", () => ({
      default: ({ onClick, children }) => (
        <button onClick={onClick}>{children}</button>
      ),
    }));
    jest.unstable_mockModule("@/components/common/Paragraph", () => ({
      default: ({ children }) => <p>{children}</p>,
    }));

    CommentSection = (
      await import("@/components/modules/boards/ui/CommentSection")
    ).default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useStylingMock.mockReturnValue({ styling: { components: {} } });
    useAuthMock.mockReturnValue({
      isLoggedIn: true,
      user: { name: "Test User" },
    });
    useBoardCommentsMock.mockReturnValue({
      comments: mockComments,
      isLoading: false,
      isSubmitting: false,
      addComment: jest.fn(),
      deleteComment: jest.fn(),
      inputErrors: {},
    });
    // Clear localStorage
    localStorage.clear();
  });

  it("should render comments", () => {
    render(<CommentSection postId="123" />);
    expect(screen.getByTestId("comment-ui")).toBeTruthy();
    expect(screen.getByText("Comment 1")).toBeTruthy();
    expect(screen.getByText("Comment 2")).toBeTruthy();
  });

  it("should handle loading state", () => {
    useBoardCommentsMock.mockReturnValue({
      comments: [],
      isLoading: true,
      isSubmitting: false,
      addComment: jest.fn(),
      deleteComment: jest.fn(),
      inputErrors: {},
    });
    render(<CommentSection postId="123" />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("should handle submission (logged in)", async () => {
    const addCommentMock = jest.fn((payload, cb) =>
      cb({ _id: "3", text: "New" }),
    );
    useBoardCommentsMock.mockReturnValue({
      comments: mockComments,
      isLoading: false,
      isSubmitting: false,
      addComment: addCommentMock,
      deleteComment: jest.fn(),
      inputErrors: {},
    });

    render(<CommentSection postId="123" />);
    const input = screen.getByTestId("comment-input");
    fireEvent.change(input, { target: { value: "New Comment" } });

    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);

    expect(addCommentMock).toHaveBeenCalledWith(
      { text: "New Comment", name: undefined },
      expect.any(Function),
    );
    // Should clear text after submit
    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });

  it("should handle submission (guest)", async () => {
    useAuthMock.mockReturnValue({ isLoggedIn: false, user: null });
    const addCommentMock = jest.fn((payload, cb) =>
      cb({ _id: "3", text: "Guest Comment" }),
    );

    useBoardCommentsMock.mockReturnValue({
      comments: [],
      isLoading: false,
      isSubmitting: false,
      addComment: addCommentMock,
      deleteComment: jest.fn(),
      inputErrors: {},
    });

    render(<CommentSection postId="123" />);

    // Set guest name
    const nameInput = screen.getByTestId("name-input");
    fireEvent.change(nameInput, { target: { value: "Guest User" } });

    const input = screen.getByTestId("comment-input");
    fireEvent.change(input, { target: { value: "Guest Comment" } });

    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);

    expect(addCommentMock).toHaveBeenCalledWith(
      { text: "Guest Comment", name: "Guest User" },
      expect.any(Function),
    );

    // Should save name to localStorage
    expect(localStorage.getItem("board_guest_name")).toBe("Guest User");

    // Should save new comment ID to localStorage
    const savedIds = JSON.parse(localStorage.getItem("board_local_comments"));
    expect(savedIds).toContain("3");
  });

  it("should open delete modal and call delete", async () => {
    const deleteCommentMock = jest.fn();
    useBoardCommentsMock.mockReturnValue({
      comments: mockComments,
      isLoading: false,
      isSubmitting: false,
      addComment: jest.fn(),
      deleteComment: deleteCommentMock,
      inputErrors: {},
    });

    render(<CommentSection postId="123" />);

    // Click delete on first comment
    fireEvent.click(screen.getByText("Delete 1"));

    expect(screen.getByTestId("modal")).toBeTruthy();

    // Confirm delete (Button component mocked to render children)
    fireEvent.click(screen.getByText("Delete")); // The Delete button inside modal actions

    await waitFor(() => {
      expect(deleteCommentMock).toHaveBeenCalledWith("1");
    });
  });

  it("should load persisted guest name", () => {
    localStorage.setItem("board_guest_name", "Persisted Name");
    useAuthMock.mockReturnValue({ isLoggedIn: false });

    render(<CommentSection postId="123" />);

    const nameInput = screen.getByTestId("name-input");
    expect(nameInput.value).toBe("Persisted Name");
  });
});

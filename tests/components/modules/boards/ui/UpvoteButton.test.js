import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

describe("components/modules/boards/ui/UpvoteButton", () => {
  let UpvoteButton;
  let useStylingMock;
  let useApiRequestMock;
  let useLocalStorageMock;

  beforeAll(async () => {
    useStylingMock = jest.fn(() => ({
      styling: { components: { element: "btn-style" } },
    }));
    useApiRequestMock = jest.fn();
    useLocalStorageMock = jest.fn();

    jest.unstable_mockModule("@/modules/general/context/ContextStyling", () => ({
      useStyling: useStylingMock,
    }));
    jest.unstable_mockModule("@/modules/general/hooks/useApiRequest", () => ({
      default: useApiRequestMock,
    }));
    jest.unstable_mockModule("@/modules/general/hooks/useLocalStorage", () => ({
      default: useLocalStorageMock,
    }));
    jest.unstable_mockModule("@/modules/general/components/button/ButtonVote", () => ({
      default: ({ onClick, count, hasVoted, isLoading }) => (
        <button onClick={onClick} disabled={isLoading} data-voted={hasVoted}>
          Votes: {count}
        </button>
      ),
    }));
    jest.unstable_mockModule("@/modules/general/libs/api", () => ({
      clientApi: { post: jest.fn(), delete: jest.fn() },
    }));

    UpvoteButton = (await import("@/modules/boards/components/ui/UpvoteButton"))
      .default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render initial votes", () => {
    useApiRequestMock.mockReturnValue({ request: jest.fn(), loading: false });
    // hasVoted = false
    const setHasVoted = jest.fn();
    useLocalStorageMock.mockReturnValue([false, setHasVoted]);

    render(<UpvoteButton postId="123" initialVotesCounter={10} />);

    expect(screen.getByText("Votes: 10")).toBeTruthy();
    expect(screen.getByRole("button").getAttribute("data-voted")).toBe("false");
  });

  it("should handle optimistic upvote", async () => {
    const requestMock = jest.fn();
    useApiRequestMock.mockReturnValue({ request: requestMock, loading: false });
    const setHasVoted = jest.fn();
    useLocalStorageMock.mockReturnValue([false, setHasVoted]);
    const onVote = jest.fn();

    render(
      <UpvoteButton postId="123" initialVotesCounter={10} onVote={onVote} />,
    );

    fireEvent.click(screen.getByRole("button"));

    // Expect immediate UI update (optimistic)
    expect(setHasVoted).toHaveBeenCalledWith(true); // Should set voted to true
    // Note: since setHasVoted is a mock and local state is controlled by it in hook,
    // the value inside component won't update unless mock implementation does so.
    // However, the component calls setHasVoted(true) and setVotesCounter(val).
    // The test framework can verification call args.

    // Check request call
    expect(requestMock).toHaveBeenCalled();
    expect(onVote).toHaveBeenCalledWith(11); // 10 + 1
  });

  it("should handle optimistic downvote (unvote)", () => {
    const requestMock = jest.fn();
    useApiRequestMock.mockReturnValue({ request: requestMock, loading: false });
    const setHasVoted = jest.fn();
    useLocalStorageMock.mockReturnValue([true, setHasVoted]); // Already voted
    const onVote = jest.fn();

    render(
      <UpvoteButton postId="123" initialVotesCounter={11} onVote={onVote} />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(setHasVoted).toHaveBeenCalledWith(false);
    expect(onVote).toHaveBeenCalledWith(10); // 11 - 1
  });

  it("should revert on error", async () => {
    const requestMock = jest.fn((apiCall, { onError }) => {
      // Simulate error callback
      onError();
    });
    useApiRequestMock.mockReturnValue({ request: requestMock, loading: false });
    const setHasVoted = jest.fn();
    // Start unvoted
    useLocalStorageMock.mockReturnValue([false, setHasVoted]);
    const onVote = jest.fn();

    render(
      <UpvoteButton postId="123" initialVotesCounter={10} onVote={onVote} />,
    );

    fireEvent.click(screen.getByRole("button"));

    // Optimistic
    expect(onVote).toHaveBeenNthCalledWith(1, 11);

    // Revert (onError called)
    expect(onVote).toHaveBeenNthCalledWith(2, 10);
    expect(setHasVoted).toHaveBeenCalledWith(false); // Reverted to false
  });

  it("should not vote if loading", () => {
    const requestMock = jest.fn();
    useApiRequestMock.mockReturnValue({ request: requestMock, loading: true });

    render(<UpvoteButton postId="123" initialVotesCounter={10} />);

    fireEvent.click(screen.getByRole("button"));
    expect(requestMock).not.toHaveBeenCalled();
  });
});

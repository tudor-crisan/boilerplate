import InfiniteScroll from "@/modules/general/components/common/InfiniteScroll";
import React from "react";
import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("components/common/InfiniteScroll", () => {
  const defaultProps = {
    onLoadMore: jest.fn(),
    hasMore: true,
    isLoading: false,
    children: <div data-testid="content">Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should trigger onLoadMore when scrolling near bottom (threshold)", () => {
    render(<InfiniteScroll {...defaultProps} threshold={50} />);
    const container = screen.getByTestId("content").parentElement;

    // Mock scroll properties
    Object.defineProperty(container, "scrollHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(container, "clientHeight", {
      configurable: true,
      value: 100,
    });
    container.scrollTop = 860;

    fireEvent.scroll(container);

    expect(defaultProps.onLoadMore).toHaveBeenCalled();
  });

  it("should trigger onLoadMore when scrolling beyond scrollThreshold (%)", () => {
    render(<InfiniteScroll {...defaultProps} scrollThreshold={0.8} />);
    const container = screen.getByTestId("content").parentElement;

    Object.defineProperty(container, "scrollHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(container, "clientHeight", {
      configurable: true,
      value: 100,
    });
    container.scrollTop = 750;

    fireEvent.scroll(container);

    expect(defaultProps.onLoadMore).toHaveBeenCalled();
  });

  it("should not trigger onLoadMore if isLoading is true", () => {
    render(<InfiniteScroll {...defaultProps} isLoading={true} />);
    const container = screen.getByTestId("content").parentElement;

    Object.defineProperty(container, "scrollHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(container, "clientHeight", {
      configurable: true,
      value: 100,
    });
    container.scrollTop = 900;

    fireEvent.scroll(container);

    expect(defaultProps.onLoadMore).not.toHaveBeenCalled();
  });

  it("should not trigger onLoadMore if hasMore is false", () => {
    render(<InfiniteScroll {...defaultProps} hasMore={false} />);
    const container = screen.getByTestId("content").parentElement;

    Object.defineProperty(container, "scrollHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(container, "clientHeight", {
      configurable: true,
      value: 100,
    });
    container.scrollTop = 900;

    fireEvent.scroll(container);

    expect(defaultProps.onLoadMore).not.toHaveBeenCalled();
  });
});

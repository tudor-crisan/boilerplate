import useUndoRedo from "@/hooks/useUndoRedo";
import { act, renderHook } from "@testing-library/react";

describe("hooks/useUndoRedo", () => {
  it("should initialize with default state", () => {
    const { result } = renderHook(() => useUndoRedo("initial"));
    expect(result.current.state).toBe("initial");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("should update state", () => {
    const { result } = renderHook(() => useUndoRedo("initial"));

    act(() => {
      result.current.set("new state", "update description");
    });

    expect(result.current.state).toBe("new state");
    expect(result.current.canUndo).toBe(true);
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].description).toBe("update description");
  });

  it("should undo state", () => {
    const { result } = renderHook(() => useUndoRedo("initial"));

    act(() => {
      result.current.set("state 1");
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toBe("initial");
    expect(result.current.canRedo).toBe(true);
  });

  it("should redo state", () => {
    const { result } = renderHook(() => useUndoRedo("initial"));

    act(() => {
      result.current.set("state 1");
    });

    act(() => {
      result.current.undo();
    });

    act(() => {
      result.current.redo();
    });

    expect(result.current.state).toBe("state 1");
    expect(result.current.canRedo).toBe(false);
  });

  it("should reset state", () => {
    const { result } = renderHook(() => useUndoRedo("initial"));

    act(() => {
      result.current.set("state 1");
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.state).toBe("initial");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.history).toHaveLength(0);
  });

  it("should jump to specific history", () => {
    const { result } = renderHook(() => useUndoRedo("initial"));

    act(() => {
      result.current.set("state 1"); // history[0]
    });
    act(() => {
      result.current.set("state 2"); // history[1]
    });
    act(() => {
      result.current.set("state 3"); // history[2]
    });

    expect(result.current.state).toBe("state 3");

    // Jump to state 1 (history[0])
    act(() => {
      result.current.jumpTo(0);
    });

    expect(result.current.state).toBe("state 1");
    expect(result.current.canUndo).toBe(true); // Can undo to initial
    expect(result.current.canRedo).toBe(true); // Can redo to state 2, 3
  });
});

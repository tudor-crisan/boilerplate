import { useCallback, useState } from "react";

export default function useUndoRedo(initialState) {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(initialState);
  const [future, setFuture] = useState([]);
  // History descriptors for the UI list
  const [history, setHistory] = useState([]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const set = useCallback(
    (newState, description = "Update") => {
      setPast((past) => [...past, present]);
      setPresent(newState);
      setFuture([]);

      // Add to history log
      setHistory((prev) => [
        ...prev.slice(0, past.length), // Truncate history if we were in the middle
        {
          id: Date.now(),
          timestamp: new Date(),
          description: description,
          state: newState, // Optional: We might not want to store full state here if heavy, but good for jump
        },
      ]);
    },
    [past.length, present],
  );

  const undo = useCallback(() => {
    if (!canUndo) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setFuture((future) => [present, ...future]);
    setPresent(previous);
    setPast(newPast);
  }, [canUndo, past, present]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast((past) => [...past, present]);
    setPresent(next);
    setFuture(newFuture);
  }, [canRedo, future, present]);

  const reset = useCallback(() => {
    setPast([]);
    setPresent(initialState);
    setFuture([]);
    setHistory([]);
  }, [initialState]);

  const jumpTo = useCallback(
    (historyIndex) => {
      // History index corresponds to the state at that point.
      // Index -1 means initial state? Or index 0 is first change?

      // If we want to jump to a specific point in the history list:
      // The history list tracks updates.
      // If the user selects the 3rd item in history, they want the state AFTER that 3rd action.

      // However, our `past` array is what determines state.
      // Let's rely on standard logic:
      // Ideally we reconstruct past/future based on the target index.

      // Simplification: We can store the *full state* in the history list for easy jumping,
      // OR we can just replay/slice the `past` array if it matches 1:1 with `history`.
      // In `set` above, I removed `slice` logic for `history` but that was wrong.
      // If we undo, `history` visually stays? Usually in undo/redo, the history list might show "current" position.

      // Let's align `history` with `past`.
      // initial state = index -1 (start).
      // past[0] = state after action 0.

      // It is often easier to rebuild stacks if we have all states.
      // Let's implement a 'jump' by finding the target state from our tracked history if we store state there.
      // If we store state in `history` items:

      if (historyIndex < 0 || historyIndex >= history.length) return;

      const targetItem = history[historyIndex];
      // Check if target is 'current'
      if (targetItem.state === present) return;

      // We need to rebuild past and future.
      // For this simple implementation, let's just create a linear timeline.
      const allStates = [initialState, ...history.map((h) => h.state)];
      // historyIndex corresponds to index+1 in allStates (0 is initial).
      const targetStateIndex = historyIndex + 1;

      const newPast = allStates.slice(0, targetStateIndex); // 0 to target-1 (exclusive of target? wait)
      // past should contain states *before* the current one.
      // if target is index 3, past should be 0,1,2.

      // Wait, `history` tracks *changes*.
      // initialState is implicit base.
      // history[0] is state after first change.

      // Re-eval:
      // If I jump to history[0], `present` becomes history[0].state.
      // `past` becomes [initialState].
      // `future` becomes [history[1].state, history[2].state, ...].

      // Correct logic:
      const targetState = history[historyIndex].state;
      // States before target
      const prevStates = [
        initialState,
        ...history.slice(0, historyIndex).map((h) => h.state),
      ];
      // States after target
      const nextStates = history.slice(historyIndex + 1).map((h) => h.state);

      setPresent(targetState);
      setPast(prevStates);
      setFuture(nextStates);
    },
    [history, initialState, present],
  );

  const currentIndex = past.length - 1;

  return {
    state: present,
    set,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    history,
    jumpTo,
    currentIndex,
  };
}

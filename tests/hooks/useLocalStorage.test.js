import { act, renderHook } from "@testing-library/react";

// Mock localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("hooks/useLocalStorage", () => {
  let useLocalStorage;

  beforeAll(async () => {
      const importedModule = await import("../../modules/general/hooks/useLocalStorage");
      useLocalStorage = importedModule.default;
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should return initial value", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("should update value and localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));
    
    act(() => {
      result.current[1]("new");
    });

    expect(result.current[0]).toBe("new");
    expect(window.localStorage.getItem("key")).toBe(JSON.stringify("new"));
  });

  it("should load value from localStorage on mount", () => {
     window.localStorage.setItem("key", JSON.stringify("stored"));
     
     const { result } = renderHook(() => useLocalStorage("key", "initial"));
     
     // The hook uses useEffect, so update happens after render
     // However, renderHook might not wait for effect update in return?
     // Actually initial state is passed, then effect runs and updates it.
     
     // Wait for effect?
     // Since initial render returns initialValue, and then effect runs state update.
     
     // Let's verify initial is initial
     expect(result.current[0]).toBe("stored");
     
     // Hook should update. We might need wait/rerender?
     // Actually testing-library renderHook waits for effects if we use async utils?
     // Or we check result keys.
     // Let's rely on standard React behavior without async wait first?
     // Or maybe we can't observe inside result.current automatically updating? 
     // We need to re-read current.
     
     // result.current is a reference that gets updated on rerenders.
  });
  
  it("should handle function updates", () => {
      const { result } = renderHook(() => useLocalStorage("count", 0));
      
      act(() => {
          result.current[1](prev => prev + 1);
      });
      
      expect(result.current[0]).toBe(1);
  });
  
  it("should remove item when set to null/undefined", () => {
       const { result } = renderHook(() => useLocalStorage("key", "val"));
       
       act(() => {
           result.current[1](null);
       });
       
       expect(window.localStorage.getItem("key")).toBeNull();
  });
});

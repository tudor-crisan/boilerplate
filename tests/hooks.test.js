import { jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

// Mock dependencies
const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
};

const mockApi = {
  setDataError: jest.fn(),
  setDataSuccess: jest.fn(),
};

// We use unstable_mockModule for ESM mocking
jest.unstable_mockModule("@/libs/toast", () => ({ toast: mockToast }));
jest.unstable_mockModule("@/libs/api", () => mockApi);

const useForm = (await import("../hooks/useForm")).default;
const useLocalStorage = (await import("../hooks/useLocalStorage")).default;
const useCopyToClipboard = (await import("../hooks/useCopyToClipboard"))
  .default;
const useApiRequest = (await import("../hooks/useApiRequest")).default;
const useUndoRedo = (await import("../hooks/useUndoRedo")).default;

describe("Shared Hooks", () => {
  describe("useForm", () => {
    it("should initialize with values and handle changes", () => {
      const { result } = renderHook(() => useForm({ name: "Tudor" }));
      expect(result.current.inputs.name).toBe("Tudor");

      act(() => {
        result.current.handleChange("name", "Cristina");
      });
      expect(result.current.inputs.name).toBe("Cristina");
    });

    it("should reset inputs", () => {
      const { result } = renderHook(() => useForm({ name: "Tudor" }));
      act(() => {
        result.current.handleChange("name", "Changed");
        result.current.resetInputs();
      });
      expect(result.current.inputs.name).toBe("Tudor");
    });
  });

  describe("useLocalStorage", () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it("should sync with localStorage", () => {
      const { result } = renderHook(() =>
        useLocalStorage("test-key", "initial"),
      );
      expect(result.current[0]).toBe("initial");

      act(() => {
        result.current[1]("new-value");
      });
      expect(result.current[0]).toBe("new-value");
      expect(window.localStorage.getItem("test-key")).toBe(
        JSON.stringify("new-value"),
      );
    });
  });

  describe("useCopyToClipboard", () => {
    beforeAll(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined),
        },
      });
    });

    it("should copy text and show success toast", async () => {
      const { result } = renderHook(() => useCopyToClipboard());
      await act(async () => {
        await result.current.copy("hello");
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
      expect(result.current.isCopied).toBe(true);
      expect(mockToast.success).toHaveBeenCalled();
    });
  });

  describe("useApiRequest", () => {
    it("should handle successful requests and show toast", async () => {
      const { result } = renderHook(() => useApiRequest());
      const mockResp = { data: { ok: true } };
      const reqFn = jest.fn().mockResolvedValue(mockResp);

      mockApi.setDataSuccess.mockImplementation((res, cb) => {
        cb("Success", res.data);
        return true;
      });

      await act(async () => {
        await result.current.request(reqFn);
      });

      expect(result.current.loading).toBe(false);
      // The message state is cleared after the toast is shown in an useEffect
      expect(mockToast.success).toHaveBeenCalledWith("Success");
    });
  });

  describe("useUndoRedo", () => {
    it("should track history and support undo/redo", async () => {
      const { result } = renderHook(() => useUndoRedo(0));
      expect(result.current.state).toBe(0);

      await act(async () => {
        result.current.set(1);
      });
      expect(result.current.state).toBe(1);
      expect(result.current.canUndo).toBe(true);

      await act(async () => {
        result.current.undo();
      });
      expect(result.current.state).toBe(0);
      expect(result.current.canRedo).toBe(true);

      await act(async () => {
        result.current.redo();
      });
      expect(result.current.state).toBe(1);
    });

    it("should jump to specific history indices", async () => {
      const { result } = renderHook(() => useUndoRedo(0));

      // We must call act separately for each set to ensure past.length updates
      await act(async () => {
        result.current.set(10, "First");
      });
      await act(async () => {
        result.current.set(20, "Second");
      });

      expect(result.current.history).toHaveLength(2);

      await act(async () => {
        result.current.jumpTo(0);
      });
      expect(result.current.state).toBe(10);
    });
  });
});

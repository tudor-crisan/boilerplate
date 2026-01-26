import { jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

// Mock toast
const mockToast = {
  error: jest.fn(),
};
jest.unstable_mockModule("@/libs/toast", () => ({ toast: mockToast }));

// Mock defaults
jest.unstable_mockModule("@/libs/defaults", () => ({
  defaultSetting: {
    forms: {
      general: {
        config: {
          maxUploadSize: { bytes: 5 * 1024 * 1024, label: "5MB" },
        },
      },
    },
  },
}));

// Import hook
const useUpload = (await import("../../hooks/useUpload")).default;

describe("hooks/useUpload", () => {
  beforeAll(() => {
    // Mock FileReader
    global.FileReader = class {
      readAsDataURL() {
        // Use immediate timeout to allow promise construction
        setTimeout(() => {
          // Wrap state updates in act
          act(() => {
            if (this.fail) {
              this.onerror && this.onerror();
            } else {
              this.result = "data:image/png;base64,mock";
              this.onloadend && this.onloadend();
            }
          });
        }, 10);
      }
    };
  });

  beforeEach(() => {
    mockToast.error.mockClear();
  });

  it("should fail if no file", async () => {
    const { result } = renderHook(() => useUpload());

    await act(async () => {
      await expect(result.current.uploadFile(null)).rejects.toMatch(
        "No file selected",
      );
    });
    expect(result.current.isLoading).toBe(false);
  });

  it("should fail if invalid type", async () => {
    const { result } = renderHook(() => useUpload());
    const file = new File([""], "test.txt", { type: "text/plain" });

    await act(async () => {
      await expect(result.current.uploadFile(file)).rejects.toMatch(
        "Invalid file type",
      );
    });
    expect(mockToast.error).toHaveBeenCalledWith(
      expect.stringContaining("image"),
    );
  });

  it("should fail if too large", async () => {
    const { result } = renderHook(() => useUpload());
    const file = {
      name: "big.png",
      type: "image/png",
      size: 10 * 1024 * 1024, // 10MB
    };

    await act(async () => {
      await expect(result.current.uploadFile(file)).rejects.toMatch(
        "File too large",
      );
    });
    expect(mockToast.error).toHaveBeenCalledWith(
      expect.stringContaining("less than"),
    );
  });

  it("should succeed with valid image", async () => {
    const { result } = renderHook(() => useUpload());
    const file = new File([""], "valid.png", { type: "image/png" });

    let promise;
    act(() => {
      promise = result.current.uploadFile(file);
    });

    // Wait for async
    await expect(promise).resolves.toBe("data:image/png;base64,mock");

    // Should be false after resolution
    expect(result.current.isLoading).toBe(false);
  });
});

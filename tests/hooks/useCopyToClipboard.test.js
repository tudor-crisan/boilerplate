import { jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

describe("hooks/useCopyToClipboard", () => {
  let useCopyToClipboard;
  let toastMock;
  let writeTextMock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Clipboard
    writeTextMock = jest.fn().mockResolvedValue(undefined);

    // Handle read-only navigator.clipboard with try-catch or defineProperty
    try {
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: writeTextMock,
        },
        writable: true,
        configurable: true,
      });
    } catch (e) {
      // Fallback if redefinition fails (e.g. strict mode or existing non-configurable prop)
      console.warn("Failed to redefine navigator.clipboard:", e);
    }
  });

  beforeAll(async () => {
    toastMock = {
      success: jest.fn(),
      error: jest.fn(),
    };
    jest.unstable_mockModule("@/modules/general/libs/toast", () => ({ toast: toastMock }));

    const importedModule = await import("../../modules/general/hooks/useCopyToClipboard");
    useCopyToClipboard = importedModule.default;
  });

  it("should copy text to clipboard", async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      result.current.copy("Hello");
    });

    expect(writeTextMock).toHaveBeenCalledWith("Hello");
    expect(result.current.isCopied).toBe(true);
    expect(toastMock.success).toHaveBeenCalled();
  });

  it("should do nothing if no text", async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      result.current.copy("");
    });

    expect(writeTextMock).not.toHaveBeenCalled();
  });

  it("should handle error", async () => {
    writeTextMock.mockRejectedValue(new Error("Fail"));
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      result.current.copy("Text");
    });

    expect(result.current.isCopied).toBe(false);
    expect(toastMock.error).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

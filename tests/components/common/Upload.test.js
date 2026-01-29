import { jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("components/common/Upload", () => {
  let useUploadMock;
  let useStylingMock;
  let uploadFileMock;

  beforeAll(async () => {
    // Mock child components
    jest.unstable_mockModule(
      "@/modules/general/components/button/Button",
      () => ({
        default: ({ children, isLoading: _isLoading, ...props }) => (
          <button {...props}>{children}</button>
        ),
      }),
    );
    jest.unstable_mockModule(
      "@/modules/general/components/common/Paragraph",
      () => ({
        default: ({ children, ...props }) => <p {...props}>{children}</p>,
      }),
    );

    // Mock utils and defaults
    jest.unstable_mockModule("@/modules/general/libs/utils.client", () => ({
      cn: (...inputs) => inputs.join(" "),
    }));
    jest.unstable_mockModule("@/modules/general/libs/defaults", () => ({
      defaultSetting: {
        forms: { general: { config: { maxUploadSize: { label: "5MB" } } } },
      },
    }));

    // Mock useStyling
    useStylingMock = jest.fn(() => ({
      styling: { flex: { col: "flex-col" } },
    }));
    jest.unstable_mockModule(
      "@/modules/general/context/ContextStyling",
      () => ({
        useStyling: useStylingMock,
      }),
    );

    // Mock useUpload
    uploadFileMock = jest.fn();
    useUploadMock = jest.fn(() => ({
      uploadFile: uploadFileMock,
      isLoading: false,
    }));
    jest.unstable_mockModule("@/modules/general/hooks/useUpload", () => ({
      default: useUploadMock,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render upload button", async () => {
    // Re-import to apply mocks
    const UploadComponent = (
      await import("@/modules/general/components/common/Upload")
    ).default;

    render(<UploadComponent />);
    expect(screen.getByText("Choose Image")).toBeTruthy();
    expect(screen.getByText(/Max/)).toBeTruthy(); // Max size text
  });

  it("should upload file on selection", async () => {
    const UploadComponent = (
      await import("@/modules/general/components/common/Upload")
    ).default;
    const onFileSelect = jest.fn();
    uploadFileMock.mockResolvedValue("https://example.com/image.jpg");

    render(<UploadComponent onFileSelect={onFileSelect} />);

    // Use container to find the hidden input if getByLabelText fails
    const input = document.querySelector('input[type="file"]');

    await waitFor(() => {
      fireEvent.change(input, {
        target: {
          files: [
            new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" }),
          ],
        },
      });
    });

    expect(uploadFileMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(onFileSelect).toHaveBeenCalledWith(
        "https://example.com/image.jpg",
      );
    });
  });

  it("should show loading state", async () => {
    // Override mock for this test
    useUploadMock.mockReturnValue({
      uploadFile: uploadFileMock,
      isLoading: true,
    });

    const UploadComponent = (
      await import("@/modules/general/components/common/Upload")
    ).default;
    render(<UploadComponent />);

    expect(screen.getByText("Processing...")).toBeTruthy();
  });
});

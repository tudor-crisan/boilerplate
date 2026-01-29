import React, { act } from "react";
import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mocks
jest.unstable_mockModule("@/modules/general/context/ContextStyling", () => ({
  useStyling: () => ({
    styling: {
      flex: { col: "flex-col", center: "center", items_center: "items-center" },
      components: { range: "mock-range" },
      general: { element: "mock-btn" },
    },
  }),
}));

const mockGetCroppedImg = jest.fn().mockResolvedValue("blob:cropped");
jest.unstable_mockModule("@/modules/general/libs/image", () => ({
  getCroppedImg: mockGetCroppedImg,
}));

// Mock React Easy Crop
jest.unstable_mockModule("react-easy-crop", () => ({
  default: ({ onCropComplete, onZoomChange }) => {
    return (
      <div data-testid="cropper">
        <button
          onClick={() => onCropComplete({}, { width: 100 })}
          data-testid="complete-crop"
        >
          Crop
        </button>
        <button onClick={() => onZoomChange(2)} data-testid="zoom-change">
          MockZoom
        </button>
      </div>
    );
  },
}));

const ImageCropper = (await import("../../../modules/general/components/common/ImageCropper"))
  .default;

describe("components/common/ImageCropper", () => {
  const defaultProps = {
    imageSrc: "btc.png",
    onCropComplete: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render cropper and controls", () => {
    render(<ImageCropper {...defaultProps} />);
    expect(screen.getByTestId("cropper")).toBeInTheDocument();
    expect(screen.getByText("Zoom")).toBeInTheDocument();
    expect(screen.getByText("Rotate")).toBeInTheDocument();
  });

  it("should handle crop and save", async () => {
    render(<ImageCropper {...defaultProps} />);

    // Simulate crop complete from lib
    fireEvent.click(screen.getByTestId("complete-crop"));

    // Click save
    await act(async () => {
      fireEvent.click(screen.getByText("Crop & Upload"));
    });

    expect(mockGetCroppedImg).toHaveBeenCalled();
    expect(defaultProps.onCropComplete).toHaveBeenCalledWith("blob:cropped");
  });

  it("should handle error during save", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetCroppedImg.mockRejectedValue(new Error("Fail"));

    render(<ImageCropper {...defaultProps} />);
    fireEvent.click(screen.getByTestId("complete-crop"));

    await act(async () => {
      fireEvent.click(screen.getByText("Crop & Upload"));
    });

    expect(defaultProps.onCropComplete).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

import {
  createImage,
  getCroppedImg,
  getRadianAngle,
  rotateSize,
} from "@/libs/image";
import { jest } from "@jest/globals";

describe("libs/image", () => {
  // Utilities
  it("should convert degrees to radians", () => {
    expect(getRadianAngle(180)).toBe(Math.PI);
    expect(getRadianAngle(0)).toBe(0);
  });

  it("should calculate rotated size", () => {
    // 90 deg rotation of 100x50
    // Width becomes 50, Height becomes 100
    const size = rotateSize(100, 50, 90);
    expect(Math.round(size.width)).toBe(50);
    expect(Math.round(size.height)).toBe(100);
  });

  // Async Image creation and Canvas
  // We need to mock Image and document.createElement('canvas')

  describe("createImage", () => {
    let originalImage;

    beforeAll(() => {
      originalImage = global.Image;
    });

    afterAll(() => {
      global.Image = originalImage;
    });

    it("should resolve with image on load", async () => {
      global.Image = class {
        constructor() {
          setTimeout(() => this.onload && this.onload(), 10);
          this.addEventListener = (evt, cb) => {
            if (evt === "load") this.onload = cb;
          };
          this.setAttribute = jest.fn();
        }
      };

      const img = await createImage("http://test.com/img.jpg");
      expect(img).toBeDefined();
    });

    it("should reject on error", async () => {
      global.Image = class {
        constructor() {
          setTimeout(() => this.onerror && this.onerror(new Error("Fail")), 10);
          this.addEventListener = (evt, cb) => {
            if (evt === "error") this.onerror = cb;
          };
          this.setAttribute = jest.fn();
        }
      };

      await expect(createImage("bad.jpg")).rejects.toThrow("Fail");
    });
  });

  // getCroppedImg mocks
  /*
        It uses:
        - createImage (already tested above, but we mock it for isolation or ensure Image class works)
        - document.createElement('canvas')
        - canvas.getContext('2d')
        - ctx.translate, rotate, scale, drawImage, getImageData, putImageData
        - canvas.toDataURL
    */
  describe("getCroppedImg", () => {
    let mockContext;

    beforeAll(() => {
      // Mock Canvas
      mockContext = {
        translate: jest.fn(),
        rotate: jest.fn(),
        scale: jest.fn(),
        drawImage: jest.fn(),
        getImageData: jest.fn(() => "data"),
        putImageData: jest.fn(),
      };

      jest.spyOn(document, "createElement").mockImplementation((tag) => {
        if (tag === "canvas") {
          return {
            getContext: () => mockContext,
            width: 0,
            height: 0,
            toDataURL: () => "data:image/jpeg;base64,mock",
          };
        }
        return {};
      });

      // Mock Image for success
      global.Image = class {
        constructor() {
          this.width = 100;
          this.height = 100;
          setTimeout(() => this.onload && this.onload(), 0);
          this.addEventListener = (evt, cb) => {
            if (evt === "load") this.onload = cb;
          };
          this.setAttribute = jest.fn();
        }
      };
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return data url for cropped image", async () => {
      const pixelCrop = { x: 0, y: 0, width: 50, height: 50 };
      const res = await getCroppedImg("test.jpg", pixelCrop);
      expect(res).toBe("data:image/jpeg;base64,mock");
      expect(mockContext.drawImage).toHaveBeenCalled();
    });

    it("should handle vertical flip", async () => {
      const pixelCrop = { x: 0, y: 0, width: 50, height: 50 };
      await getCroppedImg("test.jpg", pixelCrop, 0, {
        horizontal: false,
        vertical: true,
      });
      expect(mockContext.scale).toHaveBeenCalledWith(1, -1);
    });

    it("should handle null context", async () => {
      // force createElement to return canvas with null context
      jest.spyOn(document, "createElement").mockReturnValueOnce({
        getContext: () => null,
      });

      const res = await getCroppedImg("test.jpg", { width: 10 });
      expect(res).toBeNull();
    });
  });
});

import React from "react";
import { jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mocks
jest.unstable_mockModule("@/modules/general/components/button/Button", () => ({
  default: ({ children, onClick, className }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));
jest.unstable_mockModule(
  "@/modules/general/components/common/Paragraph",
  () => ({
    default: ({ children }) => <p>{children}</p>,
  }),
);

const GdprPopup = (
  await import("../../../modules/general/components/common/GdprPopup")
).default;

describe("components/common/GdprPopup", () => {
  let localStorageMock;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock = (() => {
      let store = {};
      return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString();
        }),
        clear: () => {
          store = {};
        },
      };
    })();
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    // Mock fetch
    global.fetch = jest.fn();
  });

  it("should not show if consent already exists in local storage", async () => {
    localStorageMock.getItem.mockReturnValue("true");
    render(<GdprPopup />);
    expect(screen.queryByText(/cookies/i)).not.toBeInTheDocument();
  });

  it("should not show in development mode", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    render(<GdprPopup />);
    expect(screen.queryByText(/cookies/i)).not.toBeInTheDocument();
    process.env.NODE_ENV = originalEnv;
  });

  it("should show if country is in EU", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ country_code: "FR" }), // France
    });

    render(<GdprPopup />);

    await waitFor(() => {
      expect(screen.getByText(/cookies/i)).toBeInTheDocument();
    });
    process.env.NODE_ENV = originalEnv;
  });

  it("should not show if country is not in EU", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ country_code: "US" }), // USA
    });

    render(<GdprPopup />);

    await waitFor(() => {
      expect(screen.queryByText(/cookies/i)).not.toBeInTheDocument();
    });
    process.env.NODE_ENV = originalEnv;
  });

  it("should save consent and hide when Accept is clicked", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ country_code: "DE" }),
    });

    render(<GdprPopup />);

    await waitFor(() => {
      const acceptBtn = screen.getByRole("button", { name: /Accept/i });
      fireEvent.click(acceptBtn);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "gdpr-consent",
      "true",
    );
    expect(screen.queryByText(/cookies/i)).not.toBeInTheDocument();
    process.env.NODE_ENV = originalEnv;
  });
});

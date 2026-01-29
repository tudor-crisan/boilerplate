import { jest } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react";

describe("Toaster", () => {
  let Toaster;
  let useStylingMock;
  let toastMock;
  let subscribeCallback;

  beforeAll(async () => {
    useStylingMock = jest.fn(() => ({
      styling: {
        components: { toaster: "toaster-class", toaster_icons: "icon-class" },
      },
    }));

    jest.unstable_mockModule(
      "@/modules/general/context/ContextStyling",
      () => ({
        useStyling: useStylingMock,
      }),
    );

    // Mock Paragraph
    jest.unstable_mockModule(
      "@/modules/general/components/common/Paragraph",
      () => ({
        default: ({ children, className }) => (
          <p className={className}>{children}</p>
        ),
      }),
    );

    // Mock SVGs
    const MockSvg = (props) => <svg {...props} />;
    jest.unstable_mockModule(
      "@/modules/general/components/svg/SvgCheck",
      () => ({
        default: MockSvg,
      }),
    );
    jest.unstable_mockModule(
      "@/modules/general/components/svg/SvgClose",
      () => ({
        default: MockSvg,
      }),
    );
    jest.unstable_mockModule(
      "@/modules/general/components/svg/SvgError",
      () => ({
        default: MockSvg,
      }),
    );

    // Mock framer-motion
    jest.unstable_mockModule("framer-motion", () => ({
      motion: {
        div: ({ children, className }) => (
          <div className={className}>{children}</div>
        ),
      },
      AnimatePresence: ({ children }) => <>{children}</>,
    }));

    // Mock Toast lib
    toastMock = {
      subscribe: jest.fn((cb) => {
        subscribeCallback = cb;
        return jest.fn(); // unsubscribe
      }),
      dismiss: jest.fn(),
    };
    jest.unstable_mockModule("@/modules/general/libs/toast", () => ({
      toast: toastMock,
    }));

    const importedModule =
      await import("../../../modules/general/components/common/Toaster");
    Toaster = importedModule.default;
  });

  beforeEach(() => {
    subscribeCallback = null;
    jest.clearAllMocks();
  });

  it("should render nothing initially", () => {
    const { container } = render(<Toaster />);
    // Only the wrapper div
    expect(container.firstChild).toBeInTheDocument();
    // check no toast items (Role? Text?)
    // Wrapper has fixed inset-0, so it's always there.
  });

  it("should update when toast subscribes", () => {
    render(<Toaster />);

    act(() => {
      if (subscribeCallback) {
        subscribeCallback([{ id: 1, message: "Toast 1", type: "success" }]);
      }
    });

    expect(screen.getByText("Toast 1")).toBeInTheDocument();
  });

  it("should render error toast style", () => {
    render(<Toaster />);

    act(() => {
      subscribeCallback([{ id: 2, message: "Error Msg", type: "error" }]);
    });

    expect(screen.getByText("Error Msg")).toBeInTheDocument();
    // Check for specific class usage implicitly via snapshot or class check if crucial?
    // Class check:
    const p = screen.getByText("Error Msg");
    expect(p).toHaveClass("text-error");
  });

  it("should call dismiss on click", () => {
    render(<Toaster />);

    act(() => {
      subscribeCallback([{ id: 1, message: "Close Me", type: "success" }]);
    });

    const closeBtn = screen.getByRole("button");
    fireEvent.click(closeBtn);

    expect(toastMock.dismiss).toHaveBeenCalledWith(1);
  });
});

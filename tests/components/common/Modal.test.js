import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Modal", () => {
  let Modal;
  let useStylingMock;

  beforeAll(async () => {
    useStylingMock = jest.fn(() => ({
      styling: {
        components: { modal: "modal-class" },
        flex: { col: "flex-col" },
      },
    }));

    jest.unstable_mockModule("@/context/ContextStyling", () => ({
      useStyling: useStylingMock,
    }));

    // Mock Button and Title components often used inside
    jest.unstable_mockModule("@/components/button/Button", () => ({
      default: (props) => <button {...props}>{props.children}</button>,
    }));
    jest.unstable_mockModule("@/components/common/Title", () => ({
      default: (props) => <h1>{props.children}</h1>,
    }));

    // Importing libs/utils.client for cn might be needed if not auto-mocked or real one used
    // Assuming real utility is fine as it has no side effects

    const importedModule = await import("../../../components/common/Modal");
    Modal = importedModule.default;
  });

  it("should render modal content when open", () => {
    render(
      <Modal isModalOpen={true} title="Test Modal" onClose={() => {}}>
        <p>Modal Content</p>
      </Modal>,
    );

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveClass("modal-open");
  });

  it("should not be visible when closed (class check)", () => {
    render(
      <Modal isModalOpen={false} title="Closed Modal" onClose={() => {}}>
        <p>Content</p>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).not.toHaveClass("modal-open");
  });

  it("should call onClose when clicking close button", () => {
    const onCloseSpy = jest.fn();
    render(
      <Modal isModalOpen={true} onClose={onCloseSpy}>
        <p>Content</p>
      </Modal>,
    );

    const closeBtn = screen.getByText("Close");
    fireEvent.click(closeBtn);
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when clicking backdrop", () => {
    const onCloseSpy = jest.fn();
    render(
      <Modal isModalOpen={true} onClose={onCloseSpy}>
        <p>Content</p>
      </Modal>,
    );

    // Backdrop is usually the parent or sibling
    // In the provided code: <div className="modal-backdrop ..." onClick={onClose}>
    // finding by class name might be easiest given no specific role/text on backdrop
    // but we can look for specific button inside backdrop if accessible text exists
    // Code has: <button className="cursor-default ...">close</button> inside backdrop div

    const backdropButton = screen.getByText("close"); // text content of button in backdrop
    fireEvent.click(backdropButton);
    expect(onCloseSpy).toHaveBeenCalled();
  });

  it("should call onClose when pressing Escape", () => {
    const onCloseSpy = jest.fn();
    render(
      <Modal isModalOpen={true} onClose={onCloseSpy}>
        <p>Content</p>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCloseSpy).toHaveBeenCalled();
  });
});

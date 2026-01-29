import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

describe("components/select/Select - Navigation Features", () => {
  let SelectComponent;
  let useStylingMock;

  beforeAll(async () => {
    useStylingMock = jest.fn(() => ({
      styling: {
        components: { select: "select" },
        general: { element: "text-base" },
        flex: {
          col: "flex-col",
          between: "flex-between",
          items_center: "items-center",
        },
      },
    }));

    jest.unstable_mockModule(
      "@/modules/general/context/ContextStyling",
      () => ({
        useStyling: useStylingMock,
      }),
    );

    jest.unstable_mockModule(
      "@/modules/general/components/svg/SvgChevronLeft",
      () => ({
        default: () => <span>←</span>,
      }),
    );

    jest.unstable_mockModule(
      "@/modules/general/components/svg/SvgChevronRight",
      () => ({
        default: () => <span>→</span>,
      }),
    );

    SelectComponent = (
      await import("@/modules/general/components/select/Select")
    ).default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("withNavigation prop", () => {
    const options = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
      { value: "3", label: "Option 3" },
    ];

    it("should render navigation controls when withNavigation is true", () => {
      render(
        <SelectComponent
          options={options}
          value="2"
          withNavigation={true}
          onChange={jest.fn()}
        />,
      );

      expect(screen.getByText("2 / 3")).toBeTruthy();
      expect(screen.getByText("←")).toBeTruthy();
      expect(screen.getByText("→")).toBeTruthy();
    });

    it("should not render navigation controls when withNavigation is false", () => {
      render(
        <SelectComponent
          options={options}
          value="2"
          withNavigation={false}
          onChange={jest.fn()}
        />,
      );

      expect(screen.queryByText("2 / 3")).toBeFalsy();
    });

    it("should call onChange when clicking next button", () => {
      const onChange = jest.fn();
      render(
        <SelectComponent
          options={options}
          value="1"
          withNavigation={true}
          onChange={onChange}
          name="test-select"
        />,
      );

      const nextButton = screen.getAllByRole("button")[1];
      fireEvent.click(nextButton);

      expect(onChange).toHaveBeenCalled();
      const callArg = onChange.mock.calls[0][0];
      expect(callArg.target.value).toBe("2");
      expect(callArg.target.name).toBe("test-select");
    });

    it("should call onChange when clicking previous button", () => {
      const onChange = jest.fn();
      render(
        <SelectComponent
          options={options}
          value="2"
          withNavigation={true}
          onChange={onChange}
          name="test-select"
        />,
      );

      const prevButton = screen.getAllByRole("button")[0];
      fireEvent.click(prevButton);

      expect(onChange).toHaveBeenCalled();
      const callArg = onChange.mock.calls[0][0];
      expect(callArg.target.value).toBe("1");
    });

    it("should disable previous button when at first option", () => {
      render(
        <SelectComponent
          options={options}
          value="1"
          withNavigation={true}
          onChange={jest.fn()}
        />,
      );

      const prevButton = screen.getAllByRole("button")[0];
      expect(prevButton.disabled).toBe(true);
    });

    it("should disable next button when at last option", () => {
      render(
        <SelectComponent
          options={options}
          value="3"
          withNavigation={true}
          onChange={jest.fn()}
        />,
      );

      const nextButton = screen.getAllByRole("button")[1];
      expect(nextButton.disabled).toBe(true);
    });

    it("should show 0 / total when no value selected", () => {
      render(
        <SelectComponent
          options={options}
          value=""
          withNavigation={true}
          onChange={jest.fn()}
        />,
      );

      expect(screen.getByText("0 / 3")).toBeTruthy();
    });

    it("should handle string options", () => {
      const stringOptions = ["Option 1", "Option 2", "Option 3"];
      render(
        <SelectComponent
          options={stringOptions}
          value="Option 2"
          withNavigation={true}
          onChange={jest.fn()}
        />,
      );

      expect(screen.getByText("2 / 3")).toBeTruthy();
    });

    it("should disable navigation buttons when select is disabled", () => {
      render(
        <SelectComponent
          options={options}
          value="2"
          withNavigation={true}
          onChange={jest.fn()}
          disabled={true}
        />,
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons[0].disabled).toBe(true);
      expect(buttons[1].disabled).toBe(true);
    });

    it("should not render navigation when options array is empty", () => {
      render(
        <SelectComponent
          options={[]}
          value=""
          withNavigation={true}
          onChange={jest.fn()}
        />,
      );

      expect(screen.queryByText("←")).toBeFalsy();
      expect(screen.queryByText("→")).toBeFalsy();
    });
  });

  describe("rounded prop", () => {
    it("should apply rounded class when rounded is true", () => {
      const { container } = render(
        <SelectComponent
          options={[{ value: "1", label: "Option 1" }]}
          rounded={true}
        />,
      );

      const select = container.querySelector("select");
      expect(select.className).toContain("rounded-md");
    });

    it("should not apply rounded class when rounded is false", () => {
      const { container } = render(
        <SelectComponent
          options={[{ value: "1", label: "Option 1" }]}
          rounded={false}
        />,
      );

      const select = container.querySelector("select");
      expect(select.className).not.toContain("rounded-md");
    });
  });
});

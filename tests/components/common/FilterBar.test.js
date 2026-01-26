import React from "react";
import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mocks
jest.unstable_mockModule("@/context/ContextStyling", () => ({
  useStyling: () => ({
    styling: { flex: { col: "flex-col" } },
  }),
}));
jest.unstable_mockModule("@/components/input/Input", () => ({
  default: ({ value, onChange, placeholder, icon, disabled }) => (
    <input
      data-testid="mock-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  ),
}));
jest.unstable_mockModule("@/components/select/Select", () => ({
  default: ({ value, onChange, options, disabled }) => (
    <select
      data-testid="mock-select"
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));
jest.unstable_mockModule("@/components/svg/SvgSearch", () => ({
  default: () => <span data-testid="search-icon" />,
}));

const FilterBar = (await import("../../../components/common/FilterBar"))
  .default;

describe("components/common/FilterBar", () => {
  const defaultProps = {
    search: "test",
    setSearch: jest.fn(),
    sort: "new",
    setSort: jest.fn(),
    sortOptions: [
      { label: "Newest", value: "new" },
      { label: "Oldest", value: "old" },
    ],
  };

  it("should render search input and sort select", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByTestId("mock-input")).toHaveValue("test");
    expect(screen.getByTestId("mock-select")).toHaveValue("new");
  });

  it("should call setSearch on input change", () => {
    render(<FilterBar {...defaultProps} />);
    fireEvent.change(screen.getByTestId("mock-input"), {
      target: { value: "new search" },
    });
    expect(defaultProps.setSearch).toHaveBeenCalledWith("new search");
  });

  it("should call setSort on select change", () => {
    render(<FilterBar {...defaultProps} />);
    fireEvent.change(screen.getByTestId("mock-select"), {
      target: { value: "old" },
    });
    expect(defaultProps.setSort).toHaveBeenCalledWith("old");
  });

  it("should not render select if no options", () => {
    render(<FilterBar {...defaultProps} sortOptions={[]} />);
    expect(screen.queryByTestId("mock-select")).not.toBeInTheDocument();
  });
});

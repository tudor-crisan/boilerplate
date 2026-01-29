import Form from "@/modules/general/components/common/Form";
import Label from "@/modules/general/components/common/Label";
import Main from "@/modules/general/components/common/Main";
import React from "react";
import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("components/common remaining structural", () => {
  it("Form should render and handle submit", () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());
    render(
      <Form onSubmit={handleSubmit} className="custom-form">
        <button type="submit">Submit</button>
      </Form>,
    );
    fireEvent.submit(screen.getByRole("button").closest("form"));
    expect(handleSubmit).toHaveBeenCalled();
    expect(screen.getByRole("button").closest("form")).toHaveClass(
      "custom-form",
    );
  });

  it("Label should render with custom classes", () => {
    render(<Label className="my-label">Username</Label>);
    const label = screen.getByText("Username");
    expect(label).toHaveClass("my-label");
    expect(label.tagName).toBe("LABEL");
  });

  it("Main should render with min-h-screen", () => {
    render(<Main className="page-main">Content</Main>);
    const main = screen.getByRole("main");
    expect(main).toHaveClass("min-h-screen");
    expect(main).toHaveClass("page-main");
  });
});

import { act, renderHook } from "@testing-library/react";

describe("hooks/useForm", () => {
  let useForm;

  beforeAll(async () => {
    const importedModule = await import("../../modules/general/hooks/useForm");
    useForm = importedModule.default;
  });

  it("should initialize with default inputs", () => {
    const { result } = renderHook(() => useForm({ name: "John" }));
    expect(result.current.inputs).toEqual({ name: "John" });
    expect(result.current.inputErrors).toEqual({});
  });

  it("should update input on change", () => {
    const { result } = renderHook(() => useForm({ name: "" }));

    act(() => {
      result.current.handleChange("name", "Doe");
    });

    expect(result.current.inputs.name).toBe("Doe");
  });

  it("should clear error on change", () => {
    const { result } = renderHook(() => useForm({ email: "" }));

    // Manually set error
    act(() => {
      result.current.setInputErrors({ email: "Invalid" });
    });
    expect(result.current.inputErrors.email).toBe("Invalid");

    // Change should clear it
    act(() => {
      result.current.handleChange("email", "@");
    });

    expect(result.current.inputErrors.email).toBeUndefined();
  });

  it("should clear error on focus", () => {
    const { result } = renderHook(() => useForm({ email: "" }));

    act(() => {
      result.current.setInputErrors({ email: "Invalid" });
    });

    act(() => {
      result.current.handleFocus("email");
    });

    expect(result.current.inputErrors.email).toBeUndefined();
  });

  it("should reset inputs", () => {
    const { result } = renderHook(() => useForm({ name: "Initial" }));

    act(() => {
      result.current.handleChange("name", "Changed");
      result.current.setInputErrors({ name: "Err" });
    });

    act(() => {
      result.current.resetInputs();
    });

    expect(result.current.inputs.name).toBe("Initial");
    expect(result.current.inputErrors).toEqual({});
  });
});

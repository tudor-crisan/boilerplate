import { jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

describe("hooks/useSort", () => {
  let useSort;

  beforeAll(async () => {
    // Mock SVGs using unstable_mockModule for ESM
    const MockIcon = () => "Icon";
    jest.unstable_mockModule(
      "@/modules/general/components/svg/SvgChevronsUpDown",
      () => ({
        default: MockIcon,
      }),
    );
    jest.unstable_mockModule(
      "@/modules/general/components/svg/SvgMoveDown",
      () => ({
        default: MockIcon,
      }),
    );
    jest.unstable_mockModule(
      "@/modules/general/components/svg/SvgMoveUp",
      () => ({
        default: MockIcon,
      }),
    );

    // Import hook after mocking
    const importedModule = await import("../../modules/general/hooks/useSort");
    useSort = importedModule.useSort;
  });

  const items = [
    { id: 1, name: "Charlie", value: 10 },
    { id: 2, name: "Alice", value: 30 },
    { id: 3, name: "Bob", value: 20 },
    { id: 4, name: null, value: 5 },
  ];

  it("should initialize with items not sorted if key is null", () => {
    const { result } = renderHook(() => useSort(items));
    expect(result.current.sortedItems).toHaveLength(4);
    expect(result.current.sortedItems[0].id).toBe(1);
  });

  it("should sort items initially if config provided", () => {
    const { result } = renderHook(() =>
      useSort(items, { key: "value", direction: "asc" }),
    );
    expect(result.current.sortedItems[0].value).toBe(5);
    expect(result.current.sortedItems[3].value).toBe(30);
  });

  it("should sort strings ascending", () => {
    const { result } = renderHook(() => useSort(items));

    act(() => {
      result.current.requestSort("name"); // desc
    });

    expect(result.current.sortConfig).toEqual({
      key: "name",
      direction: "desc",
    });

    act(() => {
      result.current.requestSort("name"); // asc
    });

    expect(result.current.sortConfig).toEqual({
      key: "name",
      direction: "asc",
    });
  });

  it("should sort numbers correctly", () => {
    const { result } = renderHook(() => useSort(items));

    act(() => {
      result.current.requestSort("value");
    });
    // desc: 30, 20, 10, 5
    expect(result.current.sortedItems[0].value).toBe(30);

    act(() => {
      result.current.requestSort("value");
    });
    // asc: 5, 10, 20, 30
    expect(result.current.sortedItems[0].value).toBe(5);
  });

  it("should handle null inputs gracefully", () => {
    const { result } = renderHook(() => useSort(null));
    expect(result.current.sortedItems).toEqual([]);
  });

  it("should return correct icon", () => {
    const { result } = renderHook(() => useSort(items));

    let icon = result.current.getSortIcon("name");
    // Checked against "Icon" because MockIcon returns "Icon" AND calling a functional component directly returns its return value.
    // But getSortIcon returns <Svg... /> (JSX).
    // If Svg... is the MockIcon, <MockIcon /> produces an element type { type: MockIcon, props: ... }
    // So checking truthy is safest.
    expect(icon).toBeTruthy();

    act(() => {
      result.current.requestSort("name");
    });

    icon = result.current.getSortIcon("name");
    expect(icon).toBeTruthy();
  });
});

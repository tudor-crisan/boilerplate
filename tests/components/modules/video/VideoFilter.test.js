import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

describe("components/modules/video/VideoFilter", () => {
  let VideoFilter;

  beforeAll(async () => {
    jest.unstable_mockModule("@/components/common/FilterBar", () => ({
      default: ({
        search,
        setSearch,
        sort,
        setSort,
        placeholder,
        disabled,
      }) => (
        <div>
          <input
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={disabled}
            data-testid="search-input"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            disabled={disabled}
            data-testid="sort-select"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="name_asc">Name (A-Z)</option>
          </select>
        </div>
      ),
    }));

    jest.unstable_mockModule("@/components/select/Select", () => ({
      default: ({ options, value, onChange, disabled }) => (
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          data-testid="format-select"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ),
    }));

    VideoFilter = (await import("@/components/modules/video/VideoFilter"))
      .default;
  });

  it("should render all filter components", () => {
    render(
      <VideoFilter
        searchQuery=""
        setSearchQuery={jest.fn()}
        sortBy="date_desc"
        setSortBy={jest.fn()}
        filterFormat="all"
        setFilterFormat={jest.fn()}
        isLoading={false}
      />,
    );

    expect(screen.getByTestId("search-input")).toBeTruthy();
    expect(screen.getByTestId("sort-select")).toBeTruthy();
    expect(screen.getByTestId("format-select")).toBeTruthy();
  });

  it("should call setSearchQuery when search input changes", () => {
    const setSearchQuery = jest.fn();
    render(
      <VideoFilter
        searchQuery=""
        setSearchQuery={setSearchQuery}
        sortBy="date_desc"
        setSortBy={jest.fn()}
        filterFormat="all"
        setFilterFormat={jest.fn()}
        isLoading={false}
      />,
    );

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(setSearchQuery).toHaveBeenCalledWith("test");
  });

  it("should call setSortBy when sort changes", () => {
    const setSortBy = jest.fn();
    render(
      <VideoFilter
        searchQuery=""
        setSearchQuery={jest.fn()}
        sortBy="date_desc"
        setSortBy={setSortBy}
        filterFormat="all"
        setFilterFormat={jest.fn()}
        isLoading={false}
      />,
    );

    const sortSelect = screen.getByTestId("sort-select");
    fireEvent.change(sortSelect, { target: { value: "name_asc" } });
    expect(setSortBy).toHaveBeenCalledWith("name_asc");
  });

  it("should call setFilterFormat when format changes", () => {
    const setFilterFormat = jest.fn();
    render(
      <VideoFilter
        searchQuery=""
        setSearchQuery={jest.fn()}
        sortBy="date_desc"
        setSortBy={jest.fn()}
        filterFormat="all"
        setFilterFormat={setFilterFormat}
        isLoading={false}
      />,
    );

    const formatSelect = screen.getByTestId("format-select");
    fireEvent.change(formatSelect, { target: { value: "16:9" } });
    expect(setFilterFormat).toHaveBeenCalled();
  });

  it("should disable inputs when isLoading is true", () => {
    render(
      <VideoFilter
        searchQuery=""
        setSearchQuery={jest.fn()}
        sortBy="date_desc"
        setSortBy={jest.fn()}
        filterFormat="all"
        setFilterFormat={jest.fn()}
        isLoading={true}
      />,
    );

    expect(screen.getByTestId("search-input").disabled).toBe(true);
    expect(screen.getByTestId("sort-select").disabled).toBe(true);
    expect(screen.getByTestId("format-select").disabled).toBe(true);
  });
});

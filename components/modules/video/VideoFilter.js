import FilterBar from "@/components/common/FilterBar";
import Select from "@/components/select/Select";

export default function VideoFilter({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  filterFormat,
  setFilterFormat,
  isLoading,
}) {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <FilterBar
          search={searchQuery}
          setSearch={setSearchQuery}
          sort={sortBy}
          setSort={setSortBy}
          sortOptions={[
            { label: "Newest First", value: "date_desc" },
            { label: "Oldest First", value: "date_asc" },
            { label: "Name (A-Z)", value: "name_asc" },
          ]}
          placeholder="Search videos..."
          className="mb-0!"
          disabled={isLoading}
        />
      </div>
      <div className="w-full md:w-48 shrink-0">
        <Select
          options={[
            { label: "All Formats", value: "all" },
            { label: "Landscape (16:9)", value: "16:9" },
            { label: "Portrait (9:16)", value: "9:16" },
          ]}
          value={filterFormat}
          onChange={(e) => setFilterFormat(e.target.value)}
          className="w-full"
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

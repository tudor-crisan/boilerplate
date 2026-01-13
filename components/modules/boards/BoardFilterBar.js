"use client";
import SvgSearch from "@/components/svg/SvgSearch";
import Select from "@/components/select/Select";
import Input from "@/components/input/Input";

export default function BoardFilterBar({
  search,
  setSearch,
  sort,
  setSort,
  sortOptions = [],
  placeholder = "Search...",
  className = ""
}) {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 mb-6 z-0 relative ${className}`}>
      {/* Search Input */}
      <div className="flex-1 min-w-0">
        <Input
          type="text"
          className="w-full"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch && setSearch(e.target.value)}
          icon={<SvgSearch />}
          allowClear={true}
        />
      </div>

      {/* Sort Dropdown */}
      {sortOptions.length > 0 && setSort && (
        <div className="w-full sm:w-32 sm:min-w-32 shrink-0">
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={sortOptions}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}

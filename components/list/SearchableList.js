"use client";

import { useState } from "react";
import ListDisplay from "@/components/list/ListDisplay";
import FilterBar from "@/components/common/FilterBar";

const SearchableList = ({
  items = [],
  type = "Item",
  filterKey = "name", // The key to search by in the item object
  placeholder,
  children // Optional filter overrides or additional content
}) => {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) => {
    const value = item[filterKey];
    return value && value.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <ListDisplay
        type={type}
        list={filteredItems}
      >
        {items.length > 0 && (
          <FilterBar
            search={search}
            setSearch={setSearch}
            placeholder={placeholder || `Search ${type.toLowerCase()}s...`}
          >
            {children}
          </FilterBar>
        )}
      </ListDisplay>
    </div>
  );
};

export default SearchableList;

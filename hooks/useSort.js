"use client";
import SvgChevronsUpDown from "@/components/svg/SvgChevronsUpDown";
import SvgMoveDown from "@/components/svg/SvgMoveDown";
import SvgMoveUp from "@/components/svg/SvgMoveUp";
import React, { useMemo,useState } from 'react';

/**
 * A reusable hook for sorting arrays of objects.
 * @param {Array} items - The array of objects to sort.
 * @param {Object} initialConfig - The initial sort configuration { key, direction }.
 * @returns {Object} - { sortedItems, requestSort, getSortIcon, sortConfig }
 */
export function useSort(items, initialConfig = { key: null, direction: 'desc' }) {
  const [sortConfig, setSortConfig] = useState(initialConfig);

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <SvgChevronsUpDown className="w-4 h-4 opacity-50" />;
    return sortConfig.direction === 'asc' ? <SvgMoveUp className="w-4 h-4" /> : <SvgMoveDown className="w-4 h-4" />;
  };

  const sortedItems = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];

    let sortableItems = [...items];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle null/undefined
        if (aValue === null || aValue === undefined) aValue = 0;
        if (bValue === null || bValue === undefined) bValue = 0;

        // String comparison
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = (bValue || '').toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  return { sortedItems, requestSort, getSortIcon, sortConfig };
}

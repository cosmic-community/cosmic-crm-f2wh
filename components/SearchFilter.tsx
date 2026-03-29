'use client';

import { useState, useMemo } from 'react';

interface SearchFilterProps<T> {
  items: T[];
  searchKey: (item: T) => string;
  filterOptions?: {
    label: string;
    key: string;
    options: string[];
    getValue: (item: T) => string;
  }[];
  children: (filteredItems: T[]) => React.ReactNode;
}

export default function SearchFilter<T>({
  items,
  searchKey,
  filterOptions = [],
  children,
}: SearchFilterProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = !searchTerm || searchKey(item).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilters = filterOptions.every((filterOpt) => {
        const filterValue = filters[filterOpt.key];
        if (!filterValue || filterValue === 'All') return true;
        return filterOpt.getValue(item) === filterValue;
      });
      return matchesSearch && matchesFilters;
    });
  }, [items, searchTerm, filters, searchKey, filterOptions]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filters */}
        {filterOptions.map((filterOpt) => (
          <select
            key={filterOpt.key}
            value={filters[filterOpt.key] || 'All'}
            onChange={(e) => setFilters((prev) => ({ ...prev, [filterOpt.key]: e.target.value }))}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
          >
            <option value="All">{filterOpt.label}: All</option>
            {filterOpt.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ))}
      </div>

      {/* Filtered count */}
      {(searchTerm || Object.values(filters).some((v) => v && v !== 'All')) && (
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredItems.length} of {items.length} results
        </p>
      )}

      {children(filteredItems)}
    </div>
  );
}
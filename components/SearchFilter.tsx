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
      const matchesSearch = searchTerm === '' || searchKey(item).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilters = filterOptions.every((filter) => {
        const filterValue = filters[filter.key];
        if (!filterValue) return true;
        return filter.getValue(item) === filterValue;
      });
      return matchesSearch && matchesFilters;
    });
  }, [items, searchTerm, filters, searchKey, filterOptions]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filter) => (
            <select
              key={filter.key}
              value={filters[filter.key] || ''}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))
              }
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white min-w-0"
            >
              <option value="">All {filter.label}</option>
              {filter.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>
      <div>
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No results found</p>
          </div>
        ) : (
          children(filteredItems)
        )}
      </div>
    </div>
  );
}

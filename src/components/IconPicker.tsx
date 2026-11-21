'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { HOTEL_ICON_MAP, HOTEL_ICON_NAMES, getHotelIcon } from '@/lib/hotel-icons';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  className?: string;
}

export default function IconPicker({ value, onChange, className = '' }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredIcons = useMemo(() => {
    if (!search.trim()) {
      return HOTEL_ICON_NAMES.slice(0, 100);
    }
    const lowerSearch = search.toLowerCase();
    return HOTEL_ICON_NAMES
      .filter((name) => name.toLowerCase().includes(lowerSearch))
      .slice(0, 100);
  }, [search]);

  const SelectedIcon = getHotelIcon(value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-mint focus:outline-none focus:ring-1 focus:ring-mint"
      >
        <div className="flex items-center gap-2">
          <SelectedIcon size={16} className="text-mint" />
          <span className="truncate">{value || 'Pilih Ikon'}</span>
        </div>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-[250px] rounded-md bg-white p-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Cari ikon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-200 py-1.5 pl-8 pr-3 text-sm focus:border-mint focus:outline-none focus:ring-1 focus:ring-mint"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {filteredIcons.length === 0 ? (
              <div className="text-center text-xs text-gray-500 py-2">Ikon tidak ditemukan</div>
            ) : (
              filteredIcons.map((iconName) => {
                const IconComponent = HOTEL_ICON_MAP[iconName];
                if (!IconComponent) return null;
                
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm text-left hover:bg-mint/10 transition-colors ${
                      value === iconName ? 'bg-mint/5 text-mint font-medium' : 'text-gray-700'
                    }`}
                  >
                    <IconComponent size={16} className={value === iconName ? 'text-mint' : 'text-gray-400'} />
                    <span className="truncate">{iconName}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

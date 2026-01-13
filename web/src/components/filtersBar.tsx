"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdFilterList } from "react-icons/md";
import Image from "next/image";
import { GoPlus } from "react-icons/go";
import { FilterBarProps } from "@/types/components";

export default function FilterBar({
  onSearch,
  // onReset,
  filters,
  filtersData,
  onFilterChange,
  pageSize = 10,
  onPageSizeChange,
  currentRange = "",
  onPrev,
  onNext,
  showAiToolsControls = false,
  onGridClick,
  onAddClick,
  canGoPrev = true,
  canGoNext = true,
  currentGridLayout,
  onSortChange,
  sortDirection,
}: FilterBarProps & {
  onFilterChange: (
    key: keyof NonNullable<FilterBarProps["filters"]>,
    values: any[]
  ) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (item: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHoveredItem(null), 150);
  };

  const handleCheckboxToggle = (
    key: keyof NonNullable<FilterBarProps["filters"]>,
    option: string
  ) => {
    if (!filters) return;
    const current = (filters[key] || []) as (string | number)[];
    if (current.includes(option)) {
      onFilterChange(
        key,
        current.filter((x) => x !== option)
      );
    } else {
      onFilterChange(key, [...current, option]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main Filter Bar */}
      <div className="flex flex-wrap justify-between items-center py-2 px-1 gap-4">
        <div className="flex items-center gap-2 h-[32px]">
          {/* Dropdown trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="h-[32px] w-[32px] cursor-pointer rounded-[10px] border flex items-center justify-center border-gray-200 hover:bg-gray-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <MdFilterList size={16} className="text-[#4D4D4D]" />
            </button>

            {isDropdownOpen && (
              <div className="absolute w-[180px] top-full left-0 mt-1 border border-gray-200 rounded-lg shadow-lg z-50 bg-[#333333]">
                <div className="py-1 w-[175px]">
                  <p className="font-medium font-[inter] text-[12px] text-[#808080] px-4 py-2">
                    Filters:
                  </p>
                  <div className="h-[1px] bg-[#4D4D4D] mx-1" />

                  {/* Dynamic Filters */}
                  {filters &&
                    Object.keys(filters).map((key) => (
                      <div
                        key={key}
                        className="relative group"
                        onMouseEnter={() => handleMouseEnter(key)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div
                          className="flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors"
                          style={{
                            backgroundColor:
                              hoveredItem === key ? "#4D4D4D" : "transparent",
                            borderRadius: "4px",
                          }}
                        >
                          <span
                            className="text-[15px] font-medium font-[inter] whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{ color: "#CCCCCC" }}
                            title={key.charAt(0).toUpperCase() + key.slice(1)}
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                          <svg
                            className="w-4 h-4 text-[#808080]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>

                        {hoveredItem === key && (
                          <div
                            className="absolute left-full top-0 ml-1 border border-gray-600 rounded-lg shadow-lg bg-[#333333] w-[220px] min-w-[200px]"
                            onMouseEnter={() => handleMouseEnter(key)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <div className="py-1">
                              <p className="text-[12px] font-medium font-[inter] text-[#808080] px-4 py-2.5 border-b border-[#4D4D4D]">
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                              </p>
                              {/* Replace with your options source */}
                              {!filtersData ||
                              filtersData[key as keyof typeof filtersData]
                                ?.length === 0 ? (
                                <p className="px-4 py-2 text-[#808080] text-sm">
                                  No options loaded
                                </p>
                              ) : (
                                filtersData[
                                  key as keyof typeof filtersData
                                ]?.map((option: string, index: number) => (
                                  <label
                                    key={index}
                                    className="flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-[#CCCCCC] cursor-pointer hover:bg-[#4D4D4D] rounded transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={
                                        (
                                          (filters?.[
                                            key as keyof typeof filters
                                          ] || []) as (string | number)[]
                                        ).includes(option) || false
                                      }
                                      onChange={() =>
                                        handleCheckboxToggle(
                                          key as keyof NonNullable<
                                            FilterBarProps["filters"]
                                          >,
                                          option
                                        )
                                      }
                                    />
                                    <span
                                      className={`relative inline-flex items-center justify-center h-[16px] w-[16px] rounded-[3px] border transition-colors ${
                                        (
                                          (filters?.[
                                            key as keyof typeof filters
                                          ] || []) as (string | number)[]
                                        ).includes(option)
                                          ? "bg-[#333333] border-white"
                                          : "bg-[#333333] border-[#808080]"
                                      }`}
                                    >
                                      {(
                                        (filters?.[
                                          key as keyof typeof filters
                                        ] || []) as (string | number)[]
                                      ).includes(option) && (
                                        <svg
                                          viewBox="0 0 24 24"
                                          className="absolute h-[13px] w-[13px] text-white"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                      )}
                                    </span>
                                    <span className="flex-1 text-left break-words">
                                      {option}
                                    </span>
                                  </label>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={() =>
              onSortChange?.(sortDirection === "asc" ? "desc" : "asc")
            }
            className="p-[6px] w-[32px] cursor-pointer flex items-center justify-center h-full rounded-[10px] border border-gray-200 hover:bg-gray-200"
          >
            <Image src="/arrow-upDown.svg" alt="Reset" width={13} height={10} />
          </button>

          {/* Search */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-[200px] pl-4 pr-12 py-1.5 rounded-[10px] border border-[#F2F2F2] focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm placeholder-[#CCCCCC]"
            />
            <Image
              src="/grey-search-icon.svg"
              alt="Search Icon"
              width={20}
              height={20}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>

          {showAiToolsControls && (
            <button
              onClick={onAddClick}
              className="hidden max-md:block w-[72px] h-[34px] bg-[#007AFF] text-white rounded-[10px] font-[Nunito] font-semibold text-[15px]"
            >
              Add +
            </button>
          )}
        </div>

        {/* Pagination & Grid Controls */}
        <div className="hidden md:flex items-center gap-3 text-xs text-gray-600">
          <span className="text-[#CCCCCC]">ITEMS PER PAGE</span>
          <input
            type="number"
            min="1"
            max="1000"
            value={pageSize}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value > 0 && value <= 1000) onPageSizeChange?.(value);
            }}
            className="px-2 py-1 text-sm bg-white border border-gray-200 rounded-md w-16 text-center"
          />
          <span className="whitespace-nowrap text-[#CCCCCC]">
            {currentRange}
          </span>
          <button
            onClick={onPrev}
            disabled={!canGoPrev}
            className="p-1 rounded disabled:opacity-50 hover:bg-gray-100"
          >
            <FiChevronLeft className="text-[#808080] w-[15px] h-[15px]" />
          </button>
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="p-1 rounded disabled:opacity-50 hover:bg-gray-100"
          >
            <FiChevronRight className="text-[#808080] w-[15px] h-[15px]" />
          </button>
          {showAiToolsControls && (
            <>
              <div className="w-px h-4 bg-[#E5E5E5]" />
              <button
                onClick={() => onGridClick?.(2)}
                className={`flex items-center justify-center h-[32px] w-[32px] rounded-[10px] border hover:bg-gray-100 ${
                  currentGridLayout === 2 ? "bg-[#E5E5E5]" : "bg-white"
                }`}
              >
                <Image
                  src="/grid-col-icon.svg"
                  alt="Grid Column"
                  width={17}
                  height={17}
                />
              </button>
              <button
                onClick={() => onGridClick?.(1)}
                className={`flex items-center justify-center h-[32px] w-[32px] rounded-[10px] border hover:bg-gray-100 ${
                  currentGridLayout === 1 ? "bg-[#E5E5E5]" : "bg-white"
                }`}
              >
                <Image
                  src="/grid-row-icon.svg"
                  alt="Grid Row"
                  width={17}
                  height={17}
                />
              </button>
              <div className="w-px h-4 bg-[#E5E5E5]" />
              <button
                onClick={onAddClick}
                className="flex items-center justify-center bg-black text-white h-[32px] w-[32px] rounded-[10px]"
              >
                <GoPlus className="w-[20px] h-[20px]" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

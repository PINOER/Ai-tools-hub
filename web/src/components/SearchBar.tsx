"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  placeholder?: string;
  debounceDelay?: number;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search tools, news, articles...",
  debounceDelay = 500,
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Update URL when debounced search term changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm.trim()) {
      params.set("search", debouncedSearchTerm.trim());
    } else {
      params.delete("search");
    }
    router.push(`/?${params.toString()}`);
  }, [debouncedSearchTerm, router, searchParams]);

  // Sync with URL changes (e.g., browser back/forward)
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearchTerm(urlSearch);
  }, [searchParams]);

  return (
    <div className={`relative w-full max-w-xs ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full pl-4 pr-12 py-1.5 rounded-[10px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm placeholder-[#CCCCCC]"
      />
      <Image
        src="/grey-search-icon.svg"
        alt="Search Icon"
        width={20}
        height={20}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}

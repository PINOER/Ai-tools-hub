'use client';

import React, { useRef, useState } from 'react';
import { TagFilterProps } from '@/types/components';
import { useTagsCategoryQuery } from '@/hooks/queries/useTagsCategoryQuery';
import { Category } from '@/types/api';

export default function TagFilter({ activeTag, onChange, color, section}: TagFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const isClickBlockedRef = useRef(false); // block click during drag

  // Fetch categories based on section using React Query hook
  const { data: categoriesData, isLoading: categoriesLoading } = useTagsCategoryQuery(1, 30, section);

  // Create dynamic tag options from categories
  const dynamicTagOptions = [
    { id: 0, label: 'All', Content: () => <></> },
    ...(categoriesData?.categories?.map((category: Category) => ({
      id: category.id,
      label: category.name,
      Content: () => <></>
    })) || [])
  ];

  // Use dynamic tags if available, otherwise fall back to default tags
  const displayTags = categoriesData?.categories && categoriesData.categories.length > 0 ? dynamicTagOptions : [
    { id: 0, label: 'All', Content: () => <></> }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    isClickBlockedRef.current = false;
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX;
    if (Math.abs(walk) > 5) isClickBlockedRef.current = true;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleClick = (tag: number) => {
    if (!isClickBlockedRef.current) onChange(tag);
  };

  const renderContent = () => {
    const Component = displayTags.find((item: { id: number; label: string; Content: () => React.ReactElement }) => item.id === activeTag)?.Content;
    if (Component) {
      return (<Component />);
    } else {
      return null;
    }
  };

  // Skeleton loading component
  const TagSkeleton = () => ( 
    <div className="flex flex-nowrap gap-2 py-1 px-1 overflow-x-auto scrollbar-hide">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="h-8 bg-gray-200 rounded-lg animate-pulse "
          style={{ width: `80px` }}
        />
      ))}
    </div>
  );

  return (
    <>
      {categoriesLoading ? (
        <TagSkeleton />
      ) : (
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex flex-nowrap gap-2 py-1 px-1 overflow-x-auto scrollbar-hide cursor-grab select-none"
        >
          {displayTags.map((tag: { id: number; label: string; Content: () => React.ReactElement }, id: number) => {
            const isActive = activeTag === tag.id;
            return (
              <button
                key={id}
                onClick={() => handleClick(tag.id)}
                style={isActive ? { backgroundColor: color, color: '#ffffff', cursor: 'pointer' } : {}}
                className={`whitespace-nowrap text-[15px] font-[Nunito] rounded-lg border border-[#ececec] px-[10px] py-[4px] text-sm transition-colors font-semibold ${
                  isActive ? '' : 'bg-white cursor-pointer text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      )}
      <div>{renderContent()}</div>
    </>
  );
}

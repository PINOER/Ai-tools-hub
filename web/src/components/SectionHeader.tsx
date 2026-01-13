import React from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { SectionHeaderProps } from '@/types/components';

export default function SectionHeader({
  icon = '✨',
  title,
  className,
  color = '#000',
  viewAllHref = '/',
  viewAllLabel = 'View all',
}: SectionHeaderProps) {
  return (
    <div className={twMerge("flex items-center gap-2 mb-6 sm:mb-2", className)}>
      <span className="text-xl" style={{ color }}>{icon}</span>
      <h2 className="text-[25px] font-bold whitespace-nowrap font-[Nunito]" style={{ color }}>
        {title}
      </h2>
      <div className="flex flex-col justify-center flex-1 ml-2 gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-3/4"
            style={{
              height: '1px',
              background: `linear-gradient(to right, ${color}cc, ${color}66, transparent)`,
              transform: 'scaleY(0.9)',
              transformOrigin: 'top', // Ensure scaling happens from the top
            }}
          />
        ))}
      </div>
      {viewAllLabel && (
        <Link
          href={viewAllHref}
          className="inline-flex justify-center items-center text-[12px] font-medium text-[#4D4D4D] hover:text-black w-[77px] h-[23px] border border-gray-200 rounded-md transition"
        >
          {viewAllLabel}
          <svg
            className="w-[13px] h-[16px] ml-1"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}

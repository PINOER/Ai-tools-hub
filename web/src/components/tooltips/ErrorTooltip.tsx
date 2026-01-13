import React from 'react';
import { ErrorTooltipProps } from '@/types';

export default function ErrorTooltip({ message, show }: ErrorTooltipProps) {
  if (!show || !message) return null;
  return (
    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg z-10 whitespace-nowrap">
      {message}
    </div>
  );
} 
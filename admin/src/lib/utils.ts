import { ReviewStatus } from "@/types/reviews";
import { ToolsStatus } from "@/types/tools";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ensureFloatWithOneDecimal(num: number) {
  // Convert the number to a string
  let numStr = num.toString();

  // Check if the string already contains a decimal point
  if (!numStr.includes('.')) {
    // If not, append ".0" to ensure at least one decimal place
    numStr += '.0';
  }
  return numStr;
}

export const getReviewStatusColor = (status: ReviewStatus | string) => {
  switch (status) {
    case ReviewStatus.Approved: return 'bg-[#34C75933] text-[#34C759]';
    case ReviewStatus.PendingReport: return 'bg-[#FFCC00] text-black';
    case ReviewStatus.Reported: return 'bg-[#808080] text-white';
    case 'Pending': return 'bg-[#FFCC00] text-black'; // Fallback for legacy data
    default: return 'bg-[#808080] text-white';
  }
};

export const getToolsStatusColor = (status: ToolsStatus) => {
  switch (status) {
    case ToolsStatus.Approved: return 'bg-[#34C75933] text-[#34C759]';
    case ToolsStatus.Pending: return 'bg-[#FFCC00] text-black';
    case ToolsStatus.Submitted: return 'bg-[#FFCC00] text-black';
    case ToolsStatus.Rejected: return 'bg-[#808080] text-white';
    default: return 'bg-[#808080] text-white';
  }
};

export const getUserStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-[#34C75933] text-[#34C759]';
    case 'Pending': return 'bg-[#FFCC00] text-black';
    case 'Banned': return 'bg-[#FFCC00] text-black';
    case 'Suspended': return 'bg-[#808080] text-white';
    default: return 'bg-[#808080] text-white';
  }
};

// Date helper methods
export interface DateConversionResult {
  publishedDate?: string;
  publishedTime?: string;
  isValid: boolean;
  error?: string;
}

export const convertDateAndTimeToISO = (
  publishedDate?: string,
  publishedTime?: string
): DateConversionResult => {
  try {
    if (publishedDate && publishedTime) {
      const dateTimeString = `${publishedDate}T${publishedTime}:00.000Z`;
      const dateTime = new Date(dateTimeString);
      
      if (isNaN(dateTime.getTime())) {
        console.warn('Invalid date/time values:', { publishedDate, publishedTime });
        return {
          isValid: false,
          error: 'Invalid date/time combination'
        };
      }
      
      return {
        publishedDate: dateTime.toISOString(),
        publishedTime: dateTime.toISOString(),
        isValid: true
      };
    } else if (publishedDate) {
      const dateTimeString = `${publishedDate}T00:00:00.000Z`;
      const dateTime = new Date(dateTimeString);
      
      if (isNaN(dateTime.getTime())) {
        console.warn('Invalid date value:', publishedDate);
        return {
          isValid: false,
          error: 'Invalid date value'
        };
      }
      
      return {
        publishedDate: dateTime.toISOString(),
        publishedTime: dateTime.toISOString(),
        isValid: true
      };
    }
    
    return {
      isValid: true
    };
  } catch (error) {
    console.warn('Error converting date/time:', error);
    return {
      isValid: false,
      error: 'Date conversion error'
    };
  }
};

export const getCurrentDateTimeISO = (): { publishedDate: string; publishedTime: string } => {
  const now = new Date();
  return {
    publishedDate: now.toISOString(),
    publishedTime: now.toISOString()
  };
};
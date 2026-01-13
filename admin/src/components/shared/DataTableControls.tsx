import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import clsx from 'clsx';

interface DataTableControlsProps {
  // Filter props
  FilterComponent?: React.ReactNode;
  onFilterOpen: () => void;
  
  // Search props
  searchValue: string;
  onSearchChange: (value: string) => void;
  
  // Pagination props
  currentPage: number;
  currentLimit: number;
  totalRecords: number;
  onLimitChange: (limit: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  
  // Import/Export props
  onImport?: () => void;
  onExport?: () => void;
  
  // Create button props
  onCreate?: () => void;
  createButtonText?: string;
  PlusIcon?: React.ComponentType<any>;
  PlusIconImg?: string;
  isData?: boolean;
  
  // Control visibility props
  showPagination?: boolean;
  showSearch?: boolean;
}

export const DataTableControls: React.FC<DataTableControlsProps> = ({
  FilterComponent,
  onFilterOpen,
  searchValue,
  onSearchChange,
  currentPage,
  currentLimit,
  totalRecords,
  onLimitChange,
  onPreviousPage,
  onNextPage,
  onImport,
  onExport,
  onCreate,
  createButtonText = "Create",
  PlusIcon,
  PlusIconImg,
  isData = false,
  showPagination = true,
  showSearch = true
}) => {
  const [localLimit, setLocalLimit] = useState(currentLimit.toString());

  // Update local limit when prop changes
  useEffect(() => {
    setLocalLimit(currentLimit.toString());
  }, [currentLimit]);

  // Debounced API call when user stops typing
  const debouncedLimitChange = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: number) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (!isNaN(value) && value > 0 && value <= 100) {
            onLimitChange(value);
          }
        }, 500); // Wait 500ms after user stops typing
      };
    })(),
    [onLimitChange]
  );

  const showingRecordsFrom = () => {
    return totalRecords === 0 ? 0 : (currentPage - 1) * currentLimit + 1;
  };

  const showingRecordsTo = () => {
    return Math.min(currentPage * currentLimit, totalRecords);
  };



  return (
    <div className='flex items-center justify-between py-4 mt-2'>
      <div className='flex items-center gap-3'>
        {/* Filter Icon */}
        {FilterComponent && (
          <div
            className='cursor-pointer bg-white border-1 border-[#F2F2F2] px-2 py-3 rounded-[10px]'
            onClick={() => {
              onFilterOpen()
            }}
          >
            <img src='/icons/filter.svg' alt='Filter' width={24} height={24} />
          </div>
        )}
        
        {/* Search Bar */}
        {showSearch && (
          <div className='relative w-[200px]'>
            <Input
              placeholder='Search'
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              className='max-w-sm border-[#F2F2F2] px-4 bg-white placeholder:text-[#CCCCCC] text-[15px] placeholder:text-[15px] shadow-none'
            />
            <img
              src='/icons/search.svg'
              alt='Search'
              width={20}
              height={20}
              className='cursor-pointer absolute right-3 bottom-2'
              onClick={() => {}}
            />
          </div>
        )}
      </div>
      
      <div className='flex items-center gap-4'>
        {showPagination && (
          <div className='flex items-center gap-6 pr-4'>
            <p className='text-[14px] text-[#CCCCCC] rounded-[10px] flex items-center gap-2'>
              ROWS PER PAGE
              <Input
                type="text"
                value={localLimit}
                onChange={(e) => {
                  // Allow free typing - update local state only
                  setLocalLimit(e.target.value);
                  // Call debounced API when user stops typing
                  const value = parseInt(e.target.value);
                  debouncedLimitChange(value);
                }}
                onBlur={(e) => {
                  // Reset to current limit if invalid on blur
                  const value = parseInt(e.target.value);
                  if (isNaN(value) || value <= 0 || value > 100) {
                    setLocalLimit(currentLimit.toString());
                  }
                }}
                className="ml-2 w-[80px] border-[#F2F2F2] bg-white text-center"
              />
            </p>
            <p className='text-[14px] text-[#CCCCCC]'>
              {showingRecordsFrom()} - {showingRecordsTo()} OF {totalRecords}
            </p>
            
            {/* Page Left Icon */}
            <img
              src='/icons/previous.svg'
              alt='Previous'
              width={9}
              height={15}
              className={clsx(
                'text-sm text-muted-foreground cursor-pointer',
                currentPage <= 1 ? 'opacity-50' : 'cursor-pointer'
              )}
              onClick={onPreviousPage}
            />
            
            {/* Page Right Icon */}
            <img
              src='/icons/next.svg'
              alt='Next'
              width={9}
              height={15}
              className={clsx(
                'text-sm text-muted-foreground cursor-pointer',
                currentPage >= Math.ceil(totalRecords / currentLimit) ? 'opacity-50' : 'cursor-pointer'
              )}
              onClick={onNextPage}
            />
          </div>
        )}
        
        {/* Download & Upload Icons */}
        <div className='flex items-center gap-[8px] border-l-2 border-r-2 px-4 border-[#E5E5E5]'>
          <div className='border-1 border-[#F2F2F2] bg-white py-2.5 px-[10.5px] rounded-[10px] cursor-pointer'>
            <img
              src='/icons/upload.svg'
              alt='Upload'
              width={15}
              height={15}
              onClick={onImport}
            />
          </div>
          <div className='border-1 border-[#F2F2F2] bg-white p-2 rounded-[10px] cursor-pointer'>
            <img
              src='/icons/download.svg'
              alt='Download'
              width={20}
              height={20}
              onClick={onExport}
            />
          </div>
        </div>

        {/* Create Button */}
        {onCreate && (
          !isData ? (
            <button onClick={onCreate} className='cursor-pointer'>
              <img src={PlusIconImg} alt="Add" style={{ height: 32, width: 32 }} />
            </button>
          ) : (
            <button onClick={onCreate} className='cursor-pointer flex justify-center items-center gap-2 bg-black text-white pt-1 pb-1.25 pl-3 pr-2 rounded-[10px]'>
              {createButtonText} {PlusIcon && <PlusIcon size={20} />}
            </button>
          )
        )}
      </div>
    </div>
  );
};

DataTableControls.displayName = 'DataTableControls'; 
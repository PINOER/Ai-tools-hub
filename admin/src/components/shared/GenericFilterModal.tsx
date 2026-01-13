import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export interface FilterOption<T> {
  key: keyof T;
  label: string;
  type: 'select' | 'checkbox' | 'text' | 'multiselect';
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
}

interface GenericFilterModalProps<T> {
  filters: FilterOption<T>[];
  values: Partial<T>;
  onChange: (newValues: Partial<T>) => void;
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onClear?: () => void;
  title?: string;
}

export function GenericFilterModal<T>({ 
  filters, 
  values, 
  onChange, 
  open, 
  onOpenChange, 
  onClear,
  title = "Filter"
}: GenericFilterModalProps<T>) {
  const [localValues, setLocalValues] = useState<Partial<T>>(values);
  
  // Update local values when modal opens or values change
  useEffect(() => {
    setLocalValues(values);
  }, [values, open]);
  
  const handleFilterChange = (key: keyof T, value: any) => {
    console.log('Filter changed locally:', key, value);
    setLocalValues(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    console.log('Clearing all filters');
    if (onClear) {
      onClear();
    } else {
      // Default clear behavior - set all filters to undefined
      const clearedFilters: Partial<T> = {};
      filters.forEach(filter => {
        clearedFilters[filter.key] = undefined as any;
      });
      onChange(clearedFilters);
    }
    // Close modal after clearing filters
    onOpenChange(false);
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', localValues);
    onChange(localValues);
    onOpenChange(false);
  };

  const renderFilter = (filter: FilterOption<T>) => {
    const currentValue = localValues[filter.key];

    switch (filter.type) {
      case 'select':
        return (
          <div key={String(filter.key)} className="space-y-2">
            <Label>{filter.label}</Label>
            <Select
              value={currentValue?.toString() || 'all'}
              onValueChange={(value) => 
                handleFilterChange(filter.key, value === 'all' ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={filter.placeholder || `All ${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options?.map((option, index) => (
                  <SelectItem key={`${String(filter.key)}-${option.value}-${index}`} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={String(filter.key)} className="flex items-center space-x-2">
            <Checkbox
              id={`filter-${String(filter.key)}`}
              checked={Boolean(currentValue)}
              onCheckedChange={(checked) => handleFilterChange(filter.key, checked)}
            />
            <Label htmlFor={`filter-${String(filter.key)}`} className="text-sm cursor-pointer">
              {filter.label}
            </Label>
          </div>
        );

      case 'multiselect': {
        const currentArray = Array.isArray(currentValue) ? currentValue : [] as any[];
        return (
          <div key={String(filter.key)} className="space-y-3">
            <Label>{filter.label}</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {filter.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${String(filter.key)}-${option.value}`}
                    checked={currentArray.includes(option.value as any)}
                    onCheckedChange={(checked) => {
                      const newArray = checked
                        ? [...currentArray, option.value]
                        : currentArray.filter((item) => item !== option.value);
                      handleFilterChange(filter.key, newArray);
                    }}
                  />
                  <Label htmlFor={`${String(filter.key)}-${option.value}`} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {filters.map((filter, index) => (
            <React.Fragment key={String(filter.key)}>
              {renderFilter(filter)}
              {index < filters.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClearFilters}>
            Clear All
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
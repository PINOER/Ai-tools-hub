import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export const FetchingTab = () => {
  const [fetchFrequency, setFetchFrequency] = useState('every-2-hours');
  const [articlesPerFetch, setArticlesPerFetch] = useState('10');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fetch-frequency" className='text-sm font-normal text-[#4D4D4D]'>FETCH FREQUENCY</Label>
          <Select value={fetchFrequency} onValueChange={setFetchFrequency}>
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="every-hour">Every hour</SelectItem>
              <SelectItem value="every-2-hours">Every 2 hours</SelectItem>
              <SelectItem value="every-4-hours">Every 4 hours</SelectItem>
              <SelectItem value="every-6-hours">Every 6 hours</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="articles-per-fetch" className='text-sm font-normal text-[#4D4D4D]'>ARTICLES PER FEED PER FETCH</Label>
          <Select value={articlesPerFetch} onValueChange={setArticlesPerFetch}>
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="25">25</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

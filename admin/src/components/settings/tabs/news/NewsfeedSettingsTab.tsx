import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export const NewsfeedSettingsTab = () => {
  const feedSources = [
    { id: 'ID2001', name: 'TechCrunch AI', link: 'https://techcrunch.com/category/ai...', category: 'Research', lastFetch: '1h ago', status: 'Active' },
    { id: 'ID2001', name: 'OpenAI Blog', link: 'https://openai.com/blog/rss.xml', category: 'Products', lastFetch: '1h ago', status: 'Active' },
    { id: 'ID2001', name: 'VentureBeat AI', link: 'https://venturebeat.com/ai/feed/', category: 'Products', lastFetch: '14d ago', status: 'Disabled' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-normal mb-4 text-gray-300">Feed sources</h3>
        
        <div className="mb-4 flex justify-between items-center">
          <Input 
            placeholder="Search" 
            className="max-w-sm"
          />
          <div className="flex justify-between items-center gap-4">
            <div className="text-sm text-[#CCCCCC]">
              ROWS PER PAGE: 50 | 1-50 OF 12
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">‹</Button>
              <Button variant="outline" size="sm">›</Button>
              <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-[#CCCCCC]'>ID</TableHead>
                <TableHead className='text-[#CCCCCC]'>NAME</TableHead>
                <TableHead className='text-[#CCCCCC]'>LINK</TableHead>
                <TableHead className='text-[#CCCCCC]'>CATEGORY</TableHead>
                <TableHead className='text-[#CCCCCC]'>LAST FETCH</TableHead>
                <TableHead className='text-[#CCCCCC]'>STATUS</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedSources.map((source, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{source.id}</TableCell>
                  <TableCell className="font-medium">{source.name}</TableCell>
                  <TableCell className="text-sm text-gray-500 max-w-[200px] truncate">{source.link}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      {source.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{source.lastFetch}</TableCell>
                  <TableCell>
                    <Badge variant={source.status === 'Active' ? 'secondary' : 'outline'} 
                           className={source.status === 'Active' ? 'text-green-600 bg-green-50' : ''}>
                      {source.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">⋯</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
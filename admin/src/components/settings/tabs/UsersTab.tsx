import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export const UsersTab = () => {
  const users = [
    { name: 'John Smith', email: 'john@aitools.com', role: 'Owner' },
    { name: 'Sarah Chen', email: 'sarah@aitools.com', role: 'Admin' },
    { name: 'Mike Torres', email: 'mike@aitools.com', role: 'Editor' },
    { name: 'Emma Wilson', email: 'emma@aitools.com', role: 'Moderator' }
  ];

  const rolePermissions = {
    owner: [
      'Full system access',
      'Manage all admins',
      'Cannot be removed by others'
    ],
    admin: [
      'Manage content (tools, news, articles)',
      'Manage users',
      'View analytics',
      'Cannot manage other admins'
    ],
    editor: [
      'Create and edit content',
      'Moderate submissions',
      'Cannot manage users'
    ]
  };

  const handleSave = () => {
    console.log('Saving users data');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
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

          <Table>
            <TableHeader>
              <TableRow className='border-none'>
                <TableHead className='text-gray-300 font-normal'>NAME</TableHead>
                <TableHead className='text-gray-300 font-normal'>EMAIL</TableHead>
                <TableHead className='text-gray-300 font-normal'>ROLE</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody >
              {users.map((user, index) => (
                <TableRow key={index} className='border-none'>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">⋯</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        <div className="mt-8 p-4 bg-[#F7F7F7] rounded-lg">
          <h3 className="text-md font-normal text-gray-300 mb-4">ROLE PERMISSIONS</h3>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-3 bg-[#F2F2F2] py-3 px-4 border border-gray-200 rounded-lg">
              <h4 className="font-normal text-gray-300">OWNER</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {rolePermissions.owner.map((permission, index) => (
                  <li key={index}>• {permission}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3 bg-[#F2F2F2] py-3 px-4 border border-gray-200 rounded-lg">
              <h4 className="font-normal text-gray-300">ADMIN</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {rolePermissions.admin.map((permission, index) => (
                  <li key={index}>• {permission}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3 bg-[#F2F2F2] py-3 px-4 border border-gray-200 rounded-lg">
              <h4 className="font-normal text-gray-300">EDITOR</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {rolePermissions.editor.map((permission, index) => (
                  <li key={index}>• {permission}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-6">
        <Button variant="outline" className='flex-1 hover:cursor-pointer'>Back</Button>
        <Button onClick={handleSave} className="flex-1 bg-black text-white hover:bg-gray-800 hover:cursor-pointer">
          Save
        </Button>
      </div>
    </div>
  );
};
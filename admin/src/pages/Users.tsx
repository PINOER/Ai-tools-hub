import { UsersProvider } from '@/contexts/UsersContext';
import { UserMetrics } from '@/components/users/UserMetrics';
import { UsersTab } from '@/components/users/UsersTab';
import { UsersDialogs } from '@/components/users/UsersDialogs';
import { useUsersQuery } from '@/hooks/queries/useUsersQuery';

function UsersContent() {
  const {
    data: usersData,
    isLoading: loading,
    error: usersError,
  } = useUsersQuery({});

  if (loading) {
    return <div>Loading...</div>;
  }

  if (usersError) {
    return <div>Error loading users</div>;
  }

  const users = usersData?.users || [];
  const activeUsers = users.filter((user: any) => user.status === 'Active').length;
  // Calculate new registrations based on activity history
  const newRegistrations = users.filter((user: any) => 
    user.activityHistory?.some((activity: any) => 
      activity.action.includes('registered') && 
      activity.timestamp.includes('d ago')
    )
  ).length;

  return (
    <div className='p-8'>
      <UserMetrics
        totalUsers={users.length}
        activeUsers={activeUsers}
        newRegistrations={newRegistrations}
        retentionRate={68}
      />

      <UsersTab />
      <UsersDialogs />
    </div>
  );
}

export default function Users() {
  return (
    <UsersProvider>
      <UsersContent />
    </UsersProvider>
  );
}

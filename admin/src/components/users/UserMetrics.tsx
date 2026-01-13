import MetricCard from '../MetricCard';

interface UserMetricsProps {
  totalUsers: number;
  activeUsers: number;
  newRegistrations: number;
  retentionRate: number;
}

export const UserMetrics = ({ totalUsers, activeUsers, newRegistrations, retentionRate }: UserMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[20px]">
      <MetricCard
        title="TOTAL USERS"
        value={totalUsers.toString()}
        change="+3.98%"
      />
      <MetricCard
        title="ACTIVE USERS"
        value={activeUsers.toString()}
        change="+3.98%"
      />
      <MetricCard
        title={
          <>
            NEW REGISTRATIONS <span className="text-[12px]">(this week)</span>
          </>
        }
        value={newRegistrations.toString()}
        change="+3.98%"
      />
      <MetricCard
        title="USER RETENTION RATE"
        value={retentionRate.toString()+"%"}
        change="+3.98%"
      />
    </div>
  );
};
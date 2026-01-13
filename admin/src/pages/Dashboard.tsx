import MetricCard from "@/components/MetricCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { PendingApprovals } from "@/components/dashboard/PendingApprovals";
import { useDashboardStats } from "@/hooks/activity/useDashboardStats";
import { TableSkeleton } from "@/components/TableSkeleton";

const Dashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();

  const metrics = statsData
    ? [
        {
          title: "ACTIVE USERS",
          value: statsData.activeUsers.count.toLocaleString(),
          change: `+${statsData.activeUsers.growth}%`,
          icon: "/icons/active-users-icon.svg",
          isPositive: true,
        },
        {
          title: "TOTAL TOOLS",
          value: statsData.totalTools.count.toLocaleString(),
          change: `+${statsData.totalTools.growth}%`,
          icon: "/icons/total-tools-icon.svg",
          isPositive: true,
        },
        {
          title: "TOTAL CATEGORIES",
          value: statsData.totalCategories.count.toLocaleString(),
          change: `+${statsData.totalCategories.growth}%`,
          icon: "/icons/total-categories-icon.svg",
          isPositive: true,
        },
        {
          title: "REVIEWS",
          value: statsData.reviews.count.toLocaleString(),
          change: `+${statsData.reviews.growth}%`,
          icon: "/icons/reviews-icon.svg",
          isPositive: true,
        },
      ]
    : [];

  return (
    <div className="font-inter px-10 pt-12 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-[15px] border border-[#0000000D] p-6"
                style={{ boxShadow: "0px 2px 8px 0px #0000000A" }}
              >
                <TableSkeleton />
              </div>
            ))}
          </>
        ) : (
          metrics.map((metric, index) => <MetricCard key={index} {...metric} />)
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <PendingApprovals />
      </div>
    </div>
  );
};

export default Dashboard;

import { useActivityFeed } from "@/hooks/activity/useActivityFeed";
import { TableSkeleton } from "@/components/TableSkeleton";

export const RecentActivity = () => {
  const { data, isLoading, error } = useActivityFeed(1, 10);

  if (isLoading) {
    return (
      <div
        className="bg-white rounded-[15px] border border-[#0000000D] p-6"
        style={{ boxShadow: "0px 2px 8px 0px #0000000A" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
          <img
            src="/icons/recent-activity-icon.svg"
            alt="Recent Activity"
            style={{ height: 24, width: 24 }}
          />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-white rounded-[15px] border border-[#0000000D] p-6"
        style={{ boxShadow: "0px 2px 8px 0px #0000000A" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
          <img
            src="/icons/recent-activity-icon.svg"
            alt="Recent Activity"
            style={{ height: 24, width: 24 }}
          />
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Failed to load recent activity</p>
        </div>
      </div>
    );
  }

  const activities = data?.activities || [];

  return (
    <div
      className="bg-white rounded-[15px] border border-[#0000000D] p-6"
      style={{ boxShadow: "0px 2px 8px 0px #0000000A" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <img
          src="/icons/recent-activity-icon.svg"
          alt="Recent Activity"
          style={{ height: 24, width: 24 }}
        />
      </div>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {activity.icon ? (
                  <span className="text-lg">{activity.icon}</span>
                ) : (
                  <img
                    src="/icons/Tool Arrow Icon.svg"
                    alt="Activity"
                    style={{ height: 20, width: 20 }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {activity.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-gray-500">{activity.timeAgo}</p>
                  {activity.user && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">
                        by {activity.user.first_name} {activity.user.last_name}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <img
                src="/icons/Tool Arrow Icon.svg"
                alt="Arrow"
                style={{ height: 16, width: 16 }}
                className="flex-shrink-0"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

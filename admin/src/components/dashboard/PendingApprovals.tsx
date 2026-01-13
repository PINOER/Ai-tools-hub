import { Badge } from "@/components/ui/badge";
import { usePendingApprovals } from "@/hooks/activity/usePendingApprovals";
import { TableSkeleton } from "@/components/TableSkeleton";

export const PendingApprovals = () => {
  const { data, isLoading, error } = usePendingApprovals();

  if (isLoading) {
    return (
      <div
        className="bg-white rounded-[15px] border border-[#0000000D] p-6"
        style={{ boxShadow: "0px 2px 8px 0px #0000000A" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Pending Approvals
          </h3>
          <img
            src="/icons/pending-approvals-icon.svg"
            alt="Pending Approvals"
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
            Pending Approvals
          </h3>
          <img
            src="/icons/pending-approvals-icon.svg"
            alt="Pending Approvals"
            style={{ height: 24, width: 24 }}
          />
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Failed to load pending approvals</p>
        </div>
      </div>
    );
  }

  const approvals = data || {
    toolSubmissions: 0,
    toolClaims: 0,
    articleReviews: 0,
    glossaryReviews: 0,
    promptReviews: 0,
    learningReviews: 0,
    reviewModerations: 0,
    total: 0,
  };

  const approvalItems = [
    {
      title: "New Tool Submissions",
      description: `${approvals.toolSubmissions} tools waiting for review`,
      count: approvals.toolSubmissions,
    },
    {
      title: "User Claims",
      description: `${approvals.toolClaims} ownership claims pending`,
      count: approvals.toolClaims,
    },
    {
      title: "Content Reviews",
      description: `${approvals.articleReviews} articles need approval`,
      count: approvals.articleReviews,
    },
    {
      title: "Glossary Reviews",
      description: `${approvals.glossaryReviews} glossary entries pending`,
      count: approvals.glossaryReviews,
    },
    {
      title: "Prompt Reviews",
      description: `${approvals.promptReviews} prompts need approval`,
      count: approvals.promptReviews,
    },
    {
      title: "Learning Reviews",
      description: `${approvals.learningReviews} learning materials pending`,
      count: approvals.learningReviews,
    },
    {
      title: "Review Moderations",
      description: `${approvals.reviewModerations} reviews need moderation`,
      count: approvals.reviewModerations,
    },
  ].filter((item) => item.count > 0);

  return (
    <div
      className="bg-white rounded-[15px] border border-[#0000000D] p-6"
      style={{ boxShadow: "0px 2px 8px 0px #0000000A" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Pending Approvals
        </h3>
        <img
          src="/icons/pending-approvals-icon.svg"
          alt="Pending Approvals"
          style={{ height: 24, width: 24 }}
        />
      </div>
      <div className="space-y-4">
        {approvalItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No pending approvals</p>
          </div>
        ) : (
          approvalItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.title}
                </p>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
              <Badge variant="secondary">{item.count}</Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

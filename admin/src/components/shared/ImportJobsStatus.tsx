import { useImportJobs } from '@/hooks/queries/useImportExportQuery';
import { useEffect } from 'react';

interface ImportJobsStatusProps {
  entityType?: string;
}

export const ImportJobsStatus = ({ entityType }: ImportJobsStatusProps) => {
  const { data: jobsData, isLoading, error, refetch } = useImportJobs({
    page: 1,
    limit: 10,
    entityType: entityType as any,
    jobType: 'Import'
  }, {
    enabled: true, // Enable the query to fetch real data
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Refetch jobs when component mounts (modal opens)
  useEffect(() => {
    refetch();
  }, [refetch]);



  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'failed':
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'processing':
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
      case 'queued':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };



  if (isLoading) {
    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Recent Import Jobs</h3>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 border rounded-md animate-pulse">
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="w-32 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }



  if (error) {
    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Recent Import Jobs</h3>
        <p className="text-sm text-red-500">Failed to load import jobs. Please try again later.</p>
      </div>
    );
  }

  // Handle the new API response structure
  const jobs = jobsData?.data?.jobs || [];
  
  if (!jobs || jobs.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Recent Import Jobs</h3>
        <p className="text-sm text-gray-500">No recent import jobs found.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Recent Import Jobs</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {jobs.map((job: any) => (
          <div key={job.id} className="border border-gray-200 rounded-md hover:bg-gray-50">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{job.entityType}</p>
                  {job.fileName && (
                    <p className="text-xs text-gray-500">{job.fileName}</p>
                  )}
                  {job.admin && (
                    <p className="text-xs text-gray-400">by {job.admin.username}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{formatDate(job.startedAt)}</p>
                {job.totalRows !== undefined && (
                  <p className="text-xs text-gray-500">
                    {job.processedRows || 0}/{job.totalRows} rows
                  </p>
                )}
                {job.errorCount > 0 && (
                  <p className="text-xs text-red-500">{job.errorCount} errors</p>
                )}
              </div>
            </div>
            
            {/* Error Details Section */}
            {job.errorLogs && job.errorCount > 0 && (
              <div className="px-3 pb-3 border-t border-gray-100">
                <div className="mt-2">
                  <p className="text-xs font-medium text-red-600 mb-1">Error Details:</p>
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    {(() => {
                      try {
                        const errorLogs = JSON.parse(job.errorLogs);
                        if (Array.isArray(errorLogs)) {
                          return errorLogs.map((error, index) => (
                            <p key={index} className="text-xs text-red-700 mb-1">
                              • {error}
                            </p>
                          ));
                        } else {
                          return <p className="text-xs text-red-700">{errorLogs}</p>;
                        }
                      } catch {
                        return <p className="text-xs text-red-700">{job.errorLogs}</p>;
                      }
                    })()}
                  </div>
                </div>
              </div>
            )}
            
            {/* Success/Processing Details */}
            {job.successCount > 0 && (
              <div className="px-3 pb-3 border-t border-gray-100">
                <div className="mt-2">
                  <p className="text-xs font-medium text-green-600 mb-1">Success:</p>
                  <p className="text-xs text-green-700">
                    {job.successCount} records imported successfully
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

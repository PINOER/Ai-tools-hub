import DialogContainer from '@/components/DialogContainer';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useStartExport, useLastJob } from '@/hooks/queries/useImportExportQuery';
import type { EntityType } from '@/api/import-export';
import { useEffect } from 'react';

interface GenericExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  title?: string;
}

// Separate component for export section
const ExportSection = ({ entityType, onExport, onCancel, isExporting }: { 
  entityType: EntityType; 
  onExport: () => void; 
  onCancel: () => void;
  isExporting: boolean; 
}) => (
  <div className='mb-6'>
    <p className='text-[14px] text-[#808080] font-[inter] font-medium'>EXPORT METHOD</p>
    <div className='flex items-center gap-4 text-sm'>
      <p className='rounded-[9px] pt-[3px] pb-[5px] px-4 bg-[#4D4D4D] text-white font-Nunito font-semibold text-[15px]'>
        CSV Export
      </p>
    </div>

    <p className='mt-4 text-[14px] text-[#4D4D4D] font-[inter] font-medium'>EXPORT DATA</p>
    <div className='flex items-center justify-center gap-1 border border-[#F2F2F2] border-dashed w-full h-[80px] mb-[40px] rounded-md bg-gray-50'>
      <div className='text-center'>
        <Download className='w-8 h-8 text-gray-400 mx-auto mb-2' />
        <p className='text-[12px] text-[#808080] font-[inter] font-medium'>
          Export all {entityType.toLowerCase()}s to CSV format
        </p>
        <p className='text-[10px] text-[#CCCCCC] font-[inter] font-medium mt-1'>
          The export will be processed in the background
        </p>
      </div>
    </div>
    
    <div className='flex justify-end gap-4 pb-6'>
      <button
        onClick={onCancel}
        className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
      >
        Cancel
      </button>
      <button
        onClick={onExport}
        disabled={isExporting}
        className='px-4 py-2 bg-[#4D4D4D] text-white rounded-md hover:bg-[#3D3D3D] disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isExporting ? 'Starting Export...' : 'Export'}
      </button>
    </div>
  </div>
);

// Separate component for loading state
const LoadingState = () => (
  <div className='space-y-2'>
    {[...Array(3)].map((_, i) => (
      <div key={i} className='flex items-center space-x-3 p-3 border rounded-md animate-pulse'>
        <div className='w-16 h-4 bg-gray-200 rounded'></div>
        <div className='w-24 h-4 bg-gray-200 rounded'></div>
        <div className='w-32 h-4 bg-gray-200 rounded'></div>
      </div>
    ))}
  </div>
);

// Separate component for error state
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className='border border-red-200 rounded-md p-4 bg-red-50'>
    <p className='text-sm text-red-600'>Failed to load last job. Please try again later.</p>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onRetry}
      className="mt-2"
    >
      Retry
    </Button>
  </div>
);

// Separate component for no data state
const NoDataState = () => (
  <div className='border border-gray-200 rounded-md p-4 bg-gray-50'>
    <p className='text-sm text-gray-500'>No export jobs found for this entity type.</p>
  </div>
);

// Separate component for job details
const JobDetails = ({ jobData }: { jobData: any }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'failed':
      case 'error':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'processing':
      case 'running':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending':
      case 'queued':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleDownload = () => {
    if (jobData.downloadUrl) {
      window.open(jobData.downloadUrl, '_blank');
    } else if (jobData.metadata) {
      try {
        const metadata = JSON.parse(jobData.metadata);
        if (metadata.s3Url) {
          window.open(metadata.s3Url, '_blank');
        }
      } catch (error) {
        console.error('Error parsing metadata:', error);
      }
    }
  };

  return (
    <div className='space-y-2 max-h-64 overflow-y-auto'>
      <div className='border border-gray-200 rounded-md hover:bg-gray-50'>
        <div className='flex items-center justify-between p-3'>
          <div className='flex items-center space-x-3'>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(jobData.status)}`}>
              {jobData.status}
            </span>
            <div>
              <p className='text-sm font-medium text-gray-900'>{jobData.entityType}</p>
              {jobData.fileName && (
                <p className='text-xs text-gray-500'>{jobData.fileName}</p>
              )}
              {jobData.admin && (
                <p className='text-xs text-gray-400'>by {jobData.admin.username}</p>
              )}
            </div>
          </div>
          <div className='text-right'>
            <p className='text-xs text-gray-500'>{formatDate(jobData.startedAt)}</p>
           
          
            {jobData.status.toLowerCase() === 'completed' && (
              <Button
                size="sm"
                onClick={handleDownload}
                className="mt-2 flex items-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </Button>
            )}
          </div>
        </div>
        
      
        {jobData.errorLogs && jobData.status === 'Failed' && (
          <div className='px-3 pb-3 border-t border-gray-100'>
            <div className='mt-2'>
              <p className='text-xs font-medium text-red-600 mb-1'>Error Details:</p>
              <div className='bg-red-50 border border-red-200 rounded p-2'>
                {(() => {
                  try {
                    const errorLogs = JSON.parse(jobData.errorLogs);
                    if (Array.isArray(errorLogs)) {
                      return errorLogs.map((error, index) => (
                        <p key={index} className='text-xs text-red-700 mb-1'>
                          • {error}
                        </p>
                      ));
                    } else {
                      return <p className='text-xs text-red-700'>{errorLogs}</p>;
                    }
                  } catch {
                    return <p className='text-xs text-red-700'>{jobData.errorLogs}</p>;
                  }
                })()}
              </div>
            </div>
          </div>
        )}
        
        
      </div>
    </div>
  );
};

// Main component
export const GenericExportDialog = ({ open, onOpenChange, entityType, title }: GenericExportDialogProps) => {
  const startExportMutation = useStartExport();
  const { data: lastJobData, isLoading, error, refetch } = useLastJob(entityType, {
    enabled: open,
    retry: 1,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const handleExport = async () => {
    await startExportMutation.mutateAsync({ entityType });
    refetch();
  };


  const handleCancel = () => {
    onOpenChange(false);
  };

  const renderLastJobSection = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState onRetry={refetch} />;
    }


    if (!lastJobData?.data) {
      return <NoDataState />;
    }

   
    return <JobDetails jobData={lastJobData.data} />;
  };
  

  return (
    <div>
      <DialogContainer
        title={title || `Export ${entityType}s`}
        open={open}
        onOpenChange={onOpenChange}
        maxWidth='4xl'
      >
        
        <div className='p-6'>
          <ExportSection 
            entityType={entityType} 
            onExport={handleExport} 
            onCancel={handleCancel}
            isExporting={startExportMutation.isPending} 
          />
          
          {/* Last Export Job Status */}
          <div className='border-t border-gray-200 pt-6'>
            <h3 className='text-[14px] text-[#808080] font-[inter] font-medium mb-4'>LAST EXPORT JOB</h3>
            {renderLastJobSection()}
          </div>
        </div>
      </DialogContainer>
    </div>
  );
};

import { useMutation, useQuery } from '@tanstack/react-query';
import { startImportApi, getImportJobsApi, startExportApi, getLastJobApi, type EntityType, type ImportJobOptions, type JobType, type JobStatus } from '@/api/import-export';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

export const useStartImport = () => {
  return useMutation({
    mutationFn: ({ file, entityType, options }: {
      file: File;
      entityType: EntityType;
      options?: ImportJobOptions;
    }) => startImportApi(file, entityType, options),
  
    onSuccess: () => {
      showSuccessToast('Successfully Imported Tools, wait some time to get it processed');
    },
    onError: (error) => {
      showErrorToast(error.message);
    },
  
  });
};






export const useImportJobs = (params?: {
  page?: number;
  limit?: number;
  entityType?: EntityType;
  jobType?: JobType;
  status?: JobStatus;
}, options?: {
  enabled?: boolean;
  retry?: boolean | number;
  refetchOnWindowFocus?: boolean;
}) => {
  return useQuery({
    queryKey: ['import-jobs', params],
    queryFn: () => getImportJobsApi(params),
    enabled: options?.enabled ?? true,
    retry: options?.retry ?? 3,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? true,
  });
};

export const useStartExport = () => {
  return useMutation({
    mutationFn: ({ entityType }: { entityType: EntityType }) => startExportApi(entityType),
  
    onSuccess: () => {
      showSuccessToast('Export job started successfully');
    },
    onError: (error) => {
      showErrorToast(error.message);
    },
  });
};

export const useLastJob = (entityType: EntityType, options?: {
  enabled?: boolean;
  retry?: boolean | number;
  refetchOnWindowFocus?: boolean;
}) => {
  return useQuery({
    queryKey: ['last-job', entityType],
    queryFn: () => getLastJobApi(entityType),
    enabled: options?.enabled ?? true,
    retry: options?.retry ?? 3,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? true,
  });
};

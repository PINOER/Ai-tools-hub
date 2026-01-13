import { apiClient } from '@/lib/apiClient';

export type EntityType = 'Tool' | 'Prompt' | 'Glossary' | 'News' | 'Article' | 'Learning' | 'Category' | 'Tag' | 'User';
export type JobType = 'Import' | 'Export';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ImportJobOptions {
  skipDuplicates?: boolean;
  updateExisting?: boolean;
  validateOnly?: boolean;
}

export interface ImportJobResponse {
  success: boolean;
  message: string;
  data: {
    jobId: string;
    message: string;
  };
}

export interface ImportJob {
  id: string;
  entityType: EntityType;
  jobType: JobType;
  status: string;
  fileName?: string;
  filePath?: string;
  totalRows?: number;
  processedRows?: number;
  successCount?: number;
  errorCount?: number;
  errorLogs?: string;
  metadata?: string;
  startedAt: string;
  completedAt: string;
  adminId: number;
  admin?: {
    username: string;
    first_name: string;
    last_name: string;
  };
}

export interface ImportJobsResponse {
  success: boolean;
  message: string;
  data: {
    jobs: ImportJob[];
    total: number;
  };
}

export interface ExportJobResponse {
  success: boolean;
  message: string;
  data: {
    jobId: string;
    message: string;
  };
}

export interface LastJobResponse {
  success: boolean;
  message: string;
  data: ImportJob & {
    downloadUrl?: string;
  };
}

export const startImportApi = async (
  file: File,
  entityType: EntityType,
  options?: ImportJobOptions
): Promise<ImportJobResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', entityType);
  
  if (options) {
    formData.append('options', JSON.stringify(options));
  }

  const response = await apiClient.post('/import-export/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const getImportJobsApi = async (params?: {
  page?: number;
  limit?: number;
  entityType?: EntityType;
  jobType?: JobType;
  status?: JobStatus;
}): Promise<ImportJobsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.entityType) queryParams.append('entityType', params.entityType);
  if (params?.jobType) queryParams.append('jobType', params.jobType);
  if (params?.status) queryParams.append('status', params.status);

  const url = `/import-export/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await apiClient.get<ImportJobsResponse>(url);
  return response.data;
};

export const startExportApi = async (entityType: EntityType): Promise<ExportJobResponse> => {
  const response = await apiClient.post('/import-export/export', {
    entityType
  });
  
  return response.data;
};

export const getLastJobApi = async (entityType: EntityType): Promise<LastJobResponse> => {
  const response = await apiClient.get<LastJobResponse>(`/import-export/last-job/${entityType}`);
  return response.data;
};

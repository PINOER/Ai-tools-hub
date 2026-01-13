import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface QueryErrorHandlerProps {
  error: Error | null;
  refetch?: () => void;
  title?: string;
  message?: string;
}

export const QueryErrorHandler: React.FC<QueryErrorHandlerProps> = ({
  error,
  refetch,
  title = 'Failed to load data',
  message = 'Something went wrong while fetching the data. Please try again.',
}) => {
  if (!error) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
      <div className="text-red-500 mb-4">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-4 max-w-md">{message}</p>
      
      {refetch && (
        <Button
          onClick={refetch}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 w-full max-w-md">
          <summary className="cursor-pointer text-sm text-gray-500">
            Error Details (Development)
          </summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
}; 
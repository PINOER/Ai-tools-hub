import toast from 'react-hot-toast';

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#fff',
      border: '1px solid #059669',
    },
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#fff',
      border: '1px solid #dc2626',
    },
  });
};

export const showApiErrorToast = (error: any) => {
  let errorMessage = 'An error occurred';
  
  if (error?.response?.data?.message) {
    errorMessage = error.response.data.message;
    
    // Add field-specific errors if available
    if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
      const fieldErrors = error.response.data.errors
        .map((err: any) => `${err.path?.join('.')}: ${err.message}`)
        .join(', ');
      
      if (fieldErrors) {
        errorMessage += ` - ${fieldErrors}`;
      }
    }
  } else if (error?.message) {
    errorMessage = error.message;
  }
  
  toast.error(errorMessage, {
    duration: 6000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#fff',
      border: '1px solid #dc2626',
    },
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#3b82f6',
      color: '#fff',
      border: '1px solid #2563eb',
    },
  });
};

export const showWarningToast = (message: string) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#f59e0b',
      color: '#fff',
      border: '1px solid #d97706',
    },
  });
}; 
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

export const formatValidationError = (errorData: any): string => {
  if (!errorData?.errors || !Array.isArray(errorData.errors)) {
    return errorData?.message || 'An error occurred';
  }

  const errors = errorData.errors;
  
  if (errors.length === 1) {
    const error = errors[0];
    const field = error.path?.join('.') || 'field';
    return `${field}: ${error.message}`;
  }

  const errorMessages = errors.map((err: any) => {
    const field = err.path?.join('.') || 'field';
    return `• ${field}: ${err.message}`;
  });

  return `${errorData.message || 'Validation failed'}:\n${errorMessages.join('\n')}`;
};

export const showApiErrorToast = (error: any) => {
  let errorMessage = 'An error occurred';
  
  if (error?.response?.data) {
    errorMessage = formatValidationError(error.response.data);
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
import { useUser } from '@/hooks/useUser';
import Pusher from 'pusher-js';

const getAuthToken = () => {
  const userStore = useUser.getState();
  return userStore.token;
};

// Pusher configuration
const pusherConfig = {
  key: import.meta.env.VITE_PUSHER_KEY || '16593d8b663d0f279349',
  cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'ap2',
  encrypted: true,
  authEndpoint: `${import.meta.env.VITE_API_BASE_URL}notifications/pusher/auth`, // Endpoint for private channel authentication
  auth: {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  },
};

// Create Pusher instance
export const pusher = new Pusher(pusherConfig.key, {
  cluster: pusherConfig.cluster,
  authEndpoint: pusherConfig.authEndpoint,
  auth: pusherConfig.auth,
});

// Notification channel events
export const NOTIFICATION_EVENTS = {
  NEW_NOTIFICATION: 'new-notification',
  NOTIFICATION_READ: 'notification-read',
  NOTIFICATION_DELETED: 'notification-deleted',
  BULK_UPLOAD_SUCCESS: 'bulk-upload-success',
} as const;

export type NotificationEvent = typeof NOTIFICATION_EVENTS[keyof typeof NOTIFICATION_EVENTS];

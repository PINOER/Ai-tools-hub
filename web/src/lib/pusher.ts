import Pusher from 'pusher-js';

let pusherInstance: Pusher | null = null;

export const getPusherInstance = (token?: string): Pusher => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.getprixite.com';
  // If token changes or instance doesn't exist, recreate instance
  if (!pusherInstance || token) {
    // Disconnect existing instance if token is provided (token refresh scenario)
    if (pusherInstance && token) {
      pusherInstance.disconnect();
      pusherInstance = null;
    }
    if (!pusherInstance) {
      pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '16593d8b663d0f279349', {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
        authEndpoint: `${API_BASE_URL}/notifications/pusher/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token || ''}`,
          },
        },
      });
    }
  }
  return pusherInstance;
};

export const disconnectPusher = () => {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
};


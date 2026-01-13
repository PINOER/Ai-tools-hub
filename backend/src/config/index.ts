import dotenv from 'dotenv';
// import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import Pusher from 'pusher';

dotenv.config();

const PORT = process.env.PORT || 5000;
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests from this IP, please try again later',
// });

export const config = {
  port: PORT,
  // limiter,
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'defaultrefreshsecret',
  dbUrl: process.env.DATABASE_URL || '',
  pusher: {
    appId: process.env.PUSHER_APP_ID || '2068108',
    key: process.env.PUSHER_KEY || '16593d8b663d0f279349',
    secret: process.env.PUSHER_SECRET || '13ece8f93daf23591a81',
    cluster: process.env.PUSHER_CLUSTER || 'ap2',
  },
};

export const prisma = new PrismaClient();

// Initialize Pusher
export const pusher = new Pusher({
  appId: config.pusher.appId,
  key: config.pusher.key,
  secret: config.pusher.secret,
  cluster: config.pusher.cluster,
  useTLS: true,
});

import jwt from 'jsonwebtoken';
import { config } from '@config/index.ts';
import logger from '@utils/logger.ts';
import { User } from '@prisma/client';

interface JwtPayload {
  id: number;
  username: string;
  role: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '2d' });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch {
    logger.error('Access token verification failed');
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as JwtPayload;
  } catch {
    logger.error('Refresh token verification failed');
    return null;
  }
};

export const generateToken = (user: User, role: string): string => {
  if (!user.username) {
    throw new Error('User username is required for token generation');
  }
  return generateAccessToken({ id: user.id, username: user.username, role });
};

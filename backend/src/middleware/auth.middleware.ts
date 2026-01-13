import type { Response, NextFunction, Request } from 'express';
import logger from '@utils/logger.ts';
import { RoleType, UserStatus } from '@prisma/client';
import { verifyAccessToken } from '@utils/jwt.ts';
import { prisma } from '../config/index.ts';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    const message = 'No token provided';
    logger.error(message);
    res.status(401).json({ success: false, message });
    return;
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    const message = 'Invalid or expired token';
    logger.error(message);
    res.status(401).json({ success: false, message });
    return;
  }

  // Check if user still exists in database
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, status: true, role_id: true },
  });

  if (!user) {
    const message = 'User no longer exists';
    logger.error(message);
    res.status(401).json({ success: false, message });
    return;
  }

  // Check if user is active
  if (user.status !== 'Active') {
    const message = 'User account is not active';
    logger.error(message);
    res.status(401).json({ success: false, message });
    return;
  }

  req.user = decoded;
  req.isAdmin = decoded.role === RoleType.Admin;
  req.isModerator = decoded.role === RoleType.Moderator;
  next();
};

export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    req.user = undefined;
    req.isAdmin = false;
    req.isModerator = false;
    next();
    return;
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    req.user = undefined;
    req.isAdmin = false;
    req.isModerator = false;
    next();
    return;
  }

  // Check if user still exists in database
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, status: true, role_id: true },
  });

  if (!user || user.status !== UserStatus.Active) {
    req.user = undefined;
    req.isAdmin = false;
    req.isModerator = false;
    next();
    return;
  }

  req.user = decoded;
  req.isAdmin = decoded.role === RoleType.Admin;
  req.isModerator = decoded.role === RoleType.Moderator;
  next();
};

export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const message = 'Access denied: insufficient permissions';
      logger.error(message);
      res.status(403).json({ success: false, message });
      return;
    }
    next();
  };
};

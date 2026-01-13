import { NextFunction, Request, Response } from 'express';
import { NotificationService } from '../services/notification.service.ts';
import { NotificationType } from '@prisma/client';
import { pusherService } from '../../../services/pusher.service.ts';

export class NotificationController {
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const type = req.query.type as NotificationType;
      //   const unreadOnly = req.query.unread_only === 'true';

      const result = await this.notificationService.getNotifications(
        userId,
        page,
        limit,
        type
        // unreadOnly
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }

  async getNotificationById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const notificationId = parseInt(req.params.id);

      const notification = await this.notificationService.getNotificationById(
        notificationId,
        userId
      );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found',
        });
      }

      res.json({
        success: true,
        data: notification,
      });
    } catch (e) {
      next(e);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const notificationId = parseInt(req.params.id);

      const notification = await this.notificationService.markAsRead(notificationId, userId);

      res.json({
        success: true,
        message: 'Notification marked as read',
        data: notification,
      });
    } catch (e) {
      next(e);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const result = await this.notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: `${result.count} notifications marked as read`,
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const notificationId = parseInt(req.params.id);

      await this.notificationService.deleteNotification(notificationId, userId);

      res.json({
        success: true,
        message: 'Notification deleted successfully',
      });
    } catch (e) {
      next(e);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const count = await this.notificationService.getUnreadCount(userId);

      res.json({
        success: true,
        data: { count },
      });
    } catch (e) {
      next(e);
    }
  }

  async createNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, type, title, message } = req.body;

      const notification = await this.notificationService.createNotification({
        user_id,
        type,
        title,
        message,
      });

      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notification,
      });
    } catch (e) {
      next(e);
    }
  }

  async getAdminNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const type = req.query.type as NotificationType;

      const result = await this.notificationService.getAdminNotifications(page, limit, type);

      res.json({
        success: true,
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }

  async getNotificationStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await this.notificationService.getNotificationStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (e) {
      next(e);
    }
  }

  async authenticatePusher(req: Request, res: Response, next: NextFunction) {
    try {
      const socketId = req.body.socket_id;
      const channel = req.body.channel_name;
      const userId = req.user!.id;

      // Authenticate the user for their private channel
      const auth = pusherService.authenticateUser(socketId, channel, userId);

      res.json(auth);
    } catch (e) {
      next(e);
    }
  }
}

import { NextFunction, Request, Response } from 'express';
import { ActivityService } from '../services/activity.service.ts';

export class ActivityController {
  private activityService: ActivityService;

  constructor(activityService: ActivityService) {
    this.activityService = activityService;
  }

  async getActivityFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const entityType = req.query.entity_type as string;

      const result = await this.activityService.getActivityFeed(page, limit, entityType);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async logActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const { title, description, icon, reference_id, entity_type, entity_name, metadata } =
        req.body;

      const result = await this.activityService.logActivity({
        title,
        description,
        icon,
        user_id: userId, // Use authenticated user_id
        reference_id,
        entity_type,
        entity_name,
        metadata,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }
}

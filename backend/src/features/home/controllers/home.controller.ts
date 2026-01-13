import type { Request, Response, NextFunction } from 'express';
import { HomeService } from '../services/home.service.ts';

export class HomeController {
  constructor(private homeService: HomeService) {}

  async getHomeData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.homeService.getHomeData(req.validatedQuery);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPendingApprovals(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.homeService.getPendingApprovals();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.homeService.getDashboardStats();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

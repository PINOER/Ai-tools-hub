import type { Request, Response, NextFunction } from 'express';
import { SiteService } from '../services/site.service.ts';

export class SiteController {
  constructor(private siteService: SiteService) {}

  async updateSiteInformation(req: Request, res: Response, next: NextFunction) {
    try {
      const siteInfo = await this.siteService.updateSiteInformation(req.validatedBody);
      res.status(200).json({
        success: true,
        message: 'Site information updated successfully',
        data: siteInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  async upsertSiteInformation(req: Request, res: Response, next: NextFunction) {
    try {
      const siteInfo = await this.siteService.upsertSiteInformation(req.validatedBody);
      res.status(200).json({
        success: true,
        message: 'Site information updated successfully',
        data: siteInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSiteSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await this.siteService.getSiteSettings();
      res.status(200).json(settings);
      return;
    } catch (error) {
      next(error);
    }
  }
}

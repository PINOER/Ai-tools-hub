import { Request, Response, NextFunction } from 'express';
import { RelatednessService } from '../services/relatedness.service.ts';

export class RelatednessController {
  private relatednessService: RelatednessService;

  constructor() {
    this.relatednessService = new RelatednessService();
  }

  async getRelatedContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { entity, id } = req.validatedParams;
      const result = await this.relatednessService.getRelatedContent(entity, Number(id));
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

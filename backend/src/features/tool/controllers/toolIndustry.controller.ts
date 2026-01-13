import type { Request, Response, NextFunction } from 'express';
import { ToolIndustryService } from '../services/toolIndustry.service.ts';

export class ToolIndustryController {
  constructor(private toolIndustryService: ToolIndustryService) {}

  async createToolIndustry(req: Request, res: Response, next: NextFunction) {
    try {
      const toolIndustry = await this.toolIndustryService.createToolIndustry(
        req.validatedBody,
        req.user!.id
      );
      res.status(201).json(toolIndustry);
    } catch (error) {
      next(error);
    }
  }

  async getAllToolIndustries(req: Request, res: Response, next: NextFunction) {
    try {
      const toolIndustries = await this.toolIndustryService.getAllToolIndustries(
        req.validatedQuery
      );
      res.status(200).json(toolIndustries);
    } catch (error) {
      next(error);
    }
  }

  async getToolIndustry(req: Request, res: Response, next: NextFunction) {
    try {
      const toolIndustry = await this.toolIndustryService.getToolIndustryById(
        req.validatedParams.id
      );
      if (!toolIndustry) {
        res.status(404).json({ message: 'Tool industry not found' });
        return;
      }
      res.status(200).json(toolIndustry);
    } catch (error) {
      next(error);
    }
  }

  async updateToolIndustry(req: Request, res: Response, next: NextFunction) {
    try {
      const toolIndustry = await this.toolIndustryService.updateToolIndustry(
        req.validatedParams.id,
        req.validatedBody,
        req.user!.id
      );
      res.status(200).json(toolIndustry);
    } catch (error) {
      next(error);
    }
  }

  async deleteToolIndustry(req: Request, res: Response, next: NextFunction) {
    try {
      await this.toolIndustryService.deleteToolIndustry(req.validatedParams.id, req.user!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

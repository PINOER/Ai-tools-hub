import { Request, Response, NextFunction } from 'express';
import { LearningService } from '@features/learning/services/learning.service.ts';
import { prisma } from '../../../config/index.ts';

export class LearningController {
  private learningService: LearningService;

  constructor(learningService?: LearningService) {
    this.learningService = learningService || new LearningService(prisma);
  }

  async createLearning(req: Request, res: Response, next: NextFunction) {
    try {
      const learning = await this.learningService.createLearning(req.validatedBody, req.user!.id);
      res.status(201).json(learning);
    } catch (err) {
      next(err);
    }
  }

  async getLearnings(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.isAdmin || false;
      const result = await this.learningService.getAllLearnings(req.validatedQuery, isAdmin);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getLearningById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const learning = await this.learningService.getLearningById(id);

      if (!learning) {
        res.status(404).json({ message: 'Learning not found' });
        return;
      }

      res.json(learning);
    } catch (err) {
      next(err);
    }
  }

  async updateLearning(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const learning = await this.learningService.updateLearning(
        id,
        req.validatedBody,
        req.user!.id
      );

      res.json(learning);
    } catch (err) {
      next(err);
    }
  }

  async deleteLearning(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const authenticatedUserId = req.user!.id;
      await this.learningService.deleteLearning(id, authenticatedUserId);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async bulkDeleteLearnings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.learningService.bulkDeleteLearnings(req.validatedBody);
      res.json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} learnings`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async bulkUpdateLearnings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.learningService.bulkUpdateLearnings(req.validatedBody);
      res.json({
        success: true,
        message: `Successfully updated ${result.updatedCount} learnings`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

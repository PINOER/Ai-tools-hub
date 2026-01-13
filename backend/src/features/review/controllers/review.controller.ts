import type { NextFunction, Request, Response } from 'express';
import { ReviewService } from '../services/review.service.ts';

export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  async createReview(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const review = await this.reviewService.create(userId as number, req.validatedBody);
      res.status(201).json(review);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async markHelpful(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as number;
      await this.reviewService.markHelpful(userId, req.validatedBody);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async reportReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as number;
      await this.reviewService.report(userId, req.validatedBody);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const authenticatedUserId = req.user!.id;
      await this.reviewService.deleteReview(req.validatedParams.id, authenticatedUserId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      await this.reviewService.updateStatus(
        req.validatedParams.id,
        user?.id as number,
        req.validatedBody
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, sort_by, tool_id, user_id, page, limit, search } = req.validatedQuery;

      const queryParams: any = { status, sort_by, page, limit };

      if (tool_id) {
        queryParams.tool_id = Number(tool_id);
      }

      if (user_id) {
        queryParams.user_id = Number(user_id);
      }

      if (search) {
        queryParams.search = search;
      }

      // Check if user is authenticated and admin
      const isAdmin = req.isAdmin || false;
      const reviews = await this.reviewService.getReviews(queryParams, isAdmin);

      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  }

  async getAllReports(req: Request, res: Response, next: NextFunction) {
    try {
      const toolId = req.validatedParams.toolId;
      const reports = await this.reviewService.getReportsForTool(toolId);
      res.status(200).json(reports);
    } catch (error) {
      next(error);
    }
  }

  async deleteReport(req: Request, res: Response, next: NextFunction) {
    try {
      const reportId = req.validatedParams.reportId;
      await this.reviewService.deleteReport(reportId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviews } = req.validatedBody;
      const authenticatedUserId = req.user!.id;
      const result = await this.reviewService.bulkUpdateStatus(reviews, authenticatedUserId);
      res.status(200).json({ success: true, result });
    } catch (error) {
      next(error);
    }
  }

  async bulkDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.validatedBody;
      const result = await this.reviewService.bulkDelete(ids);
      res.status(200).json({ success: true, result });
    } catch (error) {
      next(error);
    }
  }
}

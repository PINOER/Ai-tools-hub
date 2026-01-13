import type { Request, Response, NextFunction } from 'express';
import { ToolSubmissionService } from '../services/toolSubmission.service.ts';

export class ToolSubmissionController {
  constructor(private submissionService: ToolSubmissionService) {}

  async createToolSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const submission = await this.submissionService.createToolSubmission({
        tool_id: req.validatedBody.tool_id,
        user_id: user.id,
      });
      res.status(201).json(submission);
    } catch (err) {
      next(err);
    }
  }

  async getToolSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const submission = await this.submissionService.getToolSubmission(id);
      res.json(submission);
    } catch (err) {
      if (err instanceof Error && err.message === 'Tool submission not found') {
        res.status(404).json({
          success: false,
          message: 'Tool submission not found',
        });
        return;
      }
      next(err);
    }
  }

  async getAllSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const submissions = await this.submissionService.getAllSubmissions(req.validatedQuery);
      res.json(submissions);
    } catch (err) {
      next(err);
    }
  }

  async updateToolSubmissionStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const updatedSubmission = await this.submissionService.updateToolSubmissionStatus(
        id,
        req.validatedBody,
        req.user!.id
      );
      res.status(200).json(updatedSubmission);
    } catch (err) {
      if (err instanceof Error && err.message === 'Tool submission not found') {
        res.status(404).json({
          success: false,
          message: 'Tool submission not found',
        });
        return;
      }
      next(err);
    }
  }

  async bulkApproveSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.submissionService.bulkApproveSubmissions(req.validatedBody);
      res.status(200).json({
        success: true,
        message: 'Bulk submission review completed successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteToolSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      await this.submissionService.deleteToolSubmission(id, req.user!.id);
      res.status(200).json({
        success: true,
        message: 'Tool submission deleted successfully',
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'Tool submission not found') {
        res.status(404).json({
          success: false,
          message: 'Tool submission not found',
        });
        return;
      }
      next(err);
    }
  }

  async bulkDeleteSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const { submission_ids } = req.validatedBody;
      const result = await this.submissionService.bulkDeleteSubmissions(submission_ids);
      res.status(200).json({
        success: true,
        message: 'Tool submissions deleted successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

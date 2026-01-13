import { Request, Response, NextFunction } from 'express';
import { ToolClaimService } from '../services/toolClaim.service.ts';

export class ToolClaimController {
  constructor(private toolClaimService: ToolClaimService) {}

  async submitClaim(req: Request, res: Response, next: NextFunction) {
    try {
      const { tool_id } = req.validatedParams;
      const user_id = req.user?.id;
      const claim = await this.toolClaimService.create(
        req.validatedBody,
        tool_id,
        user_id as number
      );
      res.status(201).json(claim);
    } catch (error) {
      next(error);
    }
  }

  async updateClaim(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const updatedClaim = await this.toolClaimService.update(id, req.validatedBody, req.user!.id);
      res.status(200).json(updatedClaim);
    } catch (error) {
      next(error);
    }
  }

  async getClaims(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, page = 1, limit = 10 } = req.validatedQuery;
      const user = req.user;

      const result = await this.toolClaimService.getClaims(
        req.isAdmin || false,
        user?.id as number,
        status,
        Number(page),
        Number(limit)
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async deleteClaim(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const deleted = await this.toolClaimService.deleteClaim(id, req.user!.id);
      res.status(204).json(deleted);
    } catch (err) {
      next(err);
    }
  }

  async approveReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const updated = await this.toolClaimService.approveClaim(
        Number(id),
        req.validatedBody,
        req.user!.id
      );
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async bulkApprove(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.toolClaimService.bulkApproveClaims(req.validatedBody);
      res.json({
        success: true,
        message: `Bulk review completed. ${result.processed} claims processed, ${result.failed} failed.`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async bulkDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.toolClaimService.bulkDeleteClaims(req.validatedBody);
      res.json({
        success: true,
        message: `Bulk delete completed. ${result.deletedCount} claims deleted successfully.`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

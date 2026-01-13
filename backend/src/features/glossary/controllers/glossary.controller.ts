import { Request, Response, NextFunction } from 'express';
import { GlossaryService } from '../services/glossary.service.ts';

export class GlossaryController {
  constructor(private glossaryService: GlossaryService) {}

  async createTerm(req: Request, res: Response, next: NextFunction) {
    try {
      const term = await this.glossaryService.createTerm(req.validatedBody);
      res.status(201).json({
        success: true,
        message: 'Glossary term created successfully',
        data: term,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllTerms(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.isAdmin ?? false;
      const terms = await this.glossaryService.getAllTerms(req.validatedQuery, isAdmin);
      res.status(200).json({
        success: true,
        message: 'Glossary terms retrieved successfully',
        data: terms,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTerm(req: Request, res: Response, next: NextFunction) {
    try {
      const term = await this.glossaryService.getTerm(req.validatedParams.id);
      res.status(200).json({
        success: true,
        message: 'Glossary term retrieved successfully',
        data: term,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTerm(req: Request, res: Response, next: NextFunction) {
    try {
      const term = await this.glossaryService.updateTerm(
        req.validatedParams.id,
        req.validatedBody,
        req.user!.id
      );
      res.status(200).json({
        success: true,
        message: 'Glossary term updated successfully',
        data: term,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTerm(req: Request, res: Response, next: NextFunction) {
    try {
      const authenticatedUserId = req.user!.id;
      await this.glossaryService.deleteTerm(req.validatedParams.id, authenticatedUserId);
      res.status(200).json({
        success: true,
        message: 'Glossary term deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async createRelation(req: Request, res: Response, next: NextFunction) {
    try {
      const relation = await this.glossaryService.createRelation(req.validatedBody);
      res.status(201).json({
        success: true,
        message: 'Glossary term relation created successfully',
        data: relation,
      });
    } catch (error) {
      next(error);
    }
  }

  async createEditSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const edit = await this.glossaryService.createEditSubmission(
        req.validatedBody,
        req.user?.id ?? 0
      );
      res.status(201).json({
        success: true,
        message: 'Edit suggestion submitted successfully',
        data: edit,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllEditSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const edits = await this.glossaryService.getAllEditSubmissions(
        req.validatedQuery,
        req.user?.id ?? 0,
        req.isAdmin ?? false
      );
      res.status(200).json({
        success: true,
        message: 'Edit suggestions retrieved successfully',
        data: edits,
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdateEditStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids, status } = req.validatedBody;
      const result = await this.glossaryService.bulkUpdateEditStatus(ids, status, req.user!.id);
      res.status(200).json({
        success: true,
        message: 'Edit suggestions status updated',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdateTermStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids, status } = req.validatedBody;
      const result = await this.glossaryService.bulkUpdateStatus(ids, status, req.user!.id);
      res.status(200).json({
        success: true,
        message: 'Glossary terms status updated',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

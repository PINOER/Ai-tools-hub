import type { Request, Response, NextFunction } from 'express';

import { ToolService } from '../services/tool.service.ts';
import { User } from '../../../types/index.ts';

export class ToolController {
  constructor(private toolService: ToolService) {}

  async createTool(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as User;
      const newTool = await this.toolService.createTool(req.validatedBody, user.id);
      res.status(201).json(newTool);
    } catch (error) {
      next(error);
    }
  }

  async updateToolStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const { status } = req.validatedBody;
      const authenticatedUserId = req.user!.id;

      const updatedTool = await this.toolService.updateToolStatus(id, status, authenticatedUserId);
      res.status(200).json(updatedTool);
    } catch (error) {
      next(error);
    }
  }

  async getTool(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.isAdmin || false;
      console.log('Is admin', isAdmin);
      const tool = await this.toolService.getToolById(req.validatedParams.id, isAdmin);
      if (!tool) {
        res.status(404).json({ message: 'Tool not found' });
        return;
      }
      res.status(200).json(tool);
    } catch (error) {
      next(error);
    }
  }

  async updateTool(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedTool = await this.toolService.updateTool(
        req.validatedParams.id,
        req.validatedBody
      );
      res.status(200).json(updatedTool);
    } catch (error) {
      next(error);
    }
  }

  async deleteTool(req: Request, res: Response, next: NextFunction) {
    try {
      const authenticatedUserId = req.user!.id;
      await this.toolService.deleteTool(req.validatedParams.id, authenticatedUserId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async bulkDeleteTools(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.toolService.bulkDeleteTools(req.validatedBody);
      res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} tools`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllTools(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.isAdmin || false;

      const tools = await this.toolService.getAllTools(req.validatedQuery, isAdmin);
      res.status(200).json(tools);
    } catch (error) {
      next(error);
    }
  }
}

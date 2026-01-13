import type { Request, Response, NextFunction } from 'express';
import { ToolRoleService } from '../services/toolRole.service.ts';

export class ToolRoleController {
  constructor(private toolRoleService: ToolRoleService) {}

  async createToolRole(req: Request, res: Response, next: NextFunction) {
    try {
      const toolRole = await this.toolRoleService.createToolRole(req.validatedBody, req.user!.id);
      res.status(201).json(toolRole);
    } catch (error) {
      next(error);
    }
  }

  async getAllToolRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const toolRoles = await this.toolRoleService.getAllToolRoles(req.validatedQuery);
      res.status(200).json(toolRoles);
    } catch (error) {
      next(error);
    }
  }

  async getToolRole(req: Request, res: Response, next: NextFunction) {
    try {
      const toolRole = await this.toolRoleService.getToolRoleById(req.validatedParams.id);
      if (!toolRole) {
        res.status(404).json({ message: 'Tool role not found' });
        return;
      }
      res.status(200).json(toolRole);
    } catch (error) {
      next(error);
    }
  }

  async updateToolRole(req: Request, res: Response, next: NextFunction) {
    try {
      const toolRole = await this.toolRoleService.updateToolRole(
        req.validatedParams.id,
        req.validatedBody,
        req.user!.id
      );
      res.status(200).json(toolRole);
    } catch (error) {
      next(error);
    }
  }

  async deleteToolRole(req: Request, res: Response, next: NextFunction) {
    try {
      await this.toolRoleService.deleteToolRole(req.validatedParams.id, req.user!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

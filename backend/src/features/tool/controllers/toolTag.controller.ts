import type { Request, Response, NextFunction } from 'express';
import { ToolTagService } from '../services/toolTag.service.ts';

const service = new ToolTagService();

export class ToolTagController {
  private service: ToolTagService;
  constructor() {
    this.service = new ToolTagService();
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.create(req.body, req.user!.id);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getAll();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { tool_id, tag_id } = req.params;
      const result = await service.get(Number(tool_id), Number(tag_id));
      if (!result) res.status(404).json({ message: 'Not found' });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { tool_id, tag_id } = req.params;
      const result = await service.update(Number(tool_id), Number(tag_id), req.body, req.user!.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { tool_id, tag_id } = req.params;
      await service.delete(Number(tool_id), Number(tag_id), req.user!.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

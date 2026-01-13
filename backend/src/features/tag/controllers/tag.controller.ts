import type { Request, Response, NextFunction } from 'express';
import { TagService } from '../services/tag.service.ts';

export class TagController {
  constructor(private tagService: TagService) {}

  async createTag(req: Request, res: Response, next: NextFunction) {
    try {
      const tag = await this.tagService.createTag(req.validatedBody, req.user!.id);
      res.status(201).json(tag);
    } catch (error) {
      next(error);
    }
  }

  async getTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const tag = await this.tagService.getTag(id);
      if (!tag) {
        res.status(404).json({ message: 'Tag not found' });
        return;
      }
      res.status(200).json(tag);
    } catch (error) {
      next(error);
    }
  }

  async updateTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const tag = await this.tagService.updateTag(id, req.validatedBody, req.user!.id);
      if (!tag) {
        res.status(404).json({ message: 'Tag not found' });
        return;
      }
      res.status(200).json(tag);
    } catch (error) {
      next(error);
    }
  }

  async deleteTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      await this.tagService.deleteTag(id, req.user!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getAllTags(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.tagService.getAllTags(req.validatedQuery);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

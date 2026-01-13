import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service.ts';
import { prisma } from '../../../config/index.ts';
import { Section } from '@prisma/client';

export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService?: CategoryService) {
    this.categoryService = categoryService || new CategoryService(prisma);
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this.categoryService.createCategory(req.validatedBody, req.user!.id);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this.categoryService.categoryExists(
        req.validatedParams.id,
        Section.Tool
      );
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this.categoryService.updateCategory(
        req.validatedParams.id,
        req.validatedBody,
        req.user!.id
      );
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this.categoryService.deleteCategory(
        req.validatedParams.id,
        req.user!.id
      );
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.categoryService.getAllCategories(req.validatedQuery);
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async deleteSectionCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const { section, force } = req.validatedQuery;
      const forceDelete = force === 'true';

      const result = await this.categoryService.deleteSectionCategory(id, section, forceDelete);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async bulkDeleteSectionCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { force } = req.validatedQuery;
      const forceDelete = force === 'true';

      const result = await this.categoryService.bulkDeleteSectionCategories(
        req.validatedBody,
        forceDelete
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

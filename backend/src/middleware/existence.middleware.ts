import { NextFunction, Request, Response } from 'express';
import { Section } from '@prisma/client';
import { ToolService } from '../features/tool/services/tool.service.ts';
import { CategoryService } from '../features/category/services/category.service.ts';
import { GlossaryService } from '../features/glossary/services/glossary.service.ts';
import { prisma } from '../config/index.ts';

export const existsMiddleware = {
  async toolExists(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = Number(req.params?.tool_id || req.body?.tool_id || req.query?.tool_id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid or missing tool_id' });
      return;
    }

    const exists = await ToolService.toolExists(id);
    if (!exists) {
      res.status(404).json({ error: 'Tool not found' });
      return;
    }

    next();
  },

  async glossaryTermExists(req: Request, res: Response, next: NextFunction): Promise<void> {
    const idRaw =
      req.params?.id || req.body?.term_id || req.query?.term_id || req.body?.glossary_term_id;
    if (!idRaw) {
      res.status(400).json({ error: 'Invalid or missing term_id' });
      return;
    }

    const id = Number(idRaw);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid term_id format' });
      return;
    }

    const exists = await GlossaryService.termExists(id);
    if (!exists) {
      res.status(404).json({ error: 'Glossary term not found' });
      return;
    }

    next();
  },
};

export const categoryExists = (section: Section) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = Number(req.params?.category_id || req.body?.category_id || req.query?.category_id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid or missing category_id' });
      return;
    }
    const service = new CategoryService(prisma);
    const category = await service.categoryExists(id, section);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    next();
  };
};

export const categoriesExist = (section: Section) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const categoryService = new CategoryService(prisma);

    const body = req.body || {};
    const category_id_raw = body.category_id;
    const secondary_category_ids_raw = body.secondary_category_ids;

    const allCategoryIds: number[] = [];

    if (category_id_raw !== undefined) {
      const category_id = Number(category_id_raw);
      if (isNaN(category_id) || category_id <= 0) {
        res.status(400).json({ error: 'Invalid category_id' });
        return;
      }
      allCategoryIds.push(category_id);
    }

    if (Array.isArray(secondary_category_ids_raw)) {
      if (secondary_category_ids_raw.length > 2) {
        res.status(400).json({ error: 'You can provide up to 2 secondary categories' });
        return;
      }

      for (const id of secondary_category_ids_raw) {
        const numId = Number(id);
        if (isNaN(numId) || numId <= 0) {
          res.status(400).json({ error: `Invalid secondary category ID: ${id}` });
          return;
        }
        allCategoryIds.push(numId);
      }
    } else if (secondary_category_ids_raw !== undefined) {
      res.status(400).json({ error: 'secondary_category_ids must be an array' });
      return;
    }

    if (allCategoryIds.length === 0) {
      return next();
    }

    await categoryService.validateCategoriesExist(allCategoryIds, section);

    next();
  };
};

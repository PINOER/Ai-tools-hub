import { Request, Response, NextFunction } from 'express';
import { ArticleService } from '@features/article/services/article.service.ts';
import { prisma } from '../../../config/index.ts';

export class ArticleController {
  private articleService: ArticleService;

  constructor(articleService?: ArticleService) {
    this.articleService = articleService || new ArticleService(prisma);
  }

  async createArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const article = await this.articleService.createArticle(req.validatedBody, req.user!.id);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  async getArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.isAdmin;
      const result = await this.articleService.getArticles(req.validatedQuery, isAdmin);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getArticleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const article = await this.articleService.getArticleById(id);

      if (!article) {
        res.status(404).json({ message: 'Article not found' });
        return;
      }

      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  async updateArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const article = await this.articleService.updateArticle(id, req.validatedBody, req.user!.id);

      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  async deleteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      await this.articleService.deleteArticle(id, req.user!.id);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async bulkDeleteArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.articleService.bulkDeleteArticles(req.validatedBody);
      res.json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} articles`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async bulkUpdateArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.articleService.bulkUpdateArticles(req.validatedBody);
      res.json({
        success: true,
        message: `Successfully updated ${result.updatedCount} articles`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

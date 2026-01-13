import type { Request, Response, NextFunction } from 'express';

import { NewsService } from '../services/news.service.ts';
import { User } from '../../../types/index.ts';

export class NewsController {
  constructor(private newsService: NewsService) {}

  async createNews(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as User;
      const newNews = await this.newsService.createNews(req.validatedBody, user.id);
      res.status(201).json(newNews);
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdateNewsModerationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { news_ids, moderation_status } = req.validatedBody;

      const updatedNews = await this.newsService.bulkUpdateNewsModerationStatus(
        news_ids,
        moderation_status,
        req.user!.id
      );
      res.status(200).json(updatedNews);
    } catch (error) {
      next(error);
    }
  }

  async updateNewsModerationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const { moderation_status } = req.validatedBody;

      const updatedNews = await this.newsService.updateNewsModerationStatus(
        id,
        moderation_status,
        req.user!.id
      );
      res.status(200).json(updatedNews);
    } catch (error) {
      next(error);
    }
  }

  async getNews(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.isAdmin || false;

      const news = await this.newsService.getNewsById(req.validatedParams.id, isAdmin);
      if (!news) {
        res.status(404).json({ message: 'News not found' });
        return;
      }
      res.status(200).json(news);
    } catch (error) {
      next(error);
    }
  }

  async updateNews(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedNews = await this.newsService.updateNews(
        req.validatedParams.id,
        req.validatedBody,
        req.user!.id
      );
      res.status(200).json(updatedNews);
    } catch (error) {
      next(error);
    }
  }

  async deleteNews(req: Request, res: Response, next: NextFunction) {
    try {
      const authenticatedUserId = req.user!.id;
      await this.newsService.deleteNews(req.validatedParams.id, authenticatedUserId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async bulkDeleteNews(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.newsService.bulkDeleteNews(req.validatedBody);
      res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} news items`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllNews(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.isAdmin || false;

      const news = await this.newsService.getAllNews(req.validatedQuery, isAdmin);
      res.status(200).json(news);
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response } from 'express';
import { BookmarkService } from '../services/bookmark.service.ts';
import { RoleType } from '@prisma/client';

export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const bookmark = await this.bookmarkService.createBookmark(userId, req.validatedBody);
      res.status(201).json({ success: true, data: bookmark, message: 'Bookmarked' });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const bookmark = await this.bookmarkService.deleteBookmark(
        req.validatedParams.id,
        req.user!.id
      );
      res.json({ success: true, data: bookmark, message: 'Bookmark removed' });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  async mine(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await this.bookmarkService.getUserBookmarks(userId, req.validatedQuery);
      res.json({
        success: true,
        data: result.bookmarks,
        pagination: {
          page: req.validatedQuery.page,
          limit: req.validatedQuery.limit,
          total: result.total,
          pages: Math.ceil(result.total / req.validatedQuery.limit),
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  async getAllBookmarks(req: Request, res: Response): Promise<void> {
    try {
      const isAdmin = req.user?.role === RoleType.Admin;
      const result = await this.bookmarkService.getAllBookmarks(req.validatedQuery, isAdmin);
      res.json({
        success: true,
        data: result.bookmarks,
        pagination: {
          page: req.validatedQuery.page,
          limit: req.validatedQuery.limit,
          total: result.total,
          pages: Math.ceil(result.total / req.validatedQuery.limit),
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }
}

import { prisma } from '@config/index.ts';
import { Bookmark, BookmarkTargetType } from '@prisma/client';
import { z } from 'zod';
import { createBookmarkSchema, getBookmarksQuerySchema } from '../validators/bookmark.validator.ts';
import { verifyTargetExists } from '@utils/utils.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';

export class BookmarkService {
  private activityService: ActivityService;

  constructor() {
    this.activityService = new ActivityService();
  }

  async createBookmark(
    userId: number,
    data: z.infer<typeof createBookmarkSchema>
  ): Promise<Bookmark> {
    const { target_id, target_type } = data;

    // Verify target exists before creating bookmark
    const targetExists = await verifyTargetExists(target_id, target_type as BookmarkTargetType);
    if (!targetExists) {
      throw new Error(`${target_type} with ID ${target_id} does not exist`);
    }

    const existing = await prisma.bookmark.findFirst({
      where: {
        user_id: userId,
        target_id,
        target_type: target_type as BookmarkTargetType,
      },
    });
    if (existing) return existing;

    const bookmark = await prisma.bookmark.create({
      data: {
        user_id: userId,
        target_id,
        target_type: target_type as BookmarkTargetType,
      },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Bookmark Created',
      description: `${bookmark.target_type} bookmarked`,
      icon: '🔖',
      user_id: userId,
      reference_id: target_id,
      entity_type: target_type.toLowerCase(),
      entity_name: `${target_type} Bookmark`,
    });

    return bookmark;
  }

  async deleteBookmark(id: number, user_id: number): Promise<Bookmark> {
    const bookmark = await prisma.bookmark.findUnique({ where: { id } });

    if (!bookmark) {
      throw new Error('Bookmark not found');
    }

    const deletedBookmark = await prisma.bookmark.delete({ where: { id } });

    // Log activity
    await this.activityService.logActivity({
      title: 'Bookmark Deleted',
      description: `${bookmark.target_type} bookmark removed`,
      icon: '🗑️',
      user_id: user_id,
      reference_id: bookmark.target_id || undefined,
      entity_type: bookmark.target_type.toLowerCase(),
      entity_name: `${bookmark.target_type} Bookmark`,
    });

    return deletedBookmark;
  }

  async getUserBookmarks(
    userId: number,
    query: z.infer<typeof getBookmarksQuerySchema>
  ): Promise<{ bookmarks: Bookmark[]; total: number }> {
    const { page, limit, target_type } = query;
    const skip = (page - 1) * limit;

    const where: any = { user_id: userId };
    if (target_type) where.target_type = target_type as BookmarkTargetType;

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({ where, skip, take: limit, orderBy: { created_at: 'desc' } }),
      prisma.bookmark.count({ where }),
    ]);

    return { bookmarks, total };
  }

  async getAllBookmarks(
    query: z.infer<typeof getBookmarksQuerySchema>,
    isAdmin: boolean
  ): Promise<{ bookmarks: Bookmark[]; total: number }> {
    const { page, limit, target_type, user_id } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (target_type) where.target_type = target_type as BookmarkTargetType;
    if (user_id) where.user_id = user_id;

    if (!isAdmin) {
      where.user_id = user_id;
    }

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({ where, skip, take: limit, orderBy: { created_at: 'desc' } }),
      prisma.bookmark.count({ where }),
    ]);

    return { bookmarks, total };
  }
}

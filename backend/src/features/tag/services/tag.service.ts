import type { Tag } from '@prisma/client';
import { z } from 'zod';
import { getTagsQuerySchema } from '../validators/tag.validator.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';

export class TagService {
  private prisma: any;
  private activityService: ActivityService;

  constructor(prisma?: any) {
    this.prisma = prisma || prisma;
    this.activityService = new ActivityService();
  }

  async createTag(data: { name: string }, user_id: number): Promise<Tag> {
    const tag = await this.prisma.tag.create({
      data,
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Tag Created',
      description: `Tag "${tag.name}" created`,
      icon: '🏷️',
      user_id: user_id,
      entity_type: 'tag',
      entity_name: tag.name,
    });

    return tag;
  }

  async getTag(id: number): Promise<Tag | null> {
    return await this.prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tool_tags: true,
          },
        },
      },
    });
  }

  async getOrCreateTags(tagNames: string[], tx: any = this.prisma) {
    const existingTags = await tx.tag.findMany({
      where: { name: { in: tagNames } },
    });

    const existingTagNames = existingTags.map((tag: Tag) => tag.name);
    const missingTagNames = tagNames.filter((name) => !existingTagNames.includes(name));

    const newTags = await Promise.all(
      missingTagNames.map((name: string) => tx.tag.create({ data: { name } }))
    );

    return [...existingTags, ...newTags].map((tag: Tag) => tag.id);
  }

  /**
   * Find or create tag by name
   * Used for CSV imports where users provide tag names instead of IDs
   */
  async findOrCreateTagByName(name: string, tx: any = this.prisma): Promise<number> {
    // First try to find existing tag by name
    let tag = await tx.tag.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (!tag) {
      // Create new tag if it doesn't exist
      tag = await tx.tag.create({
        data: { name },
      });
    }

    return tag.id;
  }

  /**
   * Get tag ID by name (for validation)
   */
  async getTagIdByName(name: string): Promise<number | null> {
    const tag = await this.prisma.tag.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
      select: { id: true },
    });

    return tag?.id || null;
  }

  async updateTag(id: number, data: { name: string }, user_id: number): Promise<Tag | null> {
    const tag = await this.prisma.tag.update({
      where: { id },
      data,
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Tag Updated',
      description: `Tag "${tag.name}" updated`,
      icon: '✏️',
      user_id: user_id,
      entity_type: 'tag',
      entity_name: tag.name,
    });

    return tag;
  }

  async deleteTag(id: number, user_id: number): Promise<Tag | null> {
    // Get tag info before deletion for activity logging
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      select: { name: true },
    });

    const deletedTag = await this.prisma.tag.delete({
      where: { id },
    });

    // Log activity
    if (tag) {
      await this.activityService.logActivity({
        title: 'Tag Deleted',
        description: `Tag "${tag.name}" deleted`,
        icon: '🗑️',
        user_id: user_id,
        entity_type: 'tag',
        entity_name: tag.name,
      });
    }

    return deletedTag;
  }

  async getAllTags(query?: z.infer<typeof getTagsQuerySchema>) {
    if (!query) {
      const tags = await this.prisma.tag.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          _count: {
            select: {
              tool_tags: true,
            },
          },
        },
      });

      return {
        tags: tags.map((tag: any) => ({
          ...tag,
          tool_count: tag._count.tool_tags,
        })),
        pagination: {
          page: 1,
          limit: tags.length,
          total: tags.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [tags, total] = await Promise.all([
      this.prisma.tag.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          _count: {
            select: {
              tool_tags: true,
            },
          },
        },
      }),
      this.prisma.tag.count({ where }),
    ]);

    return {
      tags: tags.map((tag: any) => ({
        ...tag,
        tool_count: tag._count.tool_tags,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }
}

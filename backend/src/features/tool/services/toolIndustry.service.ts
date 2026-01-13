import { z } from 'zod';
import {
  createToolIndustrySchema,
  updateToolIndustrySchema,
  getToolIndustriesQuerySchema,
} from '../validators/toolIndustry.validator.ts';
import { prisma } from '../../../config/index.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';

export class ToolIndustryService {
  private prisma: any;
  private activityService: ActivityService;

  constructor(prisma?: any) {
    this.prisma = prisma || prisma;
    this.activityService = new ActivityService();
  }

  async createToolIndustry(data: z.infer<typeof createToolIndustrySchema>, user_id: number) {
    const toolIndustry = await this.prisma.toolIndustry.create({ data });

    // Log activity
    await this.activityService.logActivity({
      title: 'Tool Industry Created',
      description: `Tool industry "${toolIndustry.name}" created`,
      icon: '🏭',
      user_id: user_id,
      entity_type: 'tool_industry',
      entity_name: toolIndustry.name,
    });

    return toolIndustry;
  }

  async getAllToolIndustries(query?: z.infer<typeof getToolIndustriesQuerySchema>) {
    if (!query) {
      return this.prisma.toolIndustry.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              tools: true,
            },
          },
        },
      });
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

    const [toolIndustries, total] = await Promise.all([
      this.prisma.toolIndustry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              tools: true,
            },
          },
        },
      }),
      this.prisma.toolIndustry.count({ where }),
    ]);

    return {
      data: toolIndustries,
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

  async getToolIndustryById(id: number) {
    return this.prisma.toolIndustry.findUnique({
      where: { id },
      include: {
        tools: {
          select: {
            id: true,
            name: true,
            short_description: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            tools: true,
          },
        },
      },
    });
  }

  async updateToolIndustry(
    id: number,
    data: z.infer<typeof updateToolIndustrySchema>,
    user_id: number
  ) {
    const toolIndustry = await this.prisma.toolIndustry.update({
      where: { id },
      data,
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Tool Industry Updated',
      description: `Tool industry "${toolIndustry.name}" updated`,
      icon: '✏️',
      user_id: user_id,
      entity_type: 'tool_industry',
      entity_name: toolIndustry.name,
    });

    return toolIndustry;
  }

  async deleteToolIndustry(id: number, user_id: number) {
    // Get tool industry info before deletion for activity logging
    const toolIndustry = await this.prisma.toolIndustry.findUnique({
      where: { id },
      select: { name: true },
    });

    const deletedToolIndustry = await this.prisma.toolIndustry.delete({
      where: { id },
    });

    // Log activity
    if (toolIndustry) {
      await this.activityService.logActivity({
        title: 'Tool Industry Deleted',
        description: `Tool industry "${toolIndustry.name}" deleted`,
        icon: '🗑️',
        user_id: user_id,
        entity_type: 'tool_industry',
        entity_name: toolIndustry.name,
      });
    }

    return deletedToolIndustry;
  }

  async toolIndustryExists(id: number): Promise<boolean> {
    const toolIndustry = await prisma.toolIndustry.findUnique({
      where: { id },
    });
    return !!toolIndustry;
  }

  /**
   * Find or create multiple tool industries by names
   */
  async findOrCreateToolIndustries(industryNames: string[]): Promise<number[]> {
    const industryIds: number[] = [];

    for (const name of industryNames) {
      if (name && name.trim()) {
        const industryId = await this.findOrCreateToolIndustry(name);
        industryIds.push(industryId);
      }
    }

    return industryIds;
  }

  /**
   * Find or create tool industry by name
   */
  async findOrCreateToolIndustry(industryName: string): Promise<number> {
    const existingIndustry = await prisma.toolIndustry.findFirst({
      where: { name: { equals: industryName.trim(), mode: 'insensitive' } },
    });

    if (existingIndustry) {
      return existingIndustry.id;
    }

    const newIndustry = await prisma.toolIndustry.create({
      data: { name: industryName.trim() },
    });

    return newIndustry.id;
  }
}

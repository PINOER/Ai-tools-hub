import { z } from 'zod';
import {
  createToolRoleSchema,
  updateToolRoleSchema,
  getToolRolesQuerySchema,
} from '../validators/toolRole.validator.ts';
import { prisma } from '../../../config/index.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';

export class ToolRoleService {
  private prisma: any;
  private activityService: ActivityService;

  constructor(prisma?: any) {
    this.prisma = prisma || prisma;
    this.activityService = new ActivityService();
  }

  async createToolRole(data: z.infer<typeof createToolRoleSchema>, user_id: number) {
    const toolRole = await this.prisma.toolRole.create({ data });

    // Log activity
    await this.activityService.logActivity({
      title: 'Tool Role Created',
      description: `Tool role "${toolRole.name}" created`,
      icon: '👥',
      user_id: user_id,
      entity_type: 'tool_role',
      entity_name: toolRole.name,
    });

    return toolRole;
  }

  async getAllToolRoles(query?: z.infer<typeof getToolRolesQuerySchema>) {
    if (!query) {
      return this.prisma.toolRole.findMany({
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

    const [toolRoles, total] = await Promise.all([
      this.prisma.toolRole.findMany({
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
      this.prisma.toolRole.count({ where }),
    ]);

    return {
      data: toolRoles,
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

  async getToolRoleById(id: number) {
    return this.prisma.toolRole.findUnique({
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

  async updateToolRole(id: number, data: z.infer<typeof updateToolRoleSchema>, user_id: number) {
    const toolRole = await this.prisma.toolRole.update({
      where: { id },
      data,
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Tool Role Updated',
      description: `Tool role "${toolRole.name}" updated`,
      icon: '✏️',
      user_id: user_id,
      entity_type: 'tool_role',
      entity_name: toolRole.name,
    });

    return toolRole;
  }

  async deleteToolRole(id: number, user_id: number) {
    // Get tool role info before deletion for activity logging
    const toolRole = await this.prisma.toolRole.findUnique({
      where: { id },
      select: { name: true },
    });

    const deletedToolRole = await this.prisma.toolRole.delete({
      where: { id },
    });

    // Log activity
    if (toolRole) {
      await this.activityService.logActivity({
        title: 'Tool Role Deleted',
        description: `Tool role "${toolRole.name}" deleted`,
        icon: '🗑️',
        user_id: user_id,
        entity_type: 'tool_role',
        entity_name: toolRole.name,
      });
    }

    return deletedToolRole;
  }

  async toolRoleExists(id: number): Promise<boolean> {
    const toolRole = await prisma.toolRole.findUnique({
      where: { id },
    });
    return !!toolRole;
  }

  /**
   * Find or create tool role by name
   */
  async findOrCreateToolRole(roleName: string): Promise<number> {
    const existingRole = await prisma.toolRole.findFirst({
      where: { name: { equals: roleName.trim(), mode: 'insensitive' } },
    });

    if (existingRole) {
      return existingRole.id;
    }

    const newRole = await prisma.toolRole.create({
      data: { name: roleName.trim() },
    });

    return newRole.id;
  }

  /**
   * Find or create multiple tool roles by names
   */
  async findOrCreateToolRoles(roleNames: string[]): Promise<number[]> {
    const roleIds: number[] = [];

    for (const name of roleNames) {
      if (name && name.trim()) {
        const roleId = await this.findOrCreateToolRole(name);
        roleIds.push(roleId);
      }
    }

    return roleIds;
  }
}

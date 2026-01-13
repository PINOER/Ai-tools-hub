import { RoleType, UserStatus, type User } from '@prisma/client';
import { hash } from 'bcrypt';

import { registerSchema } from '../validators/auth.validator.ts';
import { z } from 'zod';
import { updateUserSchema, getUsersQuerySchema } from '../validators/user.validator.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';
import { prisma } from '../../../config/index.ts';
import { generateToken } from '../../../utils/jwt.ts';

export class UserService {
  private activityService: ActivityService;

  constructor() {
    this.activityService = new ActivityService();
  }
  async createUser(data: z.infer<typeof registerSchema>) {
    const hashedPassword = data.password ? await hash(data.password, 10) : null;
    const role = data.role as RoleType;
    const role_id = await this.getRoleIdByRoleName(role);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email || '',
        password: hashedPassword || '',
        role_id,
        status: (data.status as UserStatus) || UserStatus.Active,
        avatar: data.avatar || null,

        bio: data.bio || null,
        moderation_notes: data.moderation_notes || null,
      },
    });

    // Log user registration activity
    await this.activityService.logUserRegistration(user.username, user.id);

    const token = generateToken(user, role);
    return { user, token };
  }

  async getUser(id: number, isAdmin: boolean = false): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          select: {
            role: true,
          },
        },
        reviews: {
          where: isAdmin ? undefined : { status: 'Approved' },
          select: {
            id: true,
            overall_rating: true,
            comment: true,
            status: true,
            created_at: true,
            tool: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            created_at: true,
          },
        },

        bookmarks: true,
        toolSubmissions: {
          select: {
            id: true,
            status: true,
            internal_notes: true,
            created_at: true,
            tool: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
            comments: true,
            toolSubmissions: true,
            tools: true,
            toolClaims: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(
    id: number,
    data: z.infer<typeof updateUserSchema>,
    authenticatedUserId: number
  ) {
    const updateData: any = { ...data };

    if (data.password) {
      updateData.password = await hash(data.password, 10);
    }

    if (data.role) {
      const role_id = await this.getRoleIdByRoleName(data.role as RoleType);
      updateData.role_id = role_id;
      // Remove the role field since we're using role_id
      delete updateData.role;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: {
          select: {
            role: true,
          },
        },
      },
    });

    // Log activity for user updates
    await this.activityService.logActivity({
      title: 'User Updated',
      description: `User ${user.username} updated`,
      icon: '✏️',
      user_id: authenticatedUserId,
      entity_type: 'user',
      entity_name: user.username,
      metadata: { updatedFields: Object.keys(data) },
    });

    return user;
  }

  async deleteUser(id: number, authenticatedUserId: number) {
    // Get user info before deletion for activity logging
    const user = await prisma.user.findUnique({
      where: { id },
      select: { username: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Delete all refresh tokens for the user first
    await prisma.refreshToken.deleteMany({
      where: { userId: id },
    });

    // Delete all API keys for the user
    await prisma.aPIKey.deleteMany({
      where: { user_id: id },
    });

    // Delete all password reset tokens for the user
    await prisma.passwordReset.deleteMany({
      where: { user_id: id },
    });

    // Finally delete the user
    await prisma.user.delete({
      where: { id },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'User Deleted',
      description: `User ${user.username} deleted`,
      icon: '🗑️',
      user_id: authenticatedUserId,
      entity_type: 'user',
      entity_name: user.username,
    });
  }

  async getAllUsers(query?: z.infer<typeof getUsersQuerySchema>) {
    if (!query) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          first_name: true,
          last_name: true,
          email: true,
          status: true,
          avatar: true,
          bio: true,
          provider: true,
          moderation_notes: true,
          created_at: true,
          updated_at: true,
          role: {
            select: {
              role: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      return {
        users,
        pagination: {
          page: 1,
          limit: users.length,
          total: users.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    const { page = 1, limit = 10, search, status, role } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (role) {
      const roleId = await this.getRoleIdByRoleName(role);
      where.role_id = roleId;
    }

    if (search) {
      where.OR = [
        {
          username: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          first_name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          last_name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          first_name: true,
          last_name: true,
          email: true,
          status: true,
          avatar: true,
          bio: true,
          provider: true,
          moderation_notes: true,
          created_at: true,
          updated_at: true,
          role: {
            select: {
              role: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
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

  async findByEmail(email: string) {
    return prisma.user.findFirst({ where: { email } });
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: { username },
      select: { id: true },
    });
    return !!user;
  }

  private async checkAllUsersExist(ids: number[]) {
    const foundUsers = await prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    const foundIds = new Set(foundUsers.map((u) => u.id));
    const missingIds = ids.filter((id) => !foundIds.has(id));
    if (missingIds.length > 0) {
      throw new Error(`User(s) not found: ${missingIds.join(', ')}`);
    }
  }

  async bulkUpdateStatus(users: { id: number; status: UserStatus }[]) {
    const ids = users.map((u) => u.id);
    await this.checkAllUsersExist(ids);
    const results = [];
    for (const { id, status } of users) {
      try {
        await prisma.user.update({ where: { id }, data: { status } });
        results.push({ id, status: 'updated' });
      } catch (error) {
        results.push({ id, error: (error as Error).message });
      }
    }
    return results;
  }

  async bulkDelete(ids: number[]) {
    await this.checkAllUsersExist(ids);
    const results = [];
    for (const id of ids) {
      try {
        await prisma.refreshToken.deleteMany({
          where: { userId: id },
        });
        await prisma.aPIKey.deleteMany({
          where: { user_id: id },
        });
        await prisma.passwordReset.deleteMany({
          where: { user_id: id },
        });

        await prisma.user.delete({ where: { id } });
        results.push({ id, status: 'deleted' });
      } catch (error) {
        results.push({ id, error: (error as Error).message });
      }
    }
    return results;
  }

  async updateUserPreferences(
    userId: number,
    preferences: {
      newsletter_subscribed?: boolean;
      email_notifications?: boolean;
      search_alerts?: boolean;
    }
  ) {
    const existingPreferences = await prisma.userPreferences.findUnique({
      where: { user_id: userId },
    });

    let userPreferences;
    if (existingPreferences) {
      userPreferences = await prisma.userPreferences.update({
        where: { user_id: userId },
        data: preferences,
      });
    } else {
      userPreferences = await prisma.userPreferences.create({
        data: {
          user_id: userId,
          ...preferences,
        },
      });
    }

    await this.activityService.logActivity({
      title: 'User Preferences Updated',
      description: `User preferences updated for user ID ${userId}`,
      icon: '⚙️',
      user_id: userId,
      entity_type: 'user_preferences',
      entity_name: `User ${userId} preferences`,
      metadata: { updatedFields: Object.keys(preferences) },
    });

    return userPreferences;
  }

  async getUserPreferences(userId: number) {
    const preferences = await prisma.userPreferences.findUnique({
      where: { user_id: userId },
    });

    if (!preferences) {
      return {
        newsletter_subscribed: true,
        email_notifications: true,
        search_alerts: true,
      };
    }

    return preferences;
  }

  private async getRoleIdByRoleName(role: RoleType): Promise<number> {
    const existingRole = await prisma.role.findUnique({
      where: { role },
    });

    if (!existingRole) {
      throw new Error(`Role ${role} does not exist`);
    }

    return existingRole.id;
  }
}

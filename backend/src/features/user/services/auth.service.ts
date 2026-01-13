import { UserService } from './user.service.ts';
import bcrypt from 'bcrypt';
import { prisma } from '@config/index.ts';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@utils/jwt.ts';
import { z } from 'zod';
import { registerSchema, socialLoginSchema } from '../validators/auth.validator.ts';
import { Provider, RoleType, UserStatus } from '@prisma/client';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(data: z.infer<typeof registerSchema>) {
    return this.userService.createUser(data);
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findFirst({
      where: { email, provider: Provider.Email },
      include: {
        role: true,
        reviews: {
          where: { status: 'Approved' },
          include: {
            tool: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        toolSubmissions: {
          include: {
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
            toolSubmissions: true,
            comments: true,
          },
        },
      },
    });

    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    if (!user.username) {
      throw new Error('User username is required for login');
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      accessToken,
      refreshToken,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      toolsSubmitted: user._count.toolSubmissions,
      reviews: user.reviews,
      comments: user._count.comments,
      activityHistory: [], // You can implement this later
      bio: user.bio || '',
      password: '', // Don't return actual password
      repeatPassword: '', // Don't return actual password
      moderation_notes: user.moderation_notes || '',
      sendWelcomeEmail: false, // You can implement this logic
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        throw new Error('Invalid refresh token');
      }

      const storedToken = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: decoded.id,
        },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new Error('Invalid or expired refresh token');
      }

      const payload = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      };

      const newAccessToken = generateAccessToken(payload);
      return { accessToken: newAccessToken };
    } catch {
      throw new Error('Refresh failed');
    }
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
    return { message: 'Logged out successfully' };
  }

  async socialLogin(data: z.infer<typeof socialLoginSchema>) {
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [{ provider: data.provider }, { provider_id: data.providerId }],
      },
      include: {
        role: true,
        reviews: {
          where: { status: 'Approved' },
          include: {
            tool: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        toolSubmissions: {
          include: {
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
            toolSubmissions: true,
            comments: true,
          },
        },
      },
    });

    if (existingUser) {
      if (!existingUser.username) {
        throw new Error('User username is required for authentication');
      }

      const payload = {
        id: existingUser.id,
        username: existingUser.username,
        role: existingUser.role.role,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: existingUser.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        id: existingUser.id,
        name: `${existingUser.first_name} ${existingUser.last_name}`,
        first_name: existingUser.first_name,
        last_name: existingUser.last_name,
        username: existingUser.username,
        email: existingUser.email,
        accessToken,
        refreshToken,
        role: existingUser.role,
        status: existingUser.status,
        avatar: existingUser.avatar,
        toolsSubmitted: existingUser._count.toolSubmissions,
        reviews: existingUser.reviews,
        comments: existingUser._count.comments,
        activityHistory: [],
        bio: existingUser.bio || '',
        password: '',
        repeatPassword: '',
        moderation_notes: existingUser.moderation_notes || '',
        sendWelcomeEmail: false,
      };
    }

    // Find the User role ID
    const userRole = await prisma.role.findUnique({
      where: { role: RoleType.User },
    });

    if (!userRole) {
      throw new Error('User role not found in database');
    }

    const newUser = await prisma.user.create({
      data: {
        username: data.providerId,
        first_name: data.first_name,
        last_name: data.last_name || '',
        email: data.email || '',
        password: '',
        role_id: userRole.id,
        status: UserStatus.Active,
        avatar: data.avatarUrl || '',
        provider: data.provider,
        provider_id: data.providerId,
        access_token: '',
      },
      include: {
        role: true,
        reviews: {
          where: { status: 'Approved' },
          include: {
            tool: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        toolSubmissions: {
          include: {
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
            toolSubmissions: true,
            comments: true,
          },
        },
      },
    });

    if (!newUser.username) {
      throw new Error('User username is required for authentication');
    }

    const payload = {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      id: newUser.id,
      name: `${newUser.first_name} ${newUser.last_name}`,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      username: newUser.username,
      email: newUser.email,
      accessToken,
      refreshToken,
      role: newUser.role,
      status: newUser.status,
      avatar: newUser.avatar,
      toolsSubmitted: newUser._count.toolSubmissions,
      reviews: newUser.reviews,
      comments: newUser._count.comments,
      activityHistory: [],
      bio: newUser.bio || '',
      password: '',
      repeatPassword: '',
      moderation_notes: newUser.moderation_notes || '',
      sendWelcomeEmail: false,
    };
  }
}

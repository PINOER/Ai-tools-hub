import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.ts';

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.createUser(req.validatedBody);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const isAdmin = req.isAdmin || false;
      const user = await this.userService.getUser(id, isAdmin);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const authenticatedUserId = req.user!.id;
      const user = await this.userService.updateUser(id, req.validatedBody, authenticatedUserId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const authenticatedUserId = req.user!.id;
      await this.userService.deleteUser(id, authenticatedUserId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.getAllUsers(req.validatedQuery);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.bulkUpdateStatus(req.validatedBody.users);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async bulkDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.bulkDelete(req.validatedBody.ids);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async checkUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.validatedBody;
      const exists = await this.userService.checkUsernameExists(username);
      res.status(200).json({
        username,
        exists,
        available: !exists,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id ?? 0;
      const preferences = await this.userService.updateUserPreferences(userId, req.validatedBody);
      res.status(200).json(preferences);
    } catch (error) {
      next(error);
    }
  }

  async getUserPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id ?? 0;
      const preferences = await this.userService.getUserPreferences(userId);
      res.status(200).json(preferences);
    } catch (error) {
      next(error);
    }
  }
}

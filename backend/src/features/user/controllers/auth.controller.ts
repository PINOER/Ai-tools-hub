import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.ts';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await this.authService.register(req.validatedBody);
      res.status(201).json({ user, token, success: true });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.validatedBody;
      const userData = await this.authService.login(email, password);
      res.status(200).json({
        ...userData,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
        return;
      }

      const { accessToken } = await this.authService.refresh(refreshToken);
      res.status(200).json({
        accessToken,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
        return;
      }

      await this.authService.logout(refreshToken);
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async socialLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await this.authService.socialLogin(req.validatedBody);
      res.status(200).json({
        ...userData,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}

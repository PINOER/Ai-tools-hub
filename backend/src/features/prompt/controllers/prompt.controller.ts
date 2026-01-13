import type { Request, Response, NextFunction } from 'express';
import { PromptService } from '../services/prompt.service.ts';
import { PromptChainService } from '../services/promptChain.service.ts';

export class PromptController {
  constructor(
    private promptService: PromptService,
    private promptChainService: PromptChainService
  ) {}

  async createPrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const prompt = await this.promptService.createPrompt(
        req.validatedBody,
        user.id,
        req.isAdmin || false
      );
      res.status(201).json({
        success: true,
        message: 'Prompt created successfully',
        data: prompt,
      });
    } catch (err) {
      next(err);
    }
  }

  async getPrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const prompt = await this.promptService.getPrompt(id);
      res.json({
        success: true,
        message: 'Prompt retrieved successfully',
        data: prompt,
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'Prompt not found') {
        res.status(404).json({
          success: false,
          message: 'Prompt not found',
        });
        return;
      }
      next(err);
    }
  }

  async getAllPrompts(req: Request, res: Response, next: NextFunction) {
    try {
      const prompts = await this.promptService.getAllPrompts(
        req.validatedQuery,
        req.isAdmin || false
      );
      res.json(prompts);
    } catch (err) {
      next(err);
    }
  }

  async updatePrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const user = req.user!;
      const updatedPrompt = await this.promptService.updatePrompt(
        id,
        req.validatedBody,
        user.id,
        req.isAdmin || false
      );
      res.json({
        success: true,
        message: 'Prompt updated successfully',
        data: updatedPrompt,
      });
    } catch (err) {
      next(err);
    }
  }

  async deletePrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const user = req.user!;
      const deletedPrompt = await this.promptService.deletePrompt(
        id,
        user.id,
        req.isAdmin || false
      );
      res.json({
        success: true,
        message: 'Prompt deleted successfully',
        data: deletedPrompt,
      });
    } catch (err) {
      next(err);
    }
  }

  async createPromptChain(req: Request, res: Response, next: NextFunction) {
    try {
      const { prompt_id } = req.validatedParams;
      const promptChain = await this.promptChainService.createPromptChain(
        prompt_id,
        req.validatedBody
      );
      res.status(201).json({
        success: true,
        message: 'Prompt chain created successfully',
        data: promptChain,
      });
    } catch (err) {
      next(err);
    }
  }

  async updatePromptChain(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const updatedPromptChain = await this.promptChainService.updatePromptChain(
        id,
        req.validatedBody
      );
      res.json({
        success: true,
        message: 'Prompt chain updated successfully',
        data: updatedPromptChain,
      });
    } catch (err) {
      next(err);
    }
  }

  async deletePromptChain(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validatedParams;
      const deletedPromptChain = await this.promptChainService.deletePromptChain(id);
      res.json({
        success: true,
        message: 'Prompt chain deleted successfully',
        data: deletedPromptChain,
      });
    } catch (err) {
      next(err);
    }
  }

  async bulkUpdatePromptStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.promptService.bulkUpdatePromptStatus(
        req.validatedBody,
        req.user!.id
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async bulkDeletePrompts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.promptService.bulkDeletePrompts(req.validatedBody);
      res.json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

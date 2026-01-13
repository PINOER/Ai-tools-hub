import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service.ts';
import {
  CreateCommentInput,
  UpdateCommentInput,
  UpdateCommentStatusInput,
} from '../validators/comment.validator.ts';

export class CommentController {
  constructor(private commentService: CommentService) {}

  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const comment = await this.commentService.createComment(
        req.body as CreateCommentInput,
        userId
      );
      res.status(201).json(comment);
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : 'Failed to create comment' });
    }
  }

  async getComments(req: Request, res: Response): Promise<void> {
    try {
      const {
        content_type,
        content_id,
        page = 1,
        limit = 10,
        status,
        user_id,
      } = req.validatedQuery;
      const isAdmin = req.isAdmin || false;
      const result = await this.commentService.getComments(
        {
          content_type,
          content_id,
          page,
          limit,
          status,
          user_id,
        },
        isAdmin
      );

      res.status(200).json(result);
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : 'Failed to get comments' });
    }
  }

  async getCommentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const comment = await this.commentService.getCommentById(parseInt(id));

      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }

      res.status(200).json(comment);
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : 'Failed to get comment' });
    }
  }

  async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const comment = await this.commentService.updateComment(
        parseInt(id),
        req.body as UpdateCommentInput,
        userId
      );

      res.status(200).json(comment);
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : 'Failed to update comment' });
    }
  }

  async updateCommentStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user!.id;

      const { id } = req.params;
      const comment = await this.commentService.updateCommentStatus(
        parseInt(id),
        req.body as UpdateCommentStatusInput,
        userId
      );

      res.status(200).json(comment);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Failed to update comment status',
      });
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user!.id;

      const { id } = req.params;
      await this.commentService.deleteComment(parseInt(id), userId, userId);

      res.status(204).send();
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : 'Failed to delete comment' });
    }
  }
}

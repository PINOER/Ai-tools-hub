import type { Request, Response, NextFunction } from 'express';
import { AwsService } from '../services/aws.service.ts';

export class AwsController {
  constructor(private awsService: AwsService) {}

  async generatePresignedUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageName } = req.validatedBody;
      const presignedUrl = await this.awsService.generatePresignedUrl(imageName);
      res.status(200).json({ presignedUrl });
    } catch (error) {
      next(error);
    }
  }
}

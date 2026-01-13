import { Router } from 'express';
import { AwsController } from '../controllers/aws.controller.ts';
import { AwsService } from '../services/aws.service.ts';
import { generatePresignedUrlSchema } from '../validators/aws.validator.ts';
import { validateRequest } from '@middleware/validation.middleware.ts';
import { authMiddleware } from '@middleware/auth.middleware.ts';

const router = Router();
const awsService = new AwsService();
const awsController = new AwsController(awsService);

/**
 * @swagger
 * tags:
 *   name: AWS
 *   description: AWS S3 presigned URL generation
 */

/**
 * @swagger
 * /aws/presigned-url:
 *   post:
 *     tags: [AWS]
 *     summary: Generate a presigned URL for S3 image upload
 *     description: Creates a secure presigned URL with timestamp for uploading images to S3
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageName
 *             properties:
 *               imageName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 pattern: '^[a-zA-Z0-9._-]+$'
 *                 description: Name of the image file (letters, numbers, dots, underscores, and hyphens only)
 *                 example: "example-image.jpg"
 *     responses:
 *       200:
 *         description: Presigned URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 presignedUrl:
 *                   type: string
 *                   format: uri
 *                   description: Secure presigned URL for S3 upload
 *                   example: "https://bucket.s3.amazonaws.com/uploads/1234567890-example-image.jpg?X-Amz-Algorithm=..."
 *       400:
 *         description: Validation error - invalid image name
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */

router.post(
  '/presigned-url',
  authMiddleware,
  validateRequest({ body: generatePresignedUrlSchema }),
  awsController.generatePresignedUrl.bind(awsController)
);

export default router;

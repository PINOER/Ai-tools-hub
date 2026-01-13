import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';
import { generatePresignedUrlSchema } from '../validators/aws.validator.ts';
import { promises as fs } from 'fs';

export class AwsService {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;
  private endpoint: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME!;
    this.region = process.env.AWS_REGION || 'us-east-1';

    // ✅ Explicit Linode endpoint (adjust region if needed)
    this.endpoint = `https://${this.region}.linodeobjects.com`;

    this.s3Client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async generatePresignedUrl(
    imageName: z.infer<typeof generatePresignedUrlSchema.shape.imageName>
  ) {
    const timestamp = Date.now();
    const key = `${timestamp}-${imageName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: 'image/*',
      ACL: 'public-read',
    });

    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    // ✅ Return both presigned URL and key
    return { presignedUrl, key };
  }

  /**
   * Upload file to S3
   */
  async uploadFile(
    filePath: string,
    key: string,
    contentType: string = 'text/csv'
  ): Promise<string> {
    try {
      const fileContent = await fs.readFile(filePath);

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileContent,
        ContentType: contentType,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);

      // Return the public URL
      return `${this.endpoint}/${this.bucketName}/${key}`;
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${(error as Error).message}`);
    }
  }

  /**
   * Upload file content directly to S3 without local file
   */
  async uploadFileContent(
    content: string | Buffer,
    key: string,
    contentType: string = 'text/csv'
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: content,
        ContentType: contentType,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);

      // Return the public URL
      return `${this.endpoint}/${this.bucketName}/${key}`;
    } catch (error) {
      throw new Error(`Failed to upload file content to S3: ${(error as Error).message}`);
    }
  }

  /**
   * Check if export file exists and is recent (less than 1 day old)
   */
  async checkRecentExportFile(entityType: string): Promise<{
    exists: boolean;
    key?: string;
    url?: string;
    isRecent: boolean;
    ageInHours?: number;
  }> {
    try {
      const prefix = `exports/${entityType.toLowerCase()}/`;

      // List all files with the entity type prefix
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
      });

      const response = await this.s3Client.send(command);

      if (!response.Contents || response.Contents.length === 0) {
        return { exists: false, isRecent: false };
      }

      // Sort files by last modified date (newest first)
      const sortedFiles = response.Contents.filter((obj) => obj.Key && obj.LastModified).sort(
        (a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0)
      );

      if (sortedFiles.length === 0) {
        return { exists: false, isRecent: false };
      }

      const latestFile = sortedFiles[0];
      const lastModified = latestFile.LastModified;

      if (!lastModified) {
        return { exists: false, isRecent: false };
      }

      // Calculate file age
      const now = new Date();
      const fileAge = now.getTime() - lastModified.getTime();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      const ageInHours = fileAge / (60 * 60 * 1000);

      const isRecent = fileAge < oneDayInMs;
      const url = `${this.endpoint}/${this.bucketName}/${latestFile.Key}`;

      return {
        exists: true,
        key: latestFile.Key!,
        url,
        isRecent,
        ageInHours: Math.round(ageInHours * 100) / 100, // Round to 2 decimal places
      };
    } catch {
      return { exists: false, isRecent: false };
    }
  }
}

import { ClaimStatus, CategoryType, ToolStatus } from '@prisma/client';
import type { ToolSubmission } from '@prisma/client';
import { z } from 'zod';
import {
  getToolSubmissionsQuerySchema,
  bulkToolSubmissionReviewSchema,
} from '../validators/toolSubmission.validator.ts';
import { prisma } from '../../../config/index.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';
import { NotificationService } from '../../notification/services/notification.service.ts';

export class ToolSubmissionService {
  private prisma: any;
  private activityService: ActivityService;
  private notificationService: NotificationService;

  constructor(prisma?: any) {
    this.prisma = prisma || prisma;
    this.activityService = new ActivityService();
    this.notificationService = new NotificationService();
  }

  // Map ClaimStatus to ToolStatus
  private mapSubmissionStatusToToolStatus(claimStatus: ClaimStatus): ToolStatus {
    const statusMap: Record<ClaimStatus, ToolStatus> = {
      Pending: 'Pending',
      Approved: 'Approved',
      Rejected: 'Rejected',
    };
    return statusMap[claimStatus];
  }

  async createToolSubmission(
    data: {
      tool_id: number;
      user_id: number;
    },
    tx: any = this.prisma
  ): Promise<ToolSubmission> {
    // Check tool using existing tool service method
    const tool = await tx.tool.findUnique({
      where: { id: data.tool_id },
      select: { id: true, status: true, name: true },
    });

    if (!tool) {
      throw new Error('Tool not found');
    }
    //find user who submitted the tool
    const toolSubmitter = await tx.user.findUnique({
      where: { id: data.user_id },
      select: { id: true, role: true },
    });

    // Prevent submission if tool is already approved
    if (tool.status === 'Approved' && toolSubmitter?.role.role !== 'Admin') {
      throw new Error('Cannot create submission for an already approved tool');
    }

    const existingSubmission = await tx.toolSubmission.findFirst({
      where: {
        tool_id: data.tool_id,
        user_id: data.user_id,
      },
    });

    if (existingSubmission) {
      throw new Error('You have already submitted this tool');
    }

    const submission = await tx.toolSubmission.create({
      data: {
        tool_id: data.tool_id,
        user_id: data.user_id,
        status: toolSubmitter?.role.role === 'Admin' ? ToolStatus.Approved : ToolStatus.Pending,
      },
    });

    // If the tool submitter is an admin, return the submission without notifying admins
    if (toolSubmitter?.role.role === 'Admin') {
      return submission;
    }

    // Notify all admins about new tool submission
    const admins = await tx.user.findMany({
      where: {
        role: {
          role: 'Admin',
        },
      },
      select: { id: true },
    });

    for (const admin of admins) {
      await this.notificationService.createNotification({
        user_id: admin.id,
        type: 'ToolSubmission',
        title: 'New Tool Submission',
        message: `A new tool "${tool.name}" has been submitted for review`,
        action_url: `/ai-tools/${tool.id}`,
        entity_type: 'tool',
        entity_id: tool.id,
      });
    }

    return submission;
  }

  async getToolSubmission(id: number): Promise<ToolSubmission | null> {
    const submission = await this.prisma.toolSubmission.findUnique({
      where: { id },
      include: {
        tool: {
          select: {
            id: true,
            name: true,
            avatar: true,
            website_url: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!submission) {
      throw new Error('Tool submission not found');
    }

    return submission;
  }

  async getAllSubmissions(query?: z.infer<typeof getToolSubmissionsQuerySchema>) {
    if (!query) {
      return this.prisma.toolSubmission.findMany({
        include: {
          tool: {
            select: {
              id: true,
              name: true,
              avatar: true,
              website_url: true,
              status: true,
              tool_categories: {
                include: {
                  category: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    }

    const { page = 1, limit = 10, status, tool_id } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (tool_id) {
      where.tool_id = tool_id;
    }

    const [submissions, total] = await Promise.all([
      this.prisma.toolSubmission.findMany({
        where,
        skip,
        take: limit,
        include: {
          tool: {
            select: {
              id: true,
              name: true,
              avatar: true,
              website_url: true,
              status: true,
              tool_categories: {
                where: {
                  type: CategoryType.Primary,
                },
                include: {
                  category: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.toolSubmission.count({ where }),
    ]);

    return {
      submissions,
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

  async updateToolSubmissionStatus(
    id: number,
    data: { status: string; internal_notes?: string },
    user_id: number
  ): Promise<ToolSubmission> {
    return await this.prisma.$transaction(async (tx: any) => {
      const existingSubmission = await tx.toolSubmission.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          tool_id: true,
          user_id: true,
          tool: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!existingSubmission) {
        throw new Error('Tool submission not found');
      }

      const updatedSubmission = await tx.toolSubmission.update({
        where: { id },
        data: {
          status: data.status,
          internal_notes: data.internal_notes,
          updated_at: new Date(),
        },
      });

      // Update the tool status to match the submission status
      const toolStatus = this.mapSubmissionStatusToToolStatus(data.status as any);
      await tx.tool.update({
        where: { id: existingSubmission.tool_id },
        data: {
          status: toolStatus,
          updated_at: new Date(),
        },
      });

      // Log activity
      await this.activityService.logActivity({
        title: 'Tool Submission Status Updated',
        description: `Tool submission ${id} status updated to ${data.status}`,
        icon: '📝',
        user_id: user_id,
        entity_type: 'tool_submission',
        entity_name: `Submission ${id}`,
      });

      // Notify the user who submitted the tool about the status change
      if (existingSubmission.user_id) {
        if (data.status === 'Approved') {
          await this.notificationService.notifyContentAction({
            entityType: 'tool',
            entityId: existingSubmission.tool_id,
            entityName: existingSubmission.tool.name,
            userId: existingSubmission.user_id,
            action: 'approved',
          });
        } else if (data.status === 'Rejected') {
          await this.notificationService.notifyContentAction({
            entityType: 'tool',
            entityId: existingSubmission.tool_id,
            entityName: existingSubmission.tool.name,
            userId: existingSubmission.user_id,
            action: 'rejected',
            reason: data.internal_notes,
          });
        }
      }

      return updatedSubmission;
    });
  }

  async deleteToolSubmission(id: number, user_id: number): Promise<void> {
    const submission = await this.prisma.toolSubmission.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!submission) {
      throw new Error('Tool submission not found');
    }

    await this.prisma.toolSubmission.delete({
      where: { id },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Tool Submission Deleted',
      description: `Tool submission ${id} deleted`,
      icon: '🗑️',
      user_id: user_id,
      entity_type: 'tool_submission',
      entity_name: `Submission ${id}`,
    });
  }

  static async toolSubmissionExists(id: number): Promise<boolean> {
    const submission = await prisma.toolSubmission.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!submission;
  }

  async bulkApproveSubmissions(data: z.infer<typeof bulkToolSubmissionReviewSchema>) {
    return await this.prisma.$transaction(async (tx: any) => {
      const submissionIds = data.submissions.map((submission: any) => submission.id);

      const existingSubmissions = await tx.toolSubmission.findMany({
        where: { id: { in: submissionIds } },
        select: {
          id: true,
          status: true,
          user_id: true,
          tool: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
      });

      const existingSubmissionIds = new Set(
        existingSubmissions.map((submission: any) => submission.id)
      );
      const missingSubmissionIds = submissionIds.filter(
        (id: number) => !existingSubmissionIds.has(id)
      );
      if (missingSubmissionIds.length > 0) {
        throw new Error(`Invalid submission IDs: ${missingSubmissionIds.join(', ')}`);
      }

      // Validate tools for approval
      for (const submission of data.submissions) {
        const existingSubmission = existingSubmissions.find((s: any) => s.id === submission.id);
        if (!existingSubmission) continue;

        if (
          submission.status === ClaimStatus.Approved &&
          existingSubmission.tool.status === ToolStatus.Approved
        ) {
          throw new Error(
            `Tool ${existingSubmission.tool.name} (id: ${existingSubmission.tool.id}) is already approved`
          );
        }
      }

      const results = [];

      for (const submission of data.submissions) {
        const toolSubmission = existingSubmissions.find((s: any) => s.id === submission.id);
        if (!toolSubmission) continue;

        // Update the submission
        const updatedSubmission = await tx.toolSubmission.update({
          where: { id: submission.id },
          data: {
            status: submission.status,
            internal_notes: submission.internal_notes,
            updated_at: new Date(),
          },
        });

        // Update the tool status
        const toolStatus = this.mapSubmissionStatusToToolStatus(submission.status);
        await tx.tool.update({
          where: { id: toolSubmission.tool.id },
          data: {
            status: toolStatus,
            updated_at: new Date(),
          },
        });

        // Notify the user who submitted the tool
        if (toolSubmission.user_id) {
          if (submission.status === ClaimStatus.Approved) {
            await this.notificationService.notifyContentAction({
              entityType: 'tool',
              entityId: toolSubmission.tool.id,
              entityName: toolSubmission.tool.name,
              userId: toolSubmission.user_id,
              action: 'approved',
            });
          } else if (submission.status === ClaimStatus.Rejected) {
            await this.notificationService.notifyContentAction({
              entityType: 'tool',
              entityId: toolSubmission.tool.id,
              entityName: toolSubmission.tool.name,
              userId: toolSubmission.user_id,
              action: 'rejected',
              reason: submission.internal_notes,
            });
          }
        }

        results.push(updatedSubmission);
      }

      return results;
    });
  }

  async bulkRejectSubmissions(data: z.infer<typeof bulkToolSubmissionReviewSchema>) {
    return await this.prisma.$transaction(async (tx: any) => {
      const submissionIds = data.submissions.map((submission: any) => submission.id);

      const existingSubmissions = await tx.toolSubmission.findMany({
        where: { id: { in: submissionIds } },
        select: {
          id: true,
          status: true,
          tool: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
      });

      const existingSubmissionIds = new Set(
        existingSubmissions.map((submission: any) => submission.id)
      );
      const missingSubmissionIds = submissionIds.filter(
        (id: number) => !existingSubmissionIds.has(id)
      );
      if (missingSubmissionIds.length > 0) {
        throw new Error(`Invalid submission IDs: ${missingSubmissionIds.join(', ')}`);
      }

      const results = [];

      for (const submission of data.submissions) {
        const toolSubmission = existingSubmissions.find((s: any) => s.id === submission.id);
        if (!toolSubmission) continue;

        // Update the submission
        const updatedSubmission = await tx.toolSubmission.update({
          where: { id: submission.id },
          data: {
            status: submission.status,
            internal_notes: submission.internal_notes,
            updated_at: new Date(),
          },
        });

        // Update the tool status
        const toolStatus = this.mapSubmissionStatusToToolStatus(submission.status);
        await tx.tool.update({
          where: { id: toolSubmission.tool.id },
          data: {
            status: toolStatus,
            updated_at: new Date(),
          },
        });

        results.push(updatedSubmission);
      }

      return results;
    });
  }

  async bulkDeleteSubmissions(data: z.infer<typeof bulkToolSubmissionReviewSchema>) {
    return await this.prisma.$transaction(async (tx: any) => {
      const submissionIds = data.submissions.map((submission: any) => submission.id);

      const existingSubmissions = await tx.toolSubmission.findMany({
        where: { id: { in: submissionIds } },
        select: { id: true },
      });

      if (existingSubmissions.length !== submissionIds.length) {
        const existingIds = existingSubmissions.map((submission: any) => submission.id);
        const missingIds = submissionIds.filter((id: number) => !existingIds.includes(id));
        throw new Error(`Invalid submission IDs: ${missingIds.join(', ')}`);
      }

      const deletedSubmissions = await tx.toolSubmission.deleteMany({
        where: { id: { in: submissionIds } },
      });

      return {
        deletedCount: deletedSubmissions.count,
        deletedIds: submissionIds,
      };
    });
  }

  async bulkUpdateSubmissionStatus(data: { submissionIds: number[]; status: string }) {
    return await this.prisma.$transaction(async (tx: any) => {
      const submissionIds = data.submissionIds;
      const newStatus = data.status;

      const existingSubmissions = await tx.toolSubmission.findMany({
        where: { id: { in: submissionIds } },
        select: { id: true, tool_id: true },
      });

      if (existingSubmissions.length !== submissionIds.length) {
        const existingIds = existingSubmissions.map((submission: any) => submission.id);
        const missingIds = submissionIds.filter((id: number) => !existingIds.includes(id));
        throw new Error(`Invalid submission IDs: ${missingIds.join(', ')}`);
      }

      // Update all submissions
      await tx.toolSubmission.updateMany({
        where: { id: { in: submissionIds } },
        data: {
          status: newStatus,
          updated_at: new Date(),
        },
      });

      // Update tool statuses
      const toolStatus = this.mapSubmissionStatusToToolStatus(newStatus as any);
      const toolIds = existingSubmissions.map((submission: any) => submission.tool_id);

      await tx.tool.updateMany({
        where: { id: { in: toolIds } },
        data: {
          status: toolStatus,
          updated_at: new Date(),
        },
      });

      return {
        updatedCount: submissionIds.length,
        updatedIds: submissionIds,
        newStatus,
        toolStatus,
      };
    });
  }
}

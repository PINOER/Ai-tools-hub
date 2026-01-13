import { z } from 'zod';

import {
  createToolClaimSchema,
  updateToolClaimReviewSchema,
  updateToolClaimSchema,
  bulkToolClaimReviewSchema,
  bulkDeleteToolClaimsSchema,
} from '../validators/toolClaim.validator.ts';
import { CategoryType, ClaimStatus } from '@prisma/client';
import { ActivityService } from '../../activity/services/activity.service.ts';
import { prisma } from '../../../config/index.ts';

export class ToolClaimService {
  private activityService: ActivityService;

  constructor() {
    this.activityService = new ActivityService();
  }
  async create(data: z.infer<typeof createToolClaimSchema>, tool_id: number, user_id: number) {
    // Check tool status first
    const tool = await prisma.tool.findUnique({
      where: { id: tool_id },
      select: { id: true, status: true, is_claimed: true },
    });

    if (!tool) {
      throw new Error('Tool not found');
    }

    if (tool.is_claimed) {
      throw new Error('Tool is already claimed');
    }

    const existingClaim = await prisma.toolClaim.findFirst({
      where: {
        tool_id,
        claimant_id: user_id,
      },
    });

    if (existingClaim) {
      throw new Error('You have already claimed this tool');
    }

    return prisma.toolClaim.create({
      data: {
        ...data,
        claimant_id: user_id,
        tool_id,
      },
    });
  }

  async update(id: number, data: z.infer<typeof updateToolClaimSchema>, user_id: number) {
    const cleanData = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));

    const toolClaim = await prisma.toolClaim.update({
      where: { id },
      data: cleanData,
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Tool Claim Updated',
      description: `Tool claim ${id} updated`,
      icon: '✏️',
      user_id: user_id,
      entity_type: 'tool_claim',
      entity_name: `Claim ${id}`,
    });

    return toolClaim;
  }

  async approveClaim(
    id: number,
    data: z.infer<typeof updateToolClaimReviewSchema>,
    user_id: number
  ) {
    return await prisma.$transaction(async (tx) => {
      // Get the tool claim first
      const toolClaim = await tx.toolClaim.findUnique({
        where: { id },
        select: {
          status: true,
          tool_id: true,
          claimant_id: true,
          tool: {
            select: {
              id: true,
              name: true,
              is_claimed: true,
            },
          },
        },
      });

      if (!toolClaim) {
        throw new Error('Tool claim not found');
      }

      // Now you can check tool's claimed status
      if (toolClaim.tool.is_claimed) {
        throw new Error(
          `Tool ${toolClaim.tool.name} (id: ${toolClaim.tool.id}) is already claimed`
        );
      }

      // Update the claim status
      const updatedClaim = await tx.toolClaim.update({
        where: { id },
        data,
      });

      if (data.status === ClaimStatus.Approved) {
        await tx.tool.update({
          where: { id: toolClaim.tool_id },
          data: {
            is_claimed: true,
            updated_at: new Date(),
          } as any,
        });

        // Log activity for claim approval
        await this.activityService.logActivity({
          title: 'Tool Claim Approved',
          description: `Tool claim for "${toolClaim.tool.name}" approved`,
          icon: '✅',
          user_id: user_id,
          entity_type: 'tool_claim',
          entity_name: `Claim ${id}`,
        });
      }

      return updatedClaim;
    });
  }

  async getClaims(
    isAdmin: boolean,
    userId: number,
    status?: ClaimStatus,
    page: number = 1,
    limit: number = 10
  ) {
    const where: any = {};
    const skip = (page - 1) * limit;

    if (status) {
      where.status = status;
    }

    if (!isAdmin) {
      where.claimant_id = userId;
    }

    const [claims, total] = await Promise.all([
      prisma.toolClaim.findMany({
        where,
        skip,
        take: limit,
        include: {
          tool: {
            include: {
              tool_categories: {
                where: { type: CategoryType.Primary },
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
          user: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.toolClaim.count({ where }),
    ]);

    return {
      claims,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteClaim(id: number, user_id: number) {
    return await prisma.$transaction(async (tx) => {
      // Get the tool claim first to check if it was approved
      const toolClaim = await tx.toolClaim.findUnique({
        where: { id },
        select: { tool_id: true, status: true },
      });

      if (!toolClaim) {
        throw new Error('Tool claim not found');
      }

      // Delete the claim
      const deletedClaim = await tx.toolClaim.delete({ where: { id } });

      // Log activity
      await this.activityService.logActivity({
        title: 'Tool Claim Deleted',
        description: `Tool claim ${id} deleted`,
        icon: '🗑️',
        user_id: user_id,
        entity_type: 'tool_claim',
        entity_name: `Claim ${id}`,
      });

      return deletedClaim;
    });
  }

  async bulkApproveClaims(data: z.infer<typeof bulkToolClaimReviewSchema>) {
    return await prisma.$transaction(async (tx) => {
      const claimIds = data.claims.map((claim) => claim.id);

      const existingClaims = await tx.toolClaim.findMany({
        where: { id: { in: claimIds } },
        select: {
          id: true,
          status: true,
          tool: {
            select: {
              id: true,
              name: true,
              is_claimed: true,
            },
          },
        },
      });

      const existingClaimIds = new Set(existingClaims.map((claim) => claim.id));
      const missingClaimIds = claimIds.filter((id) => !existingClaimIds.has(id));
      if (missingClaimIds.length > 0) {
        throw new Error(`Invalid claim IDs: ${missingClaimIds.join(', ')}`);
      }

      // Validate tools for approval
      for (const claim of data.claims) {
        const existingClaim = existingClaims.find((c) => c.id === claim.id);
        if (!existingClaim) continue;

        if (claim.status === ClaimStatus.Approved && existingClaim.tool.is_claimed) {
          throw new Error(
            `Tool ${existingClaim.tool.name} (id: ${existingClaim.tool.id}) is already claimed`
          );
        }
      }

      const results = [];

      for (const claim of data.claims) {
        const toolClaim = existingClaims.find((c) => c.id === claim.id);
        if (!toolClaim) continue;

        // Update the claim
        const updatedClaim = await tx.toolClaim.update({
          where: { id: claim.id },
          data: {
            status: claim.status,
            review_notes: claim.review_notes,
          },
        });

        // Update tool only if APPROVED
        if (claim.status === ClaimStatus.Approved) {
          await tx.tool.update({
            where: { id: toolClaim.tool.id },
            data: {
              is_claimed: true,
              updated_at: new Date(),
            },
          });
        }

        results.push(updatedClaim);
      }

      return {
        success: results,
        processed: results.length,
        failed: 0,
        errors: [],
      };
    });
  }

  async bulkDeleteClaims(data: z.infer<typeof bulkDeleteToolClaimsSchema>) {
    return await prisma.$transaction(async (tx) => {
      const { claim_ids } = data;

      // Check if all claims exist
      const existingClaims = await tx.toolClaim.findMany({
        where: {
          id: {
            in: claim_ids,
          },
        },
        select: {
          id: true,
          tool_id: true,
          status: true,
          tool: {
            select: {
              id: true,
              name: true,
              is_claimed: true,
            },
          },
        },
      });

      const existingIds = existingClaims.map((claim) => claim.id);
      const missingIds = claim_ids.filter((id) => !existingIds.includes(id));

      if (missingIds.length > 0) {
        throw new Error(`Claims not found: ${missingIds.join(', ')}`);
      }

      // Delete all claims
      await tx.toolClaim.deleteMany({
        where: {
          id: {
            in: claim_ids,
          },
        },
      });

      return {
        deletedCount: claim_ids.length,
        deletedIds: claim_ids,
      };
    });
  }
}

import { CategoryType, ModerationStatus } from '@prisma/client';
import { z } from 'zod';
import { getGlossaryTermsQuerySchema } from '../validators/glossary.validator.ts';
import { prisma } from '../../../config/index.ts';
import { TagService } from '../../tag/services/tag.service.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';
import { getEmbedding } from '@utils/utils.ts';

export class GlossaryService {
  private tagService: TagService;
  private activityService: ActivityService;
  private prisma: any;

  constructor(prisma?: any) {
    this.prisma = prisma || prisma;
    this.tagService = new TagService(prisma);
    this.activityService = new ActivityService();
  }
  async createTerm(data: any) {
    const { category_id, related_terms, secondary_category_ids = [], tags, ...termData } = data;

    const termNameExists = await this.termNameExists(termData.term);
    if (termNameExists) {
      throw new Error('Term name already exists');
    }

    return this.prisma.$transaction(async (tx: any) => {
      const term = await tx.glossaryTerm.create({
        data: termData,
      });

      const sourceText = `${termData.term} ${termData.definition}`;
      const embedding = await getEmbedding(sourceText).catch((err) => {
        console.log('error saving embeddings at createTerm', err);
        return null;
      });
      if (embedding) {
        await tx.$executeRawUnsafe(
          `UPDATE "GlossaryTerm" SET embedding = $1::vector WHERE id = $2`,
          embedding,
          term.id
        );
      }

      await tx.glossaryTermCategory.create({
        data: {
          glossary_term_id: term.id,
          category_id: category_id,
          type: CategoryType.Primary,
        },
      });

      for (const secCatId of secondary_category_ids) {
        await tx.glossaryTermCategory.create({
          data: {
            glossary_term_id: term.id,
            category_id: secCatId,
            type: CategoryType.Secondary,
          },
        });
      }

      // Handle tags
      if (tags && tags.length > 0) {
        const tagIds = await this.tagService.getOrCreateTags(tags, tx);
        for (const tagId of tagIds) {
          await tx.glossaryTag.create({
            data: {
              glossary_id: term.id,
              tag_id: tagId,
            },
          });
        }
      }

      if (related_terms) {
        for (const relatedTermId of related_terms) {
          await tx.glossaryTermRelation.create({
            data: {
              term_id: term.id,
              related_id: relatedTermId,
            },
          });
        }
      }

      // Log activity
      await this.activityService.logContentCreated('Glossary', term.term, term.user_id);

      return term;
    });
  }

  async getAllTerms(query: z.infer<typeof getGlossaryTermsQuerySchema>, isAdmin: boolean) {
    const { page, limit, sort_by, ...filterQuery } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    let orderBy: any = {};

    if (filterQuery.category_id) {
      where.glossary_categories = {
        some: {
          category_id: filterQuery.category_id,
          type: CategoryType.Primary,
        },
      };
    }

    if (filterQuery.status) {
      where.status = filterQuery.status;
    }

    if (filterQuery.moderation_status) {
      where.moderation_status = filterQuery.moderation_status;
    }

    if (filterQuery.source) {
      where.source = filterQuery.source;
    }

    if (filterQuery.is_featured !== undefined) {
      where.is_featured = filterQuery.is_featured;
    }

    if (!isAdmin) {
      where.status = 'Published';
      where.moderation_status = 'Approved';
    }
    if (sort_by) {
      orderBy = {
        term: sort_by,
      };
    } else {
      orderBy = {
        created_at: 'desc',
      };
    }

    if (filterQuery.search) {
      where.OR = [
        { term: { contains: filterQuery.search, mode: 'insensitive' } },
        { definition: { contains: filterQuery.search, mode: 'insensitive' } },
        {
          glossaryTags: {
            some: {
              tag: {
                name: { contains: filterQuery.search, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    const [terms, total] = await Promise.all([
      this.prisma.glossaryTerm.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              email: true,
              avatar: true,
            },
          },
          glossary_categories: {
            include: {
              category: true,
            },
          },
          glossaryTags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy,
      }),
      this.prisma.glossaryTerm.count({ where }),
    ]);

    return {
      terms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTerm(id: number) {
    const term = await this.prisma.glossaryTerm.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            email: true,
            avatar: true,
          },
        },
        glossary_categories: {
          include: {
            category: true,
          },
        },
        glossaryTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!term) {
      throw new Error('Glossary term not found');
    }

    return term;
  }

  static async termExists(id: number): Promise<boolean> {
    const term = await prisma.glossaryTerm.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!term;
  }

  async termNameExists(termName: string, excludeId?: number): Promise<boolean> {
    const where: any = {
      term: {
        equals: termName,
        mode: 'insensitive',
      },
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existingTerm = await this.prisma.glossaryTerm.findFirst({
      where,
      select: { id: true },
    });

    return !!existingTerm;
  }

  async updateTerm(id: number, data: any, authenticatedUserId: number) {
    const { category_id, secondary_category_ids = [], tags, ...termData } = data;

    return this.prisma.$transaction(async (tx: any) => {
      const term = await tx.glossaryTerm.update({
        where: { id },
        data: termData,
      });

      if (termData.term || termData.definition) {
        // update embeddings
        const sourceText = `${termData.term ?? ''} ${termData.definition ?? ''}`;
        const embedding = await getEmbedding(sourceText).catch((err) => {
          console.log('error saving embeddings at updateTerm', err);
          return null;
        });
        if (embedding) {
          await tx.$executeRawUnsafe(
            `UPDATE "GlossaryTerm" SET embedding = $1::vector WHERE id = $2`,
            embedding,
            id
          );
        }
      }

      if (category_id) {
        await tx.glossaryTermCategory.deleteMany({
          where: {
            glossary_term_id: id,
            type: CategoryType.Primary,
          },
        });

        await tx.glossaryTermCategory.create({
          data: {
            glossary_term_id: id,
            category_id: category_id,
            type: CategoryType.Primary,
          },
        });
      }

      if (secondary_category_ids && Array.isArray(secondary_category_ids)) {
        // Remove all existing secondary links for this term
        await tx.glossaryTermCategory.deleteMany({
          where: {
            glossary_term_id: id,
            type: CategoryType.Secondary,
          },
        });

        // Add new secondary links
        for (const secCatId of secondary_category_ids) {
          await tx.glossaryTermCategory.create({
            data: {
              glossary_term_id: id,
              category_id: secCatId,
              type: CategoryType.Secondary,
            },
          });
        }
      }

      // Handle tags
      if (tags !== undefined) {
        // Delete existing tags
        await tx.glossaryTag.deleteMany({
          where: { glossary_id: id },
        });

        // Create new tags
        if (tags && tags.length > 0) {
          const tagIds = await this.tagService.getOrCreateTags(tags, tx);
          for (const tagId of tagIds) {
            await tx.glossaryTag.create({
              data: {
                glossary_id: id,
                tag_id: tagId,
              },
            });
          }
        }
      }

      // Log activity for status changes
      if (data.status === 'Published') {
        await this.activityService.logContentPublished('Glossary', term.term, authenticatedUserId);
      }
      if (data.is_featured === true) {
        await this.activityService.logActivity({
          title: 'Glossary Featured',
          description: `${term.term} featured`,
          icon: '⭐',
          user_id: authenticatedUserId,
          entity_type: 'glossary',
          entity_name: term.term,
        });
      }

      return term;
    });
  }

  async deleteTerm(id: number, authenticatedUserId: number) {
    return this.prisma.$transaction(async (tx: any) => {
      // Get term info before deletion for activity logging
      const term = await tx.glossaryTerm.findUnique({
        where: { id },
        select: { term: true, user_id: true },
      });

      if (!term) {
        throw new Error('Glossary term not found');
      }

      // Delete related term categories first
      await tx.glossaryTermCategory.deleteMany({
        where: { glossary_term_id: id },
      });

      // Delete related tags
      await tx.glossaryTag.deleteMany({
        where: { glossary_id: id },
      });

      // Delete term relations
      await tx.glossaryTermRelation.deleteMany({
        where: {
          OR: [{ related_id: id }],
        },
      });

      // Delete the term
      const deletedTerm = await tx.glossaryTerm.delete({
        where: { id },
      });

      // Log activity
      await this.activityService.logContentDeleted('Glossary', term.term, authenticatedUserId);

      return deletedTerm;
    });
  }

  async createRelation(data: any) {
    const { term_id, related_term_id } = data;

    const [term, relatedTerm] = await Promise.all([
      this.prisma.glossaryTerm.findUnique({ where: { id: term_id } }),
      this.prisma.glossaryTerm.findUnique({ where: { id: related_term_id } }),
    ]);

    if (!term || !relatedTerm) {
      throw new Error('One or both terms not found');
    }

    const existingRelation = await this.prisma.glossaryTermRelation.findFirst({
      where: {
        OR: [
          {
            term_id: term_id,
            related_id: related_term_id,
          },
          {
            term_id: related_term_id,
            related_id: term_id,
          },
        ],
      },
    });

    if (existingRelation) {
      throw new Error('Relation already exists between these terms');
    }

    return this.prisma.glossaryTermRelation.create({
      data: {
        related_id: related_term_id,
        term_id: term_id,
      },
    });
  }

  async createEditSubmission(data: any, user_id: number) {
    return this.prisma.glossaryEditSubmission.create({ data: { ...data, user_id } });
  }

  async getAllEditSubmissions(query: any, user_id: number, isAdmin: boolean) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (!isAdmin) {
      where.user_id = user_id;
    }
    return this.prisma.glossaryEditSubmission.findMany({ where });
  }

  async bulkUpdateEditStatus(ids: number[], status: ModerationStatus, authenticatedUserId: number) {
    const edits = await this.prisma.glossaryEditSubmission.findMany({ where: { id: { in: ids } } });

    if (edits.length !== ids.length) {
      const foundIds = edits.map((edit: any) => edit.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));
      throw new Error(`Invalid edit submission IDs: ${missingIds.join(', ')}`);
    }

    return this.prisma.$transaction(async (tx: any) => {
      await tx.glossaryEditSubmission.updateMany({ where: { id: { in: ids } }, data: { status } });

      if (status === ModerationStatus.Approved) {
        for (const edit of edits) {
          await tx.glossaryTerm.update({
            where: { id: edit.glossary_term_id },
            data: {
              term: edit.term,
              definition: edit.definition,
              moderation_status: status,
            },
          });
        }
      } else {
        await tx.glossaryTerm.updateMany({
          where: { id: { in: edits.map((e: any) => e.glossary_term_id) } },
          data: { moderation_status: status },
        });
      }

      // Log activity for each edit
      for (const edit of edits) {
        await this.activityService.logActivity({
          title: 'Glossary Edit Status Updated',
          description: `Glossary edit submission status updated to ${status}`,
          icon: '📝',
          user_id: authenticatedUserId,
          reference_id: edit.glossary_term_id,
          entity_type: 'glossary',
          entity_name: edit.term,
        });
      }

      return edits;
    });
  }

  async bulkUpdateStatus(
    ids: number[],
    moderation_status: ModerationStatus,
    authenticatedUserId: number
  ) {
    const terms = await this.prisma.glossaryTerm.findMany({ where: { id: { in: ids } } });

    if (terms.length !== ids.length) {
      const foundIds = terms.map((term: any) => term.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));
      throw new Error(`Invalid glossary term IDs: ${missingIds.join(', ')}`);
    }

    await this.prisma.glossaryTerm.updateMany({
      where: { id: { in: ids } },
      data: { moderation_status },
    });

    // Log activity for each term
    for (const term of terms) {
      await this.activityService.logActivity({
        title: 'Glossary Term Status Updated',
        description: `Glossary term "${term.term}" moderation status updated to ${moderation_status}`,
        icon: '📝',
        user_id: authenticatedUserId,
        reference_id: term.id,
        entity_type: 'glossary',
        entity_name: term.term,
      });
    }

    return terms;
  }
}

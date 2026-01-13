import { Section } from '@prisma/client';
import { z } from 'zod';
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoriesQuerySchema,
  bulkDeleteSectionCategoriesSchema,
} from '../validators/category.validator.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';

export class CategoryService {
  private prisma: any;
  private activityService: ActivityService;

  constructor(prisma?: any) {
    this.prisma = prisma;
    this.activityService = new ActivityService();
  }

  async createCategory(data: z.infer<typeof createCategorySchema>, user_id: number) {
    const category = await this.prisma.category.create({ data });

    // Log activity
    await this.activityService.logActivity({
      title: 'Category Created',
      description: `Category "${category.name}" created in ${category.section} section`,
      icon: '📁',
      user_id: user_id,
      entity_type: 'category',
      entity_name: category.name,
    });

    return category;
  }

  async categoryExists(id: number, section: Section, tx: any = this.prisma): Promise<boolean> {
    const category = await tx.category.findUnique({
      where: { id, section },
    });
    return !!category;
  }

  /**
   * Find or create category by name
   * Used for CSV imports where users provide category names instead of IDs
   */
  async findOrCreateCategoryByName(
    name: string,
    section: Section,
    tx: any = this.prisma
  ): Promise<number> {
    // First try to find existing category by name
    let category = await tx.category.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        section,
      },
    });

    if (!category) {
      // Generate a slug from the category name
      const generateSlug = (categoryName: string) => {
        const baseSlug = categoryName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        return `${baseSlug}-${randomSuffix}`;
      };

      // Create new category if it doesn't exist
      category = await tx.category.create({
        data: {
          name,
          section,
          url_slug: generateSlug(name),
          description: `Auto-created from CSV import: ${name}`,
        },
      });
    }

    return category.id;
  }

  /**
   * Find or create multiple categories by names
   * Returns array of category IDs
   */
  async findOrCreateCategoriesByNames(
    names: string[],
    section: Section,
    tx: any = this.prisma
  ): Promise<number[]> {
    const categoryIds: number[] = [];

    for (const name of names) {
      if (name && name.trim()) {
        const categoryId = await this.findOrCreateCategoryByName(name.trim(), section, tx);
        categoryIds.push(categoryId);
      }
    }

    return categoryIds;
  }

  /**
   * Get category ID by name (for validation)
   */
  async getCategoryIdByName(name: string, section: Section): Promise<number | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        section,
      },
      select: { id: true },
    });

    return category?.id || null;
  }

  private async getCategoryCounts(categoryIds: number[], section: Section) {
    const counts: { [key: number]: number } = {};

    switch (section) {
      case 'Tool':
        const toolCounts = await this.prisma.toolCategory.groupBy({
          by: ['category_id'],
          where: {
            category_id: { in: categoryIds },
          },
          _count: {
            category_id: true,
          },
        });
        toolCounts.forEach((count: any) => {
          counts[count.category_id] = count._count.category_id;
        });
        break;

      case 'News':
        const newsCounts = await this.prisma.newsCategory.groupBy({
          by: ['category_id'],
          where: {
            category_id: { in: categoryIds },
          },
          _count: {
            category_id: true,
          },
        });
        newsCounts.forEach((count: any) => {
          counts[count.category_id] = count._count.category_id;
        });
        break;

      case 'Prompt':
        const promptCounts = await this.prisma.promptCategory.groupBy({
          by: ['category_id'],
          where: {
            category_id: { in: categoryIds },
          },
          _count: {
            category_id: true,
          },
        });
        promptCounts.forEach((count: any) => {
          counts[count.category_id] = count._count.category_id;
        });
        break;

      case 'Glossary':
        const glossaryCounts = await this.prisma.glossaryTermCategory.groupBy({
          by: ['category_id'],
          where: {
            category_id: { in: categoryIds },
          },
          _count: {
            category_id: true,
          },
        });
        glossaryCounts.forEach((count: any) => {
          counts[count.category_id] = count._count.category_id;
        });
        break;
    }

    return counts;
  }

  async getAllCategories(query?: z.infer<typeof getCategoriesQuerySchema>) {
    if (!query) {
      const categories = await this.prisma.category.findMany({
        include: {
          parent_category: {
            select: {
              name: true,
            },
          },
          subcategories: {
            select: {
              id: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const counts = await this.getCategoryCounts(
        categories.map((cat: any) => cat.id),
        categories[0]?.section || 'Tool'
      );

      return categories.map((category: any) => ({
        ...category,
        items: counts[category.id] || 0,
      }));
    }

    const { page = 1, limit = 10, section, search, parent_id } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (section) {
      where.section = section;
    }
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }
    if (parent_id) {
      where.parentCategoryId = parent_id;
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          parent_category: {
            select: {
              name: true,
            },
          },
          subcategories: {
            select: {
              id: true,
            },
          },
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    const counts = section
      ? await this.getCategoryCounts(
          categories.map((cat: any) => cat.id),
          section
        )
      : {};

    return {
      categories: categories.map((category: any) => ({
        ...category,
        items: counts[category.id] || 0,
      })),
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

  async updateCategory(id: number, data: z.infer<typeof updateCategorySchema>, user_id: number) {
    const category = await this.prisma.category.update({
      where: { id },
      data,
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Category Updated',
      description: `Category "${category.name}" updated in ${category.section} section`,
      icon: '✏️',
      user_id: user_id,
      entity_type: 'category',
      entity_name: category.name,
    });

    return category;
  }

  async deleteCategory(id: number, user_id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
      },
    });
    if (!category) return null;
    if ((category as any).subcategories && (category as any).subcategories.length > 0) {
      throw new Error('Cannot delete category: it has subcategories');
    }

    const deletedCategory = await this.prisma.category.delete({
      where: { id },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Category Deleted',
      description: `Category "${category.name}" deleted from ${category.section} section`,
      icon: '🗑️',
      user_id: user_id,
      entity_type: 'category',
      entity_name: category.name,
    });

    return deletedCategory;
  }

  async deleteSectionCategory(categoryId: number, section: Section, force: boolean = false) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    if (category.section !== section) {
      throw new Error(`Category belongs to section '${category.section}', not '${section}'`);
    }

    // Check if category is in use
    const usageInfo = await this.checkCategoryUsage(categoryId, section);

    if (usageInfo.isInUse && !force) {
      throw new Error(
        `Cannot delete section category: Category is in use by ${usageInfo.count} items. ` +
          `Use force=true to override this check. Usage details: ${usageInfo.details}`
      );
    }

    return this.prisma.$transaction(async (tx: any) => {
      switch (section) {
        case 'Tool':
          await tx.toolCategory.deleteMany({
            where: { category_id: categoryId },
          });
          break;
        case 'News':
          await tx.newsCategory.deleteMany({
            where: { category_id: categoryId },
          });
          break;
        case 'Article':
          await tx.articleCategory.deleteMany({
            where: { category_id: categoryId },
          });
          break;
        case 'Learning':
          await tx.learningCategory.deleteMany({
            where: { category_id: categoryId },
          });
          break;
        case 'Prompt':
          await tx.promptCategory.deleteMany({
            where: { category_id: categoryId },
          });
          break;
        case 'Glossary':
          await tx.glossaryTermCategory.deleteMany({
            where: { category_id: categoryId },
          });
          break;
        default:
          throw new Error(`Unsupported section: ${section}`);
      }

      const message = usageInfo.isInUse
        ? `Section categories deleted for category ${categoryId} in section ${section} (force deleted ${usageInfo.count} associations)`
        : `Section categories deleted for category ${categoryId} in section ${section}`;

      return {
        message,
        deletedCount: usageInfo.count,
        wasInUse: usageInfo.isInUse,
        details: usageInfo.details,
      };
    });
  }

  async bulkDeleteSectionCategories(
    data: z.infer<typeof bulkDeleteSectionCategoriesSchema>,
    force: boolean = false
  ) {
    const { categoryIds, section } = data;

    const categories = await this.prisma.category.findMany({
      where: {
        id: { in: categoryIds },
        section,
      },
    });

    if (categories.length !== categoryIds.length) {
      const foundIds = categories.map((cat: any) => cat.id);
      const missingIds = categoryIds.filter((id) => !foundIds.includes(id));
      throw new Error(
        `Categories with IDs [${missingIds.join(', ')}] do not exist in section '${section}'`
      );
    }

    // Check usage for all categories
    const usageChecks = await Promise.all(
      categoryIds.map((id) => this.checkCategoryUsage(id, section))
    );

    const totalUsage = usageChecks.reduce((sum: any, check: any) => sum + check.count, 0);
    const hasUsage = usageChecks.some((check: any) => check.isInUse);

    if (hasUsage && !force) {
      const usageDetails = usageChecks
        .map((check: any, index: any) => `Category ${categoryIds[index]}: ${check.count} items`)
        .join(', ');

      throw new Error(
        `Cannot delete section categories: Some categories are in use. ` +
          `Use force=true to override this check. Usage details: ${usageDetails}`
      );
    }

    return this.prisma.$transaction(async (tx: any) => {
      let deletedCount = 0;

      switch (section) {
        case 'Tool':
          const toolResult = await tx.toolCategory.deleteMany({
            where: { category_id: { in: categoryIds } },
          });
          deletedCount = toolResult.count;
          break;
        case 'News':
          const newsResult = await tx.newsCategory.deleteMany({
            where: { category_id: { in: categoryIds } },
          });
          deletedCount = newsResult.count;
          break;
        case 'Article':
          const articleResult = await tx.articleCategory.deleteMany({
            where: { category_id: { in: categoryIds } },
          });
          deletedCount = articleResult.count;
          break;
        case 'Learning':
          const learningResult = await tx.learningCategory.deleteMany({
            where: { category_id: { in: categoryIds } },
          });
          deletedCount = learningResult.count;
          break;
        case 'Prompt':
          const promptResult = await tx.promptCategory.deleteMany({
            where: { category_id: { in: categoryIds } },
          });
          deletedCount = promptResult.count;
          break;
        case 'Glossary':
          const glossaryResult = await tx.glossaryTermCategory.deleteMany({
            where: { category_id: { in: categoryIds } },
          });
          deletedCount = glossaryResult.count;
          break;
        default:
          throw new Error(`Unsupported section: ${section}`);
      }

      const message = hasUsage
        ? `Deleted ${deletedCount} section category associations for ${categoryIds.length} categories in section ${section} (force deleted)`
        : `Deleted ${deletedCount} section category associations for ${categoryIds.length} categories in section ${section}`;

      return {
        message,
        deletedCount,
        categoryCount: categoryIds.length,
        section,
        wasInUse: hasUsage,
        totalUsageBeforeDeletion: totalUsage,
      };
    });
  }

  async validateCategoriesExist(categoryIds: number[], section: Section) {
    const categories = await this.prisma.category.findMany({
      where: {
        id: { in: categoryIds },
        section,
      },
    });

    const foundIds = categories.map((cat: any) => cat.id);
    const missingIds = categoryIds.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      throw new Error(
        `Categories with IDs [${missingIds.join(', ')}] do not exist in section '${section}'`
      );
    }

    return categories;
  }

  private async checkCategoryUsage(categoryId: number, section: Section) {
    let count = 0;
    let details = '';

    switch (section) {
      case 'Tool':
        const toolCount = await this.prisma.toolCategory.count({
          where: { category_id: categoryId },
        });
        count = toolCount;
        details = `${toolCount} tools`;
        break;

      case 'News':
        const newsCount = await this.prisma.newsCategory.count({
          where: { category_id: categoryId },
        });
        count = newsCount;
        details = `${newsCount} news articles`;
        break;

      case 'Article':
        const articleCount = await this.prisma.articleCategory.count({
          where: { category_id: categoryId },
        });
        count = articleCount;
        details = `${articleCount} articles`;
        break;

      case 'Learning':
        const learningCount = await this.prisma.learningCategory.count({
          where: { category_id: categoryId },
        });
        count = learningCount;
        details = `${learningCount} learning resources`;
        break;

      case 'Prompt':
        const promptCount = await this.prisma.promptCategory.count({
          where: { category_id: categoryId },
        });
        count = promptCount;
        details = `${promptCount} prompts`;
        break;

      case 'Glossary':
        const glossaryCount = await this.prisma.glossaryTermCategory.count({
          where: { category_id: categoryId },
        });
        count = glossaryCount;
        details = `${glossaryCount} glossary terms`;
        break;

      default:
        throw new Error(`Unsupported section: ${section}`);
    }

    return {
      isInUse: count > 0,
      count,
      details,
    };
  }
}

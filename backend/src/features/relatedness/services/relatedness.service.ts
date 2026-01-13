import { prisma } from '@config/index.ts';
import { cosineSimilarity, parsePgVector } from '@utils/utils.ts';

export class RelatednessService {
  constructor() {}

  async getRelatedContentByTags(entityType: string, entityId: number) {
    // 1. Get tags for the entity
    let tagIds: number[] = [];
    switch (entityType) {
      case 'Tool':
        tagIds = (await prisma.toolTag.findMany({ where: { tool_id: entityId } })).map(
          (t) => t.tag_id
        );
        break;
      case 'Article':
        tagIds = (await prisma.articleTag.findMany({ where: { article_id: entityId } })).map(
          (t) => t.tag_id
        );
        break;
      case 'Prompt':
        tagIds = (await prisma.promptTag.findMany({ where: { prompt_id: entityId } })).map(
          (t) => t.tag_id
        );
        break;
      case 'Glossary':
        tagIds = (await prisma.glossaryTag.findMany({ where: { glossary_id: entityId } })).map(
          (t) => t.tag_id
        );
        break;
      case 'Learning':
        tagIds = (await prisma.learningTag.findMany({ where: { learning_id: entityId } })).map(
          (t) => t.tag_id
        );
        break;
      case 'News':
        tagIds = (await prisma.newsTag.findMany({ where: { news_id: entityId } })).map(
          (t) => t.tag_id
        );
        break;
      default:
        return [];
    }

    // 2. Find related entities by tagIds (excluding the current entity)
    const related = {
      tools: await prisma.toolTag.findMany({
        where: { tag_id: { in: tagIds }, tool_id: { not: entityId } },
        include: { tool: true },
      }),
      articles: await prisma.articleTag.findMany({
        where: { tag_id: { in: tagIds }, article_id: { not: entityId } },
        include: { article: true },
      }),
      prompts: await prisma.promptTag.findMany({
        where: { tag_id: { in: tagIds }, prompt_id: { not: entityId } },
        include: { prompt: true },
      }),
      glossaries: await prisma.glossaryTag.findMany({
        where: { tag_id: { in: tagIds }, glossary_id: { not: entityId } },
        include: { glossary: true },
      }),
      learnings: await prisma.learningTag.findMany({
        where: { tag_id: { in: tagIds }, learning_id: { not: entityId } },
        include: { learning: true },
      }),
      news: await prisma.newsTag.findMany({
        where: { tag_id: { in: tagIds }, news_id: { not: entityId } },
        include: { news: true },
      }),
    };

    return related;
  }

  async getTagIds(entity: string, id: number): Promise<number[]> {
    switch (entity) {
      case 'Tool':
        return (await prisma.toolTag.findMany({ where: { tool_id: id } })).map((t) => t.tag_id);
      case 'News':
        return (await prisma.newsTag.findMany({ where: { news_id: id } })).map((t) => t.tag_id);
      case 'Article':
        return (await prisma.articleTag.findMany({ where: { article_id: id } })).map(
          (t) => t.tag_id
        );
      case 'Learning':
        return (await prisma.learningTag.findMany({ where: { learning_id: id } })).map(
          (t) => t.tag_id
        );
      case 'Prompt':
        return (await prisma.promptTag.findMany({ where: { prompt_id: id } })).map((t) => t.tag_id);
      case 'Glossary':
        return (await prisma.glossaryTag.findMany({ where: { glossary_id: id } })).map(
          (t) => t.tag_id
        );
      default:
        return [];
    }
  }

  async getRelatedByTags(entity: string, id: number, tagIds: number[]) {
    return {
      tools: await prisma.tool.findMany({
        where: {
          ...(entity === 'Tool' ? { id: { not: id } } : {}),
          tool_tags: { some: { tag_id: { in: tagIds } } },
        },
        take: 5,
      }),
      news: await prisma.news.findMany({
        where: {
          ...(entity === 'News' ? { id: { not: id } } : {}),
          newsTags: { some: { tag_id: { in: tagIds } } },
        },
        take: 5,
      }),
      articles: await prisma.article.findMany({
        where: {
          ...(entity === 'Article' ? { id: { not: id } } : {}),
          articleTags: { some: { tag_id: { in: tagIds } } },
        },
        take: 5,
      }),
      learnings: await prisma.learning.findMany({
        where: {
          ...(entity === 'Learning' ? { id: { not: id } } : {}),
          learningTags: { some: { tag_id: { in: tagIds } } },
        },
        take: 5,
      }),
      prompts: await prisma.prompt.findMany({
        where: {
          ...(entity === 'Prompt' ? { id: { not: id } } : {}),
          promptTags: { some: { tag_id: { in: tagIds } } },
        },
        take: 5,
      }),
      glossaries: await prisma.glossaryTerm.findMany({
        where: {
          ...(entity === 'Glossary' ? { id: { not: id } } : {}),
          glossaryTags: { some: { tag_id: { in: tagIds } } },
        },
        take: 5,
      }),
    };
  }

  async getRelatedByNLP(entity: string, id: number) {
    let embedding: any = null;
    switch (entity) {
      case 'Tool': {
        const result = await prisma.$queryRawUnsafe<any[]>(
          `
        SELECT id, embedding::text as embedding
        FROM "Tool"
        WHERE id = $1`,
          id
        );
        embedding = result[0].embedding;
        break;
      }
      case 'News': {
        const result = await prisma.$queryRawUnsafe<any[]>(
          `
        SELECT id, embedding::text as embedding
        FROM "News"
        WHERE id = $1`,
          id
        );
        embedding = result[0].embedding;
        break;
      }
      case 'Article': {
        const result = await prisma.$queryRawUnsafe<any[]>(
          `
        SELECT id, embedding::text as embedding
        FROM "Article"
        WHERE id = $1`,
          id
        );
        embedding = result[0].embedding;
        break;
      }
      case 'Learning': {
        const result = await prisma.$queryRawUnsafe<any[]>(
          `
        SELECT id, embedding::text as embedding
        FROM "Learning"
        WHERE id = $1`,
          id
        );
        embedding = result[0].embedding;
        break;
      }
      case 'Prompt': {
        const result = await prisma.$queryRawUnsafe<any[]>(
          `
        SELECT id, embedding::text as embedding
        FROM "Prompt"
        WHERE id = $1`,
          id
        );
        embedding = result[0].embedding;
        break;
      }
      case 'GlossaryTerm': {
        const result = await prisma.$queryRawUnsafe<any[]>(
          `
        SELECT id, embedding::text as embedding
        FROM "GlossaryTerm"
        WHERE id = $1`,
          id
        );
        embedding = result[0].embedding;
        break;
      }
      default:
        return {};
    }

    async function getTopRelated(model: any, modelName: string, excludeId: number) {
      const items = await model.findMany({ where: { id: { not: excludeId } } });
      const scored = await Promise.all(
        items.map(async (item: any) => {
          try {
            const emb: { id: number; embedding: any }[] = await prisma.$queryRawUnsafe<any[]>(
              `
              SELECT id, embedding::text as embedding
              FROM "${modelName}"
              WHERE id = $1`,
              item.id
            );

            const dbEmbedding = parsePgVector(embedding);
            const dbEmb = parsePgVector(emb[0].embedding);
            return { ...item, similarity: cosineSimilarity(dbEmbedding, dbEmb) };
          } catch {
            return null;
          }
        })
      );
      return scored
        .filter(Boolean)
        .sort((a, b) => (b!.similarity ?? 0) - (a!.similarity ?? 0))
        .slice(0, 5);
    }

    return {
      tools: await getTopRelated(prisma.tool, 'Tool', id),
      news: await getTopRelated(prisma.news, 'News', id),
      articles: await getTopRelated(prisma.article, 'Article', id),
      learnings: await getTopRelated(prisma.learning, 'Learning', id),
      prompts: await getTopRelated(prisma.prompt, 'Prompt', id),
      glossaries: await getTopRelated(prisma.glossaryTerm, 'GlossaryTerm', id),
    };
  }

  async validateRequest(entity: string, id: number) {
    switch (entity) {
      case 'Tool': {
        const tool = await prisma.tool.findFirst({
          where: { id },
        });
        if (!tool) {
          throw new Error('Tool does not exists');
        }
        break;
      }
      case 'News': {
        const tool = await prisma.news.findFirst({
          where: { id },
        });
        if (!tool) {
          throw new Error('News does not exists');
        }
        break;
      }
      case 'Article': {
        const tool = await prisma.article.findFirst({
          where: { id },
        });
        if (!tool) {
          throw new Error('Article does not exists');
        }
        break;
      }
      case 'Learning': {
        const tool = await prisma.learning.findFirst({
          where: { id },
        });
        if (!tool) {
          throw new Error('Learning does not exists');
        }
        break;
      }
      case 'Prompt': {
        const tool = await prisma.prompt.findFirst({
          where: { id },
        });
        if (!tool) {
          throw new Error('Prompt does not exists');
        }
        break;
      }
      case 'GlossaryTerm': {
        const tool = await prisma.glossaryTerm.findFirst({
          where: { id },
        });
        if (!tool) {
          throw new Error('GlossaryTerm does not exists');
        }
        break;
      }
      default:
        return {};
    }
  }

  async getRelatedContent(entity: string, id: number) {
    await this.validateRequest(entity, id);
    const tagIds = await this.getTagIds(entity, id);
    const tagRelated = await this.getRelatedByTags(entity, id, tagIds);
    const nlpRelated = await this.getRelatedByNLP(entity, id);

    function mergeResults(tagResults: any, nlpResults: any) {
      const merge = (tagArr: any, nlpArr: any) => {
        const ids = new Set(tagArr.map((item: any) => item.id));
        return [...tagArr, ...(nlpArr || []).filter((item: any) => !ids.has(item.id))];
      };
      return {
        tools: merge(tagResults.tools, nlpResults.tools),
        news: merge(tagResults.news, nlpResults.news),
        articles: merge(tagResults.articles, nlpResults.articles),
        learnings: merge(tagResults.learnings, nlpResults.learnings),
        prompts: merge(tagResults.prompts, nlpResults.prompts),
        glossaries: merge(tagResults.glossaries, nlpResults.glossaries),
      };
    }

    return mergeResults(tagRelated, nlpRelated);
  }
}

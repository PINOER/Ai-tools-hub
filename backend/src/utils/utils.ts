import axios from 'axios';
import { BookmarkTargetType, CommentContentType } from '@prisma/client';
import { ToolService } from '../features/tool/services/tool.service.ts';
import { NewsService } from '../features/news/services/news.service.ts';
import { PromptService } from '../features/prompt/services/prompt.service.ts';
import { ArticleService } from '../features/article/services/article.service.ts';
import { LearningService } from '../features/learning/services/learning.service.ts';
import { GlossaryService } from '../features/glossary/services/glossary.service.ts';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export function parsePgVector(embeddingStr: string): number[] {
  const json = embeddingStr.replace(/{/g, '[').replace(/}/g, ']');
  return JSON.parse(json) as number[];
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB);
}

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await axios.post(
    'https://api.openai.com/v1/embeddings',
    {
      input: text,
      model: 'text-embedding-ada-002',
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.data[0].embedding;
}

export async function getEntityEmbedding(entity: string, data: any): Promise<number[]> {
  let text = '';
  switch (entity) {
    case 'Tool':
      text = `${data.name} ${data.short_description ?? ''} ${data.full_description ?? ''}`;
      break;
    case 'News':
      text = `${data.headline} ${data.content ?? ''}`;
      break;
    case 'Article':
      text = `${data.headline} ${data.content ?? ''}`;
      break;
    case 'Learning':
      text = `${data.title} ${data.description ?? ''}`;
      break;
    case 'Prompt':
      text = `${data.title} ${data.short_description ?? ''} ${data.main_prompt ?? ''}`;
      break;
    case 'GlossaryTerm':
      text = `${data.term} ${data.definition ?? ''}`;
      break;
    default:
      text = '';
  }
  if (!text.trim()) return [];
  return await getEmbedding(text);
}

function mapContentTypeToTargetType(contentType: CommentContentType): BookmarkTargetType {
  switch (contentType) {
    case 'TOOL':
      return 'Tool';
    case 'NEWS':
      return 'News';
    case 'ARTICLE':
      return 'Article';
    case 'LEARNING':
      return 'Learning';
    case 'PROMPT':
      return 'Prompt';
    case 'GLOSSARY':
      return 'Glossary';
    default:
      throw new Error(`Unsupported content type: ${contentType}`);
  }
}

export async function verifyTargetExists(
  targetId: number,
  targetType: BookmarkTargetType | CommentContentType
): Promise<boolean> {
  try {
    // Convert CommentContentType to BookmarkTargetType if needed
    const normalizedTargetType =
      targetType in BookmarkTargetType
        ? (targetType as BookmarkTargetType)
        : mapContentTypeToTargetType(targetType as CommentContentType);

    switch (normalizedTargetType) {
      case BookmarkTargetType.Tool:
        return await ToolService.toolExists(targetId);

      case BookmarkTargetType.News:
        return await NewsService.newsExists(targetId);

      case BookmarkTargetType.Article:
        return await ArticleService.articleExists(targetId);

      case BookmarkTargetType.Learning:
        return await LearningService.learningExists(targetId);

      case BookmarkTargetType.Prompt:
        return await PromptService.promptExists(targetId);

      case BookmarkTargetType.Glossary:
        return await GlossaryService.termExists(targetId);

      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * Parse date fields (published_date, published_time) with fallback to current date
 * @param dateValue - The date value to parse (string, Date, undefined, or null)
 * @returns Valid Date object or current date as fallback
 */
export const parseDateField = (dateValue: string | Date | undefined | null): Date => {
  if (!dateValue) return new Date();

  if (dateValue instanceof Date) {
    return isNaN(dateValue.getTime()) ? new Date() : dateValue;
  }

  const parsedDate = new Date(dateValue);
  return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
};

export const parseSemicolonSeparatedValues = (value: string): string[] => {
  if (!value || typeof value !== 'string') return [];

  return value
    .split(';')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

/**
 * Parse boolean values from CSV strings
 */
export const parseBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase().trim();
    return lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes';
  }
  return false;
};

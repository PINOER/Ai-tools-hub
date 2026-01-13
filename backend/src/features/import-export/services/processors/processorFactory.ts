import { EntityType, PrismaClient } from '@prisma/client';
import { ToolProcessor } from './toolProcessor.ts';
import { GlossaryProcessor } from './glossaryProcessor.ts';
import { ArticleProcessor } from './articleProcessor.ts';
import { PromptProcessor } from './promptProcessor.ts';
import { NewsProcessor } from './newsProcessor.ts';
import { LearningProcessor } from './learningProcessor.ts';

export interface IEntityProcessor {
  processData(rowData: any): Promise<any>;
  getExportData(): Promise<{ records: any[]; headers: string[] }>;
}

export class ProcessorFactory {
  static createProcessor(entityType: EntityType, prisma?: PrismaClient): IEntityProcessor {
    switch (entityType) {
      case EntityType.Tool:
        return new ToolProcessor(prisma);
      case EntityType.Glossary:
        return new GlossaryProcessor(prisma);
      case EntityType.Article:
        return new ArticleProcessor(prisma);
      case EntityType.Prompt:
        return new PromptProcessor(prisma);
      case EntityType.News:
        return new NewsProcessor(prisma);
      case EntityType.Learning:
        return new LearningProcessor(prisma);
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }
}

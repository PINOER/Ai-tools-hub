import { prisma } from '../../../config/index.ts';
import { z } from 'zod';
import {
  createPromptChainSchema,
  updatePromptChainSchema,
} from '../validators/prompt.validator.ts';
import { PromptService } from './prompt.service.ts';

export class PromptChainService {
  async createPromptChain(prompt_id: number, data: z.infer<typeof createPromptChainSchema>) {
    if (!(await PromptService.promptExists(prompt_id))) {
      throw new Error('Prompt not found');
    }
    return await prisma.$transaction(async (tx) => {
      const existingChain = await tx.promptChain.findFirst({
        where: {
          prompt_id,
          part_number: data.part_number,
        },
      });
      if (existingChain) {
        throw new Error('Part number already exists for this prompt');
      }
      const promptChain = await tx.promptChain.create({
        data: {
          prompt_id,
          part_number: data.part_number,
          step_title: data.step_title,
          text: data.text,
          step_description: data.step_description || '',
        },
      });
      return promptChain;
    });
  }

  async updatePromptChain(id: number, data: z.infer<typeof updatePromptChainSchema>) {
    return await prisma.$transaction(async (tx) => {
      const promptChain = await tx.promptChain.findUnique({
        where: { id },
        include: { prompt: true },
      });
      if (!promptChain) {
        throw new Error('Prompt chain not found');
      }
      if (data.part_number && data.part_number !== promptChain.part_number) {
        const existingChain = await tx.promptChain.findFirst({
          where: {
            prompt_id: promptChain.prompt_id,
            part_number: data.part_number,
          },
        });
        if (existingChain) {
          throw new Error('Part number already exists for this prompt');
        }
      }
      const updatedPromptChain = await tx.promptChain.update({
        where: { id },
        data,
      });
      return updatedPromptChain;
    });
  }

  async deletePromptChain(id: number) {
    const promptChain = await prisma.promptChain.findUnique({
      where: { id },
    });
    if (!promptChain) {
      throw new Error('Prompt chain not found');
    }
    const deletedPromptChain = await prisma.promptChain.delete({
      where: { id },
    });
    return deletedPromptChain;
  }
}

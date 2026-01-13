import { createToolTagSchema } from '../validators/toolTag.validator.ts';
import { prisma } from '../../../config/index.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';

export class ToolTagService {
  private activityService: ActivityService;

  constructor() {
    this.activityService = new ActivityService();
  }

  async create(data: any, user_id: number, tx: any = prisma) {
    createToolTagSchema.parse(data);
    await this.ensureToolAndTagExist(data.tool_id, data.tag_id, tx);
    const toolTag = await tx.toolTag.create({ data });

    // Log activity
    await this.activityService.logActivity({
      title: 'Tool Tag Created',
      description: `Tag association created for tool ${data.tool_id}`,
      icon: '🏷️',
      user_id: user_id,
      entity_type: 'tool_tag',
      entity_name: `Tool ${data.tool_id} - Tag ${data.tag_id}`,
    });

    return toolTag;
  }
  async getAll(tx = prisma) {
    return tx.toolTag.findMany();
  }
  async get(tool_id: number, tag_id: number, tx = prisma) {
    return tx.toolTag.findUnique({ where: { tool_id_tag_id: { tool_id, tag_id } } });
  }
  async update(tool_id: number, tag_id: number, data: any, user_id: number, tx = prisma) {
    createToolTagSchema.parse(data);
    await this.ensureToolAndTagExist(tool_id, tag_id);
    const toolTag = await tx.toolTag.update({
      where: { tool_id_tag_id: { tool_id, tag_id } },
      data,
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Tool Tag Updated',
      description: `Tag association updated for tool ${tool_id}`,
      icon: '✏️',
      user_id: user_id,
      entity_type: 'tool_tag',
      entity_name: `Tool ${tool_id} - Tag ${tag_id}`,
    });

    return toolTag;
  }
  async delete(tool_id: number, tag_id: number, user_id: number, tx = prisma) {
    const toolTag = await tx.toolTag.delete({ where: { tool_id_tag_id: { tool_id, tag_id } } });

    // Log activity
    await this.activityService.logActivity({
      title: 'Tool Tag Deleted',
      description: `Tag association deleted for tool ${tool_id}`,
      icon: '🗑️',
      user_id: user_id,
      entity_type: 'tool_tag',
      entity_name: `Tool ${tool_id} - Tag ${tag_id}`,
    });

    return toolTag;
  }

  async ensureToolAndTagExist(tool_id: number, tag_id: number, tx = prisma) {
    const tool = await tx.tool.findUnique({ where: { id: tool_id } });
    if (!tool) throw new Error(`Tool with id ${tool_id} does not exist`);
    const tag = await prisma.tag.findUnique({ where: { id: tag_id } });
    if (!tag) throw new Error(`Tag with id ${tag_id} does not exist`);
  }
}

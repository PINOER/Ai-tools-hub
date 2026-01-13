import { SiteInformation } from '@prisma/client';
import { prisma } from '../../../config/index.ts';
import {
  updateSiteInformationSchema,
  createSiteInformationSchema,
} from '../validators/site.validator.ts';
import { z } from 'zod';

export class SiteService {
  async createSiteInformation(
    data: z.infer<typeof createSiteInformationSchema>
  ): Promise<SiteInformation> {
    // Check if site information already exists
    const existing = await prisma.siteInformation.findFirst();
    if (existing) {
      throw new Error('Site information already exists. Use update endpoint instead.');
    }

    return await prisma.siteInformation.create({
      data: {
        ...data,
      },
    });
  }

  async updateSiteInformation(
    data: z.infer<typeof updateSiteInformationSchema>
  ): Promise<SiteInformation> {
    // Get existing site information
    const existing = await prisma.siteInformation.findFirst();

    if (!existing) {
      throw new Error('Site information not found. Please create it first.');
    }

    return await prisma.siteInformation.update({
      where: { id: existing.id },
      data: {
        ...data,
      },
    });
  }

  async upsertSiteInformation(
    data: z.infer<typeof updateSiteInformationSchema>
  ): Promise<SiteInformation> {
    const existing = await prisma.siteInformation.findFirst();

    if (existing) {
      return await prisma.siteInformation.update({
        where: { id: existing.id },
        data: {
          ...data,
        },
      });
    } else {
      // Create with default values if none exists
      const defaultData = {
        site_name: data.site_name || 'AI Tool Hub',
        site_description: data.site_description || 'Discover the best AI tools and resources',
        site_tagline: data.site_tagline || 'Your AI Tools Directory',
        ...data,
      };

      return await prisma.siteInformation.create({
        data: defaultData,
      });
    }
  }

  async getSiteSettings() {
    const siteInfo = await prisma.siteInformation.findFirst();

    if (!siteInfo) {
      throw new Error('Site information not found.');
    }

    return siteInfo;
  }
}

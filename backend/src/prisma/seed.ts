import {
  PrismaClient,
  PricingModel,
  PlatformAvailability,
  ToolStatus,
  UserStatus,
  ReviewStatus,
  RoleType,
  Section,
  ArticleStatus,
  LearningStatus,
  PromptStatus,
  GlossaryStatus,
  ModerationStatus,
  CategoryType,
  SiteStatus,
  ReviewApprovalStatus,
  SubmissionApprovalStatus,
  EmailServiceProvider,
  EmailNotificationType,
  SitemapSetting,
} from '@prisma/client';
import bcrypt from 'bcrypt';
import { getEmbedding } from '../utils/utils.js';

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();

  if (userCount > 0) {
    console.log('⚠️  Seeding skipped: Users already exist in database.');
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      // Create roles
      const roles = await Promise.all(
        Object.values(RoleType).map((role) =>
          tx.role.upsert({
            where: { role },
            update: {},
            create: { role },
          })
        )
      );

      const adminRole = roles.find((r) => r.role === RoleType.Admin);

      // Create Site Information
      await tx.siteInformation.create({
        data: {
          site_name: 'AI Tool Hub',
          site_description:
            'Discover the best AI tools and resources for productivity, creativity, and innovation. Find, compare, and review cutting-edge AI applications.',
          site_tagline: 'Your Gateway to AI Innovation',
          status: SiteStatus.Live,
          maintenance_message: 'We are currently performing maintenance. Please check back soon.',
          favicon: '/favicon.ico',
          social_preview: '/images/social-preview.jpg',
          meta_title: 'AI Tool Hub - Discover the Best AI Tools',
          meta_description:
            'Find and compare the best AI tools for productivity, creativity, and business. Read reviews, get insights, and stay updated with the latest AI innovations.',
          sitemap_settings: [
            SitemapSetting.Tools,
            SitemapSetting.Articles,
            SitemapSetting.Learning,
            SitemapSetting.News,
          ],
          google_search_console_verification: '',
          bing_webmaster_tools_verification: '',
          twitter_url: '',
          github_url: '',
          linkedin_url: '',
          youtube_url: '',
          google_analytics_id: '',
          google_tag_manager_id: '',
          facebook_pixel_id: '',
          review_status: true,
          review_approval: ReviewApprovalStatus.AutoPublish,
          min_review_length: 10,
          max_review_length: 500,
          tool_submission_approval: SubmissionApprovalStatus.AdminApproval,
          article_submission_approval: SubmissionApprovalStatus.AdminApproval,
          learning_submission_approval: SubmissionApprovalStatus.AdminApproval,
          admin_notification_email: '',
          notify_admins_for: [
            EmailNotificationType.ToolSubmission,
            EmailNotificationType.ArticleSubmission,
            EmailNotificationType.FlaggedContentReport,
          ],
          email_service_provider: EmailServiceProvider.SMTP,
          smtp_host: '',
          smtp_port: 587,
          smtp_username: '',
          from_email: '',
          from_name: 'AI Tool Hub',
        },
      });

      // Create user
      const user = await tx.user.create({
        data: {
          username: 'alice123',
          first_name: 'Alice',
          last_name: 'Smith',
          email: 'user@example.com',
          password: await bcrypt.hash('string', 10),
          role_id: adminRole!.id,
          status: UserStatus.Active,
          avatar:
            'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
        },
      });

      // Password Reset
      await tx.passwordReset.create({
        data: {
          user_id: user.id,
          token: 'reset-token',
          expires_at: new Date(Date.now() + 3600 * 1000),
        },
      });

      // Categories & Tags
      // Create root categories for each section
      const toolCategory = await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'AI Tools',
          url_slug: 'ai-tools',
          description: 'All AI tools',
          display_order: 1,
          seo_title: 'AI Tools',
        },
      });
      const newsCategory = await tx.category.create({
        data: {
          section: Section.News,
          name: 'Tech News',
          url_slug: 'tech-news',
          description: 'Latest technology news',
          display_order: 1,
          seo_title: 'Tech News',
        },
      });
      const articleCategory = await tx.category.create({
        data: {
          section: Section.Article,
          name: 'AI Articles',
          url_slug: 'ai-articles',
          description: 'Articles about AI',
          display_order: 1,
          seo_title: 'AI Articles',
        },
      });
      const learningCategory = await tx.category.create({
        data: {
          section: Section.Learning,
          name: 'Learning',
          url_slug: 'learning',
          description: 'Learning resources',
          display_order: 1,
          seo_title: 'Learning',
        },
      });
      const promptCategory = await tx.category.create({
        data: {
          section: Section.Prompt,
          name: 'Prompt Engineering',
          url_slug: 'prompt-engineering',
          description: 'Prompt engineering resources',
          display_order: 1,
          seo_title: 'Prompt Engineering',
        },
      });
      const glossaryCategory = await tx.category.create({
        data: {
          section: Section.Glossary,
          name: 'AI Terms',
          url_slug: 'ai-terms',
          description: 'AI terminology and definitions',
          display_order: 1,
          seo_title: 'AI Terms',
        },
      });

      // Add subcategories for each section
      const toolSub = await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'Productivity Tools',
          url_slug: 'productivity-tools',
          parentCategoryId: toolCategory.id,
          description: 'Productivity AI tools',
          display_order: 2,
          seo_title: 'Productivity Tools',
        },
      });

      // Create additional Tool categories with parent-child relationships
      const designCategory = await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'Design & Creative',
          url_slug: 'design-creative',
          parentCategoryId: toolCategory.id,
          description: 'AI tools for design and creative work',
          display_order: 3,
          seo_title: 'Design & Creative AI Tools',
        },
      });

      const marketingCategory = await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'Marketing & Sales',
          url_slug: 'marketing-sales',
          parentCategoryId: toolCategory.id,
          description: 'AI tools for marketing and sales',
          display_order: 4,
          seo_title: 'Marketing & Sales AI Tools',
        },
      });

      const developmentCategory = await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'Development & Coding',
          url_slug: 'development-coding',
          parentCategoryId: toolCategory.id,
          description: 'AI tools for software development',
          display_order: 5,
          seo_title: 'Development & Coding AI Tools',
        },
      });

      const analyticsCategory = await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'Analytics & Data',
          url_slug: 'analytics-data',
          parentCategoryId: toolCategory.id,
          description: 'AI tools for data analysis and insights',
          display_order: 6,
          seo_title: 'Analytics & Data AI Tools',
        },
      });

      // Create child categories for Design & Creative
      await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'Graphic Design',
          url_slug: 'graphic-design',
          parentCategoryId: designCategory.id,
          description: 'AI tools for graphic design',
          display_order: 1,
          seo_title: 'Graphic Design AI Tools',
        },
      });

      await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'Video Editing',
          url_slug: 'video-editing',
          parentCategoryId: designCategory.id,
          description: 'AI tools for video editing and production',
          display_order: 2,
          seo_title: 'Video Editing AI Tools',
        },
      });

      await tx.category.create({
        data: {
          section: Section.Tool,
          name: '3D Modeling',
          url_slug: '3d-modeling',
          parentCategoryId: designCategory.id,
          description: 'AI tools for 3D modeling and rendering',
          display_order: 3,
          seo_title: '3D Modeling AI Tools',
        },
      });

      // Create child categories for Marketing & Sales
      await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'Social Media',
          url_slug: 'social-media',
          parentCategoryId: marketingCategory.id,
          description: 'AI tools for social media management',
          display_order: 1,
          seo_title: 'Social Media AI Tools',
        },
      });

      await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'Email Marketing',
          url_slug: 'email-marketing',
          parentCategoryId: marketingCategory.id,
          description: 'AI tools for email marketing campaigns',
          display_order: 2,
          seo_title: 'Email Marketing AI Tools',
        },
      });

      await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'SEO & Content',
          url_slug: 'seo-content',
          parentCategoryId: marketingCategory.id,
          description: 'AI tools for SEO and content optimization',
          display_order: 3,
          seo_title: 'SEO & Content AI Tools',
        },
      });

      // Create child categories for Development & Coding
      await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'Code Generation',
          url_slug: 'code-generation',
          parentCategoryId: developmentCategory.id,
          description: 'AI tools for code generation and assistance',
          display_order: 1,
          seo_title: 'Code Generation AI Tools',
        },
      });

      await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'Testing & QA',
          url_slug: 'testing-qa',
          parentCategoryId: developmentCategory.id,
          description: 'AI tools for software testing and quality assurance',
          display_order: 2,
          seo_title: 'Testing & QA AI Tools',
        },
      });

      await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'DevOps & Deployment',
          url_slug: 'devops-deployment',
          parentCategoryId: developmentCategory.id,
          description: 'AI tools for DevOps and deployment automation',
          display_order: 3,
          seo_title: 'DevOps & Deployment AI Tools',
        },
      });

      // Create child categories for Analytics & Data
      await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'Business Intelligence',
          url_slug: 'business-intelligence',
          parentCategoryId: analyticsCategory.id,
          description: 'AI tools for business intelligence and reporting',
          display_order: 1,
          seo_title: 'Business Intelligence AI Tools',
        },
      });

      await tx.category.create({
        data: {
          section: Section.Tool,
          name: 'Predictive Analytics',
          url_slug: 'predictive-analytics',
          parentCategoryId: analyticsCategory.id,
          description: 'AI tools for predictive analytics and forecasting',
          display_order: 2,
          seo_title: 'Predictive Analytics AI Tools',
        },
      });
      await tx.category.create({
        data: {
          section: Section.News,
          name: 'AI News',
          url_slug: 'ai-news',
          parentCategoryId: newsCategory.id,
          description: 'News about AI',
          display_order: 2,
          seo_title: 'AI News',
        },
      });
      await tx.category.create({
        data: {
          section: Section.Article,
          name: 'Research Articles',
          url_slug: 'research-articles',
          parentCategoryId: articleCategory.id,
          description: 'Research articles on AI',
          display_order: 2,
          seo_title: 'Research Articles',
        },
      });
      await tx.category.create({
        data: {
          section: Section.Learning,
          name: 'Courses',
          url_slug: 'courses',
          parentCategoryId: learningCategory.id,
          description: 'AI courses',
          display_order: 2,
          seo_title: 'Courses',
        },
      });
      await tx.category.create({
        data: {
          section: Section.Prompt,
          name: 'Prompt Templates',
          url_slug: 'prompt-templates',
          parentCategoryId: promptCategory.id,
          description: 'Templates for prompt engineering',
          display_order: 2,
          seo_title: 'Prompt Templates',
        },
      });
      await tx.category.create({
        data: {
          section: Section.Glossary,
          name: 'Technical Terms',
          url_slug: 'technical-terms',
          parentCategoryId: glossaryCategory.id,
          description: 'Technical AI terminology',
          display_order: 2,
          seo_title: 'Technical Terms',
        },
      });

      const tags = await Promise.all([
        tx.tag.create({ data: { name: 'Machine Learning' } }),
        tx.tag.create({ data: { name: 'Productivity' } }),
        tx.tag.create({ data: { name: 'Design' } }),
        tx.tag.create({ data: { name: 'Marketing' } }),
        tx.tag.create({ data: { name: 'Development' } }),
        tx.tag.create({ data: { name: 'AI' } }),
        tx.tag.create({ data: { name: 'Automation' } }),
      ]);

      // Create Tool Roles
      const toolRoles = await Promise.all([
        tx.toolRole.create({ data: { name: 'Developer' } }),
        tx.toolRole.create({ data: { name: 'Designer' } }),
        tx.toolRole.create({ data: { name: 'Product Manager' } }),
        tx.toolRole.create({ data: { name: 'Marketing Specialist' } }),
        tx.toolRole.create({ data: { name: 'Data Analyst' } }),
        tx.toolRole.create({ data: { name: 'Content Creator' } }),
        tx.toolRole.create({ data: { name: 'Student' } }),
        tx.toolRole.create({ data: { name: 'Researcher' } }),
        tx.toolRole.create({ data: { name: 'Entrepreneur' } }),
        tx.toolRole.create({ data: { name: 'Consultant' } }),
      ]);

      // Create Tool Industries
      const toolIndustries = await Promise.all([
        tx.toolIndustry.create({ data: { name: 'Technology' } }),
        tx.toolIndustry.create({ data: { name: 'Healthcare' } }),
        tx.toolIndustry.create({ data: { name: 'Finance' } }),
        tx.toolIndustry.create({ data: { name: 'Education' } }),
        tx.toolIndustry.create({ data: { name: 'E-commerce' } }),
        tx.toolIndustry.create({ data: { name: 'Manufacturing' } }),
        tx.toolIndustry.create({ data: { name: 'Media & Entertainment' } }),
        tx.toolIndustry.create({ data: { name: 'Real Estate' } }),
        tx.toolIndustry.create({ data: { name: 'Transportation' } }),
        tx.toolIndustry.create({ data: { name: 'Government' } }),
      ]);

      // Create 10 additional users
      const additionalUsers = await Promise.all([
        tx.user.create({
          data: {
            username: 'john_developer',
            first_name: 'John',
            last_name: 'Developer',
            email: 'john@example.com',
            password: await bcrypt.hash('password123', 10),
            role_id: roles.find((r) => r.role === RoleType.User)!.id,
            status: UserStatus.Active,
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
          },
        }),
        tx.user.create({
          data: {
            username: 'sarah_designer',
            first_name: 'Sarah',
            last_name: 'Designer',
            email: 'sarah@example.com',
            password: await bcrypt.hash('password123', 10),
            role_id: roles.find((r) => r.role === RoleType.User)!.id,
            status: UserStatus.Active,
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
          },
        }),
        tx.user.create({
          data: {
            username: 'mike_marketer',
            first_name: 'Mike',
            last_name: 'Marketer',
            email: 'mike@example.com',
            password: await bcrypt.hash('password123', 10),
            role_id: roles.find((r) => r.role === RoleType.User)!.id,
            status: UserStatus.Active,
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
          },
        }),
        tx.user.create({
          data: {
            username: 'lisa_analyst',
            first_name: 'Lisa',
            last_name: 'Analyst',
            email: 'lisa@example.com',
            password: await bcrypt.hash('password123', 10),
            role_id: roles.find((r) => r.role === RoleType.User)!.id,
            status: UserStatus.Active,
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
          },
        }),
        tx.user.create({
          data: {
            username: 'david_creator',
            first_name: 'David',
            last_name: 'Creator',
            email: 'david@example.com',
            password: await bcrypt.hash('password123', 10),
            role_id: roles.find((r) => r.role === RoleType.User)!.id,
            status: UserStatus.Active,
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
          },
        }),
        tx.user.create({
          data: {
            username: 'emma_student',
            first_name: 'Emma',
            last_name: 'Student',
            email: 'emma@example.com',
            password: await bcrypt.hash('password123', 10),
            role_id: roles.find((r) => r.role === RoleType.User)!.id,
            status: UserStatus.Active,
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
          },
        }),
        tx.user.create({
          data: {
            username: 'alex_researcher',
            first_name: 'Alex',
            last_name: 'Researcher',
            email: 'alex@example.com',
            password: await bcrypt.hash('password123', 10),
            role_id: roles.find((r) => r.role === RoleType.User)!.id,
            status: UserStatus.Active,
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
          },
        }),
        tx.user.create({
          data: {
            username: 'rachel_entrepreneur',
            first_name: 'Rachel',
            last_name: 'Entrepreneur',
            email: 'rachel@example.com',
            password: await bcrypt.hash('password123', 10),
            role_id: roles.find((r) => r.role === RoleType.User)!.id,
            status: UserStatus.Active,
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
          },
        }),
        tx.user.create({
          data: {
            username: 'tom_consultant',
            first_name: 'Tom',
            last_name: 'Consultant',
            email: 'tom@example.com',
            password: await bcrypt.hash('password123', 10),
            role_id: roles.find((r) => r.role === RoleType.User)!.id,
            status: UserStatus.Active,
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
          },
        }),
        tx.user.create({
          data: {
            username: 'nina_manager',
            first_name: 'Nina',
            last_name: 'Manager',
            email: 'nina@example.com',
            password: await bcrypt.hash('password123', 10),
            role_id: roles.find((r) => r.role === RoleType.User)!.id,
            status: UserStatus.Active,
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
          },
        }),
      ]);

      // Create 10 Tools with different statuses and updated avatar
      const tools = await Promise.all([
        tx.tool.create({
          data: {
            name: 'ChatGPT Pro',
            short_description: 'Advanced AI chatbot for business and personal use',
            website_url: 'https://chatgpt.com',
            user_id: additionalUsers[0].id, // john_developer
            is_claimed: true, // Has approved claim
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
            pricing_model: PricingModel.Freemium,
            features: ['AI Chat', 'Code Generation', 'Content Creation', 'Language Translation'],
            status: ToolStatus.Approved,
            is_unique: true,
            platform_availability: [PlatformAvailability.Web, PlatformAvailability.MobileApp],
            free_plan_available: true,
            free_plan_details: 'Free tier with limited messages',
            paid_plan_details: 'Pro plan with unlimited access',
            full_description:
              'ChatGPT Pro is an advanced AI chatbot that helps with various tasks including coding, writing, and analysis.',
            use_cases: ['Content Creation', 'Code Generation', 'Language Translation'],
            screenshots: [
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
            ],
            tool_roles: {
              connect: [
                { id: toolRoles[0].id }, // Developer
                { id: toolRoles[6].id }, // Student
                { id: toolRoles[7].id }, // Researcher
              ],
            },
            tool_industries: {
              connect: [
                { id: toolIndustries[0].id }, // Technology
                { id: toolIndustries[3].id }, // Education
                { id: toolIndustries[1].id }, // Healthcare
                { id: toolIndustries[2].id }, // Finance
              ],
            },
          },
        }),
        tx.tool.create({
          data: {
            name: 'Canva AI',
            short_description: 'AI-powered design tool for creating stunning visuals',
            website_url: 'https://canva.com',
            user_id: additionalUsers[1].id, // sarah_designer
            is_claimed: true, // Has approved claim
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1756813019576-tool-avatars/1756813019542-lf2lc5tycq.webp',
            pricing_model: PricingModel.Freemium,
            features: ['AI Design', 'Templates', 'Collaboration', 'Brand Kit'],
            status: ToolStatus.Approved,
            is_unique: true,
            platform_availability: [PlatformAvailability.Web, PlatformAvailability.MobileApp],
            free_plan_available: true,
            free_plan_details: 'Free templates and basic features',
            paid_plan_details: 'Pro plan with premium templates and features',
            full_description:
              'Canva AI revolutionizes design with intelligent features that make creating professional visuals effortless.',
            use_cases: ['Graphic Design', 'Social Media', 'Marketing Materials'],
            screenshots: [
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
            ],
            tool_roles: {
              connect: [
                { id: toolRoles[1].id }, // Designer
                { id: toolRoles[5].id }, // Content Creator
              ],
            },
            tool_industries: {
              connect: [
                { id: toolIndustries[0].id }, // Technology
                { id: toolIndustries[6].id }, // Media & Entertainment
              ],
            },
          },
        }),
        tx.tool.create({
          data: {
            name: 'Notion AI',
            short_description: 'Intelligent workspace for notes, docs, and collaboration',
            website_url: 'https://notion.so',
            user_id: additionalUsers[2].id, // mike_marketer
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1756813057436-tool-avatars/1756813056638-wkgvvu4wxml.webp',
            pricing_model: PricingModel.Freemium,
            features: ['AI Writing', 'Database', 'Templates', 'Integrations'],
            status: ToolStatus.Pending,
            is_unique: true,
            platform_availability: [
              PlatformAvailability.Web,
              PlatformAvailability.MobileApp,
              PlatformAvailability.Desktop,
            ],
            free_plan_available: true,
            free_plan_details: 'Free personal workspace',
            paid_plan_details: 'Team and enterprise plans available',
            full_description:
              'Notion AI enhances your workspace with intelligent writing assistance and organization tools.',
            use_cases: ['Note Taking', 'Project Management', 'Knowledge Base'],
            screenshots: [
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
            ],
            tool_roles: {
              connect: [
                { id: toolRoles[2].id }, // Product Manager
                { id: toolRoles[0].id }, // Developer
              ],
            },
            tool_industries: {
              connect: [
                { id: toolIndustries[0].id }, // Technology
                { id: toolIndustries[3].id }, // Education
              ],
            },
          },
        }),
        tx.tool.create({
          data: {
            name: 'HubSpot AI',
            short_description: 'AI-powered marketing and sales platform',
            website_url: 'https://hubspot.com',
            user_id: additionalUsers[3].id, // lisa_analyst
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1756813102250-tool-avatars/1756813100997-nm3sjuzg3oe.png',
            pricing_model: PricingModel.Subscription,
            features: ['AI Marketing', 'CRM', 'Email Automation', 'Analytics'],
            status: ToolStatus.Rejected,
            is_unique: true,
            platform_availability: [PlatformAvailability.Web],
            free_plan_available: false,
            free_plan_details: 'No free plan available',
            paid_plan_details: 'Starting from $45/month',
            full_description:
              'HubSpot AI provides comprehensive marketing and sales automation with intelligent insights.',
            use_cases: ['Marketing Automation', 'Sales CRM', 'Customer Analytics'],
            screenshots: [
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
            ],
          },
        }),
        tx.tool.create({
          data: {
            name: 'GitHub Copilot',
            short_description: 'AI pair programmer that helps you write better code',
            website_url: 'https://github.com/features/copilot',
            user_id: additionalUsers[4].id, // david_creator
            is_claimed: true, // Has approved claim
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1756813139364-tool-avatars/1756813137184-hw9scd5hor6.jpg',
            pricing_model: PricingModel.Subscription,
            features: [
              'Code Completion',
              'AI Pair Programming',
              'Multi-language Support',
              'IDE Integration',
            ],
            status: ToolStatus.Approved,
            is_unique: true,
            platform_availability: [PlatformAvailability.Desktop, PlatformAvailability.Web],
            free_plan_available: false,
            free_plan_details: 'No free plan available',
            paid_plan_details: '$10/month for individuals',
            full_description:
              'GitHub Copilot is your AI pair programmer that helps you write code faster and with fewer errors.',
            use_cases: ['Software Development', 'Code Review', 'Learning Programming'],
            screenshots: [
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
            ],
          },
        }),
        tx.tool.create({
          data: {
            name: 'Midjourney',
            short_description: 'AI art generator for creating stunning images from text',
            website_url: 'https://midjourney.com',
            user_id: additionalUsers[5].id, // emma_student
            is_claimed: true, // Has approved claim
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1756813218688-tool-avatars/1756813218642-fj224a9evb.avif',
            pricing_model: PricingModel.PaidOnly,
            features: ['Text-to-Image', 'High Resolution', 'Art Styles', 'Custom Prompts'],
            status: ToolStatus.Approved,
            is_unique: true,
            platform_availability: [PlatformAvailability.Web, PlatformAvailability.MobileApp],
            free_plan_available: false,
            free_plan_details: 'No free plan available',
            paid_plan_details: 'Starting from $10/month',
            full_description:
              'Midjourney creates beautiful artwork from text descriptions using advanced AI technology.',
            use_cases: ['Digital Art', 'Marketing Visuals', 'Concept Design'],
            screenshots: [
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
            ],
          },
        }),
        tx.tool.create({
          data: {
            name: 'Grammarly',
            short_description: 'AI-powered writing assistant for better communication',
            website_url: 'https://grammarly.com',
            user_id: additionalUsers[6].id, // alex_researcher
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1756813246589-tool-avatars/1756813246084-2ok9tob773b.png',
            pricing_model: PricingModel.Freemium,
            features: [
              'Grammar Check',
              'Style Suggestions',
              'Plagiarism Detection',
              'Tone Analysis',
            ],
            status: ToolStatus.Pending,
            is_unique: true,
            platform_availability: [
              PlatformAvailability.Web,
              PlatformAvailability.BrowserExtension,
            ],
            free_plan_available: true,
            free_plan_details: 'Basic grammar and spelling checks',
            paid_plan_details: 'Premium features and advanced suggestions',
            full_description:
              'Grammarly helps you write better by checking grammar, style, and tone in real-time.',
            use_cases: ['Writing', 'Email Communication', 'Academic Writing'],
            screenshots: [
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
            ],
          },
        }),
        tx.tool.create({
          data: {
            name: 'Zapier',
            short_description: 'Automate workflows between apps with AI-powered integrations',
            website_url: 'https://zapier.com',
            user_id: additionalUsers[7].id, // rachel_entrepreneur
            is_claimed: true, // Has approved claim
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1756813275153-tool-avatars/1756813274930-f4z5151th45.png',
            pricing_model: PricingModel.Freemium,
            features: ['Workflow Automation', 'App Integrations', 'AI Actions', 'Custom Zaps'],
            status: ToolStatus.Approved,
            is_unique: true,
            platform_availability: [PlatformAvailability.Web, PlatformAvailability.Api],
            free_plan_available: true,
            free_plan_details: '5 Zaps per month',
            paid_plan_details: 'Unlimited Zaps and premium features',
            full_description:
              'Zapier connects your apps and automates workflows to save time and increase productivity.',
            use_cases: ['Workflow Automation', 'Data Sync', 'Process Optimization'],
            screenshots: [
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
            ],
          },
        }),
        tx.tool.create({
          data: {
            name: 'Jasper',
            short_description: 'AI content generator for marketing and business',
            website_url: 'https://jasper.ai',
            user_id: additionalUsers[8].id, // tom_consultant
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1756813330079-tool-avatars/1756813329415-k6tjly694ns.webp',
            pricing_model: PricingModel.Subscription,
            features: ['Content Generation', 'SEO Optimization', 'Brand Voice', 'Templates'],
            status: ToolStatus.Rejected,
            is_unique: true,
            platform_availability: [PlatformAvailability.Web],
            free_plan_available: false,
            free_plan_details: 'No free plan available',
            paid_plan_details: 'Starting from $39/month',
            full_description:
              'Jasper helps businesses create high-quality content faster with AI-powered writing assistance.',
            use_cases: ['Content Marketing', 'Blog Writing', 'Social Media'],
            screenshots: [
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
            ],
          },
        }),
        tx.tool.create({
          data: {
            name: 'Figma AI',
            short_description: 'AI-powered design collaboration platform',
            website_url: 'https://figma.com',
            user_id: additionalUsers[9].id, // nina_manager
            is_claimed: true, // Has approved claim
            avatar:
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1756813372909-tool-avatars/1756813371710-6vs7dz41rwk.jpg',
            pricing_model: PricingModel.Freemium,
            features: ['AI Design', 'Real-time Collaboration', 'Prototyping', 'Design Systems'],
            status: ToolStatus.Approved,
            is_unique: true,
            platform_availability: [PlatformAvailability.Web, PlatformAvailability.Desktop],
            free_plan_available: true,
            free_plan_details: 'Free for individual users',
            paid_plan_details: 'Professional and enterprise plans',
            full_description:
              'Figma AI enhances design workflows with intelligent features and seamless collaboration.',
            use_cases: ['UI/UX Design', 'Prototyping', 'Design Collaboration'],
            screenshots: [
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
              'https://in-maa-1.linodeobjects.com/ai-tool-hub-store/1753962771539-tool-avatars/1753962771488-7f7zvtsa46h.png',
            ],
          },
        }),
      ]);

      // Generate embeddings for tools
      console.log('🔮 Generating embeddings for tools...');
      for (const tool of tools) {
        try {
          const sourceText = `${tool.name} ${tool.short_description} ${tool.full_description}`;
          const embedding = await getEmbedding(sourceText);
          await tx.$executeRawUnsafe(
            `UPDATE "Tool" SET embedding = $1::vector WHERE id = $2`,
            embedding,
            tool.id
          );
        } catch (error) {
          console.log(`Error generating embedding for tool ${tool.name}:`, error);
        }
      }

      // Create Tool Categories (Primary and Secondary)
      await tx.toolCategory.createMany({
        data: [
          // ChatGPT Pro - Primary: AI Tools, Secondary: Productivity Tools
          { tool_id: tools[0].id, category_id: toolCategory.id, type: CategoryType.Primary },
          { tool_id: tools[0].id, category_id: toolSub.id, type: CategoryType.Secondary },

          // Canva AI - Primary: AI Tools, Secondary: Productivity Tools
          { tool_id: tools[1].id, category_id: toolCategory.id, type: CategoryType.Primary },
          { tool_id: tools[1].id, category_id: toolSub.id, type: CategoryType.Secondary },

          // Notion AI - Primary: Productivity Tools, Secondary: AI Tools
          { tool_id: tools[2].id, category_id: toolSub.id, type: CategoryType.Primary },
          { tool_id: tools[2].id, category_id: toolCategory.id, type: CategoryType.Secondary },

          // HubSpot AI - Primary: AI Tools, Secondary: Productivity Tools
          { tool_id: tools[3].id, category_id: toolCategory.id, type: CategoryType.Primary },
          { tool_id: tools[3].id, category_id: toolSub.id, type: CategoryType.Secondary },

          // GitHub Copilot - Primary: Productivity Tools, Secondary: AI Tools
          { tool_id: tools[4].id, category_id: toolSub.id, type: CategoryType.Primary },
          { tool_id: tools[4].id, category_id: toolCategory.id, type: CategoryType.Secondary },

          // Midjourney - Primary: AI Tools, Secondary: Productivity Tools
          { tool_id: tools[5].id, category_id: toolCategory.id, type: CategoryType.Primary },
          { tool_id: tools[5].id, category_id: toolSub.id, type: CategoryType.Secondary },

          // Grammarly - Primary: Productivity Tools, Secondary: AI Tools
          { tool_id: tools[6].id, category_id: toolSub.id, type: CategoryType.Primary },
          { tool_id: tools[6].id, category_id: toolCategory.id, type: CategoryType.Secondary },

          // Zapier - Primary: AI Tools, Secondary: Productivity Tools
          { tool_id: tools[7].id, category_id: toolCategory.id, type: CategoryType.Primary },
          { tool_id: tools[7].id, category_id: toolSub.id, type: CategoryType.Secondary },

          // Jasper - Primary: AI Tools, Secondary: Productivity Tools
          { tool_id: tools[8].id, category_id: toolCategory.id, type: CategoryType.Primary },
          { tool_id: tools[8].id, category_id: toolSub.id, type: CategoryType.Secondary },

          // Figma AI - Primary: Productivity Tools, Secondary: AI Tools
          { tool_id: tools[9].id, category_id: toolSub.id, type: CategoryType.Primary },
          { tool_id: tools[9].id, category_id: toolCategory.id, type: CategoryType.Secondary },
        ],
      });

      // Create Social Links for Tools
      await tx.socialLink.createMany({
        data: [
          { platform: 'Twitter', url: 'https://twitter.com/chatgpt', tool_id: tools[0].id },
          {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/company/chatgpt',
            tool_id: tools[0].id,
          },
          { platform: 'Twitter', url: 'https://twitter.com/canva', tool_id: tools[1].id },
          { platform: 'Instagram', url: 'https://instagram.com/canva', tool_id: tools[1].id },
          { platform: 'Twitter', url: 'https://twitter.com/notion', tool_id: tools[2].id },
          {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/company/notion',
            tool_id: tools[2].id,
          },
          { platform: 'Twitter', url: 'https://twitter.com/hubspot', tool_id: tools[3].id },
          {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/company/hubspot',
            tool_id: tools[3].id,
          },
          { platform: 'Twitter', url: 'https://twitter.com/github', tool_id: tools[4].id },
          {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/company/github',
            tool_id: tools[4].id,
          },
          { platform: 'Twitter', url: 'https://twitter.com/midjourney', tool_id: tools[5].id },
          { platform: 'Discord', url: 'https://discord.gg/midjourney', tool_id: tools[5].id },
          { platform: 'Twitter', url: 'https://twitter.com/grammarly', tool_id: tools[6].id },
          {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/company/grammarly',
            tool_id: tools[6].id,
          },
          { platform: 'Twitter', url: 'https://twitter.com/zapier', tool_id: tools[7].id },
          {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/company/zapier',
            tool_id: tools[7].id,
          },
          { platform: 'Twitter', url: 'https://twitter.com/jasper_ai', tool_id: tools[8].id },
          {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/company/jasper-ai',
            tool_id: tools[8].id,
          },
          { platform: 'Twitter', url: 'https://twitter.com/figma', tool_id: tools[9].id },
          { platform: 'LinkedIn', url: 'https://linkedin.com/company/figma', tool_id: tools[9].id },
        ],
      });

      // Create Tool Tags
      await tx.toolTag.createMany({
        data: [
          { tool_id: tools[0].id, tag_id: tags[0].id }, // ChatGPT - Machine Learning
          { tool_id: tools[0].id, tag_id: tags[5].id }, // ChatGPT - AI
          { tool_id: tools[1].id, tag_id: tags[2].id }, // Canva - Design
          { tool_id: tools[1].id, tag_id: tags[5].id }, // Canva - AI
          { tool_id: tools[2].id, tag_id: tags[1].id }, // Notion - Productivity
          { tool_id: tools[2].id, tag_id: tags[5].id }, // Notion - AI
          { tool_id: tools[3].id, tag_id: tags[3].id }, // HubSpot - Marketing
          { tool_id: tools[3].id, tag_id: tags[5].id }, // HubSpot - AI
          { tool_id: tools[4].id, tag_id: tags[4].id }, // GitHub Copilot - Development
          { tool_id: tools[4].id, tag_id: tags[5].id }, // GitHub Copilot - AI
          { tool_id: tools[5].id, tag_id: tags[2].id }, // Midjourney - Design
          { tool_id: tools[5].id, tag_id: tags[5].id }, // Midjourney - AI
          { tool_id: tools[6].id, tag_id: tags[1].id }, // Grammarly - Productivity
          { tool_id: tools[6].id, tag_id: tags[5].id }, // Grammarly - AI
          { tool_id: tools[7].id, tag_id: tags[6].id }, // Zapier - Automation
          { tool_id: tools[7].id, tag_id: tags[5].id }, // Zapier - AI
          { tool_id: tools[8].id, tag_id: tags[3].id }, // Jasper - Marketing
          { tool_id: tools[8].id, tag_id: tags[5].id }, // Jasper - AI
          { tool_id: tools[9].id, tag_id: tags[2].id }, // Figma - Design
          { tool_id: tools[9].id, tag_id: tags[5].id }, // Figma - AI
        ],
      });

      // Create 10 Tool Claims with different statuses
      await tx.toolClaim.createMany({
        data: [
          {
            tool_id: tools[0].id,
            claimant_id: additionalUsers[0].id, // john_developer
            status: 'Approved',
            full_name: 'Sarah Johnson',
            job: 'AI Research Lead',
            company_email: 'sarah.johnson@openai.com',
            phone: '+12345678901',
            relationship: 'Creator',
            company_website: 'https://openai.com',
            tool_website: 'https://chatgpt.com',
            company_image: 'https://openai.com/business-card.png',
            professional_profile: 'https://linkedin.com/in/sarahjohnson',
            additional_information:
              'I am the product manager responsible for ChatGPT Pro development and would like to claim ownership.',
          },
          {
            tool_id: tools[1].id,
            claimant_id: additionalUsers[1].id, // sarah_designer
            status: 'Approved',
            full_name: 'Michael Chen',
            job: 'Design Director',
            company_email: 'michael.chen@canva.com',
            phone: '+12345678902',
            relationship: 'CEO',
            company_website: 'https://canva.com',
            tool_website: 'https://canva.com/ai',
            company_image: 'https://canva.com/company-card.png',
            professional_profile: 'https://linkedin.com/in/michaelchen',
            additional_information:
              'I lead the AI design team at Canva and want to claim ownership of our AI features.',
          },
          {
            tool_id: tools[2].id,
            claimant_id: additionalUsers[2].id, // mike_marketer
            status: 'Pending',
            full_name: 'Emily Rodriguez',
            job: 'Product Manager',
            company_email: 'emily.rodriguez@notion.so',
            phone: '+12345678903',
            relationship: 'MarketingManager',
            company_website: 'https://notion.so',
            tool_website: 'https://notion.so/ai',
            company_image: 'https://notion.so/business-card.png',
            professional_profile: 'https://linkedin.com/in/emilyrodriguez',
            additional_information:
              'I manage the AI features at Notion and would like to claim ownership of our AI workspace tools.',
          },
          {
            tool_id: tools[3].id,
            claimant_id: additionalUsers[3].id, // lisa_analyst
            status: 'Rejected',
            full_name: 'David Kim',
            job: 'Marketing Director',
            company_email: 'david.kim@hubspot.com',
            phone: '+12345678904',
            relationship: 'Creator',
            company_website: 'https://hubspot.com',
            tool_website: 'https://hubspot.com/ai',
            company_image: 'https://hubspot.com/company-card.png',
            professional_profile: 'https://linkedin.com/in/davidkim',
            additional_information:
              'I oversee the AI marketing tools at HubSpot and want to claim ownership of our AI platform.',
          },
          {
            tool_id: tools[4].id,
            claimant_id: additionalUsers[4].id, // david_creator
            status: 'Approved',
            full_name: 'Lisa Wang',
            job: 'Engineering Manager',
            company_email: 'lisa.wang@github.com',
            phone: '+12345678905',
            relationship: 'Creator',
            company_website: 'https://github.com',
            tool_website: 'https://github.com/features/copilot',
            company_image: 'https://github.com/business-card.png',
            professional_profile: 'https://linkedin.com/in/lisawang',
            additional_information:
              'I lead the GitHub Copilot team and would like to claim ownership of our AI pair programming tool.',
          },
          {
            tool_id: tools[5].id,
            claimant_id: additionalUsers[5].id, // emma_student
            status: 'Approved',
            full_name: 'Alex Thompson',
            job: 'AI Art Director',
            company_email: 'alex.thompson@midjourney.com',
            phone: '+12345678906',
            relationship: 'Creator',
            company_website: 'https://midjourney.com',
            tool_website: 'https://midjourney.com',
            company_image: 'https://midjourney.com/business-card.png',
            professional_profile: 'https://linkedin.com/in/alexthompson',
            additional_information:
              'I lead the creative team at Midjourney and want to claim ownership of our AI art generation platform.',
          },
          {
            tool_id: tools[6].id,
            claimant_id: additionalUsers[6].id, // alex_researcher
            status: 'Pending',
            full_name: 'Rachel Green',
            job: 'Product Manager',
            company_email: 'rachel.green@grammarly.com',
            phone: '+12345678907',
            relationship: 'MarketingManager',
            company_website: 'https://grammarly.com',
            tool_website: 'https://grammarly.com',
            company_image: 'https://grammarly.com/business-card.png',
            professional_profile: 'https://linkedin.com/in/rachelgreen',
            additional_information:
              'I manage the AI writing features at Grammarly and would like to claim ownership of our writing assistant.',
          },
          {
            tool_id: tools[7].id,
            claimant_id: additionalUsers[7].id, // rachel_entrepreneur
            status: 'Approved',
            full_name: 'Chris Wilson',
            job: 'Automation Specialist',
            company_email: 'chris.wilson@zapier.com',
            phone: '+12345678908',
            relationship: 'Creator',
            company_website: 'https://zapier.com',
            tool_website: 'https://zapier.com',
            company_image: 'https://zapier.com/business-card.png',
            professional_profile: 'https://linkedin.com/in/chriswilson',
            additional_information:
              'I lead the automation team at Zapier and want to claim ownership of our workflow automation platform.',
          },
          {
            tool_id: tools[8].id,
            claimant_id: additionalUsers[8].id, // tom_consultant
            status: 'Rejected',
            full_name: 'Maria Garcia',
            job: 'Content Director',
            company_email: 'maria.garcia@jasper.ai',
            phone: '+12345678909',
            relationship: 'MarketingManager',
            company_website: 'https://jasper.ai',
            tool_website: 'https://jasper.ai',
            company_image: 'https://jasper.ai/business-card.png',
            professional_profile: 'https://linkedin.com/in/mariagarcia',
            additional_information:
              'I oversee the content generation features at Jasper and would like to claim ownership of our AI writing platform.',
          },
          {
            tool_id: tools[9].id,
            claimant_id: additionalUsers[9].id, // nina_manager
            status: 'Approved',
            full_name: 'James Brown',
            job: 'Design Manager',
            company_email: 'james.brown@figma.com',
            phone: '+12345678910',
            relationship: 'Creator',
            company_website: 'https://figma.com',
            tool_website: 'https://figma.com',
            company_image: 'https://figma.com/business-card.png',
            professional_profile: 'https://linkedin.com/in/jamesbrown',
            additional_information:
              'I lead the design team at Figma and want to claim ownership of our AI-powered design collaboration platform.',
          },
        ],
      });

      // Create 10 Tool Submissions with different statuses
      await tx.toolSubmission.createMany({
        data: [
          {
            tool_id: tools[0].id,
            user_id: additionalUsers[0].id, // john_developer
            status: 'Approved',
            internal_notes:
              'High-quality AI chatbot with strong market presence. Ready for approval.',
          },
          {
            tool_id: tools[1].id,
            user_id: additionalUsers[1].id, // sarah_designer
            status: 'Approved',
            internal_notes: 'Popular design tool with AI features. Good user base and reviews.',
          },
          {
            tool_id: tools[2].id,
            user_id: additionalUsers[2].id, // mike_marketer
            status: 'Pending',
            internal_notes:
              'Leading productivity tool with AI integration. Strong enterprise adoption.',
          },
          {
            tool_id: tools[3].id,
            user_id: additionalUsers[3].id, // lisa_analyst
            status: 'Rejected',
            internal_notes:
              'Comprehensive marketing platform with AI capabilities. Well-established brand.',
          },
          {
            tool_id: tools[4].id,
            user_id: additionalUsers[4].id, // david_creator
            status: 'Approved',
            internal_notes:
              'Revolutionary AI coding assistant. High developer adoption and positive feedback.',
          },
          {
            tool_id: tools[5].id,
            user_id: additionalUsers[5].id, // emma_student
            status: 'Approved',
            internal_notes:
              'Excellent AI art generation tool with high-quality output and strong community.',
          },
          {
            tool_id: tools[6].id,
            user_id: additionalUsers[6].id, // alex_researcher
            status: 'Pending',
            internal_notes:
              'Popular writing assistant with AI features. Good user base and positive reviews.',
          },
          {
            tool_id: tools[7].id,
            user_id: additionalUsers[7].id, // rachel_entrepreneur
            status: 'Approved',
            internal_notes:
              'Leading workflow automation platform with AI integration. Strong enterprise adoption.',
          },
          {
            tool_id: tools[8].id,
            user_id: additionalUsers[8].id, // tom_consultant
            status: 'Rejected',
            internal_notes:
              'AI content generation tool. Needs more verification of features and capabilities.',
          },
          {
            tool_id: tools[9].id,
            user_id: additionalUsers[9].id, // nina_manager
            status: 'Approved',
            internal_notes:
              'Excellent design collaboration platform with AI features. Strong design community adoption.',
          },
        ],
      });

      // Create News with new fields and category structure
      const newsItems = await Promise.all([
        tx.news.create({
          data: {
            headline: 'OpenAI Releases GPT-5',
            seo_title: '',
            url_slug: 'openai-releases-gpt-5',
            content:
              'OpenAI has announced the release of GPT-5, their most advanced language model yet...',
            image: '',
            is_featured: true,
            status: ArticleStatus.Published,
            moderation_status: ModerationStatus.Approved,
            user_id: user.id,
            allow_comments: false,
          },
        }),
        tx.news.create({
          data: {
            headline: 'Introduction to HTML Basics',
            seo_title: 'introduction-to-html-basics',
            url_slug: 'introduction-to-html-basics',
            content:
              '<p>Introduction to web development basics with HTML, CSS, and JavaScript.</p>',
            image: 'blob:https://ai-tool-hub.getprixite.com/4d33726b-bdd1-471e-8559-d84fd67b5459',
            is_featured: true,
            status: ArticleStatus.Draft,
            moderation_status: ModerationStatus.Pending,
            user_id: user.id,
            published_date: new Date('2025-09-04T00:00:00.000Z'),
            published_time: '10:00',
            visibility: 'Public',
            allow_comments: false,
          },
        }),
        tx.news.create({
          data: {
            headline: 'CSS Flexbox Guide',
            seo_title: 'css-flexbox-guide',
            url_slug: 'css-flexbox-guide',
            content:
              "<p>A beginner's guide to Python programming with hands-on coding examples.</p>",
            image: 'blob:https://ai-tool-hub.getprixite.com/1fce2360-1cb9-480f-ac04-f0635416135b',
            is_featured: true,
            status: ArticleStatus.Scheduled,
            moderation_status: ModerationStatus.Pending,
            user_id: user.id,
            published_date: new Date('2025-09-01T00:00:00.000Z'),
            published_time: '10:00',
            visibility: 'Public',
            allow_comments: false,
          },
        }),
      ]);

      // Generate embeddings for news items
      console.log('🔮 Generating embeddings for news items...');
      for (const news of newsItems) {
        try {
          const sourceText = `${news.headline} ${news.content}`;
          const embedding = await getEmbedding(sourceText);
          await tx.$executeRawUnsafe(
            `UPDATE "News" SET embedding = $1::vector WHERE id = $2`,
            embedding,
            news.id
          );
        } catch (error) {
          console.log(`Error generating embedding for news ${news.headline}:`, error);
        }
      }

      // Add primary categories to news items
      await Promise.all([
        tx.newsCategory.create({
          data: {
            news_id: newsItems[0].id,
            category_id: newsCategory.id,
            type: CategoryType.Primary,
          },
        }),
        tx.newsCategory.create({
          data: {
            news_id: newsItems[1].id,
            category_id: newsCategory.id,
            type: CategoryType.Primary,
          },
        }),
        tx.newsCategory.create({
          data: {
            news_id: newsItems[2].id,
            category_id: newsCategory.id,
            type: CategoryType.Primary,
          },
        }),
      ]);

      // Create Articles with new fields and category structure
      const articles = await Promise.all([
        tx.article.create({
          data: {
            headline: 'What is SuperAI?',
            url_slug: 'what-is-superai',
            content:
              'SuperAI is an amazing AI tool that revolutionizes how we interact with artificial intelligence...',
            image: 'https://example.com/superai-article.jpg',
            is_featured: true,
            status: ArticleStatus.Published,
            moderation_status: ModerationStatus.Approved,
            user_id: user.id,
            allow_comments: false,
          },
        }),
        tx.article.create({
          data: {
            headline: 'Introduction to HTML Basics',
            url_slug: 'introduction-to-html-basics',
            content:
              '<p>Introduction to web development basics with HTML, CSS, and JavaScript.</p>',
            image: 'blob:https://ai-tool-hub.getprixite.com/8bb25d03-98a5-4b9a-8c99-ff5ec87eaa0d',
            is_featured: false,
            status: ArticleStatus.Draft,
            moderation_status: ModerationStatus.Pending,
            user_id: user.id,
            published_date: new Date('2025-09-01T16:50:00.000Z'),
            visibility: 'Public',
            allow_comments: true,
          },
        }),
        tx.article.create({
          data: {
            headline: 'CSS Flexbox Guide',
            url_slug: 'css-flexbox-guide',
            content:
              "<p>A beginner's guide to Python programming with hands-on coding examples.</p>",
            image: 'blob:https://ai-tool-hub.getprixite.com/3f98234b-7b73-4ef4-8c06-1da15fb5490d',
            is_featured: false,
            status: ArticleStatus.Scheduled,
            moderation_status: ModerationStatus.Pending,
            user_id: user.id,
            published_date: new Date('2025-09-03T18:48:00.000Z'),
            visibility: 'Public',
            allow_comments: true,
          },
        }),
      ]);

      // Generate embeddings for articles
      console.log('🔮 Generating embeddings for articles...');
      for (const article of articles) {
        try {
          const sourceText = `${article.headline} ${article.content}`;
          const embedding = await getEmbedding(sourceText);
          await tx.$executeRawUnsafe(
            `UPDATE "Article" SET embedding = $1::vector WHERE id = $2`,
            embedding,
            article.id
          );
        } catch (error) {
          console.log(`Error generating embedding for article ${article.headline}:`, error);
        }
      }

      // Add primary categories to articles
      await Promise.all([
        tx.articleCategory.create({
          data: {
            article_id: articles[0].id,
            category_id: articleCategory.id,
            type: CategoryType.Primary,
          },
        }),
        tx.articleCategory.create({
          data: {
            article_id: articles[1].id,
            category_id: articleCategory.id,
            type: CategoryType.Primary,
          },
        }),
        tx.articleCategory.create({
          data: {
            article_id: articles[2].id,
            category_id: articleCategory.id,
            type: CategoryType.Primary,
          },
        }),
      ]);

      // Create Learning Resources with new fields and category structure
      const learningResources = await Promise.all([
        tx.learning.create({
          data: {
            title: 'Introduction to Machine Learning',
            url_slug: 'intro-machine-learning',
            description: 'Learn the basics of machine learning with this comprehensive course',
            image: 'https://example.com/ml-course.jpg',
            skill_level: 'Beginner',
            lesson_link: 'https://example.com/course/ml-intro',
            is_featured: true,
            status: LearningStatus.Published,
            moderation_status: ModerationStatus.Approved,
            user_id: user.id,
            allow_comments: false,
          },
        }),
        tx.learning.create({
          data: {
            title: 'Introduction to HTML Basics',
            url_slug: 'introduction-to-html-basics',
            description: '',
            image: 'blob:https://ai-tool-hub.getprixite.com/df847ba5-8488-447a-9ae0-6a70a28b9818',
            skill_level: 'Beginner',
            lesson_link: 'https://youtu.be/HcOc7P5BMi4?si=K8kLuzAC4BmuLzPo',
            is_featured: false,
            status: LearningStatus.Draft,
            moderation_status: ModerationStatus.Pending,
            user_id: user.id,
            published_date: new Date('2025-09-04T00:00:00.000Z'),
            published_time: '16:52',
            visibility: 'Public',
            allow_comments: true,
          },
        }),
        tx.learning.create({
          data: {
            title: 'CSS Flexbox Guide',
            url_slug: 'css-flexbox-guide',
            description: '',
            image: 'blob:https://ai-tool-hub.getprixite.com/28f6b49f-cbdc-414d-958e-50538f4726ac',
            skill_level: 'Beginner',
            lesson_link: 'https://youtu.be/HcOc7P5BMi4?si=YHyob41EyiLdoLfG',
            is_featured: false,
            status: LearningStatus.Scheduled,
            moderation_status: ModerationStatus.Pending,
            user_id: user.id,
            published_date: new Date('2025-09-01T00:00:00.000Z'),
            published_time: '18:51',
            visibility: 'Public',
            allow_comments: true,
          },
        }),
      ]);

      // Generate embeddings for learning resources
      console.log('🔮 Generating embeddings for learning resources...');
      for (const learning of learningResources) {
        try {
          const sourceText = `${learning.title} ${learning.description}`;
          const embedding = await getEmbedding(sourceText);
          await tx.$executeRawUnsafe(
            `UPDATE "Learning" SET embedding = $1::vector WHERE id = $2`,
            embedding,
            learning.id
          );
        } catch (error) {
          console.log(`Error generating embedding for learning ${learning.title}:`, error);
        }
      }

      // Add primary categories to learning resources
      await Promise.all([
        tx.learningCategory.create({
          data: {
            learning_id: learningResources[0].id,
            category_id: learningCategory.id,
            type: CategoryType.Primary,
          },
        }),
        tx.learningCategory.create({
          data: {
            learning_id: learningResources[1].id,
            category_id: learningCategory.id,
            type: CategoryType.Primary,
          },
        }),
        tx.learningCategory.create({
          data: {
            learning_id: learningResources[2].id,
            category_id: learningCategory.id,
            type: CategoryType.Primary,
          },
        }),
      ]);

      // Create Prompts with new fields and category structure
      const prompts = await Promise.all([
        tx.prompt.create({
          data: {
            title: 'Creative Writing Assistant',
            url_slug: 'creative-writing-assistant',
            ai_models: ['GPT-4', 'Claude'],
            short_description: 'A prompt to help with creative writing tasks',
            main_prompt:
              'You are a creative writing assistant. Help me write a compelling story about...',
            user_guide: 'Use this prompt when you need help with creative writing projects',
            is_featured: true,
            status: PromptStatus.Published,
            moderation_status: ModerationStatus.Approved,
            user_id: user.id,
          },
        }),
        tx.prompt.create({
          data: {
            title: 'CSS Flexbox Guide',
            url_slug: 'css-flexbox-guide',
            ai_models: ['Claude', 'Gemini'],
            short_description:
              "A beginner's guide to Python programming with hands-on coding examples.",
            main_prompt: 'Introduction to web development basics with HTML, CSS, and JavaScript.',
            user_guide: "A beginner's guide to Python programming with hands-on coding examples.",
            is_featured: false,
            status: PromptStatus.Draft,
            moderation_status: ModerationStatus.Approved,
            user_id: user.id,
            published_date: new Date('2025-09-01T00:00:00.000Z'),
            published_time: '16:55',
          },
        }),
        tx.prompt.create({
          data: {
            title: 'Introduction to HTML Basics',
            url_slug: 'introduction-to-html-basic',
            ai_models: ['GPT-4', 'Gemini'],
            short_description:
              "A beginner's guide to Python programming with hands-on coding examples.",
            main_prompt: "A beginner's guide to Python programming with hands-on coding examples.",
            user_guide: "A beginner's guide to Python programming with hands-on coding examples.",
            is_featured: false,
            status: PromptStatus.Scheduled,
            moderation_status: ModerationStatus.Approved,
            user_id: user.id,
            published_date: new Date('2025-09-01T00:00:00.000Z'),
            published_time: '17:55',
          },
        }),
      ]);

      // Generate embeddings for prompts
      console.log('🔮 Generating embeddings for prompts...');
      for (const prompt of prompts) {
        try {
          const sourceText = `${prompt.title} ${prompt.short_description} ${prompt.main_prompt}`;
          const embedding = await getEmbedding(sourceText);
          await tx.$executeRawUnsafe(
            `UPDATE "Prompt" SET embedding = $1::vector WHERE id = $2`,
            embedding,
            prompt.id
          );
        } catch (error) {
          console.log(`Error generating embedding for prompt ${prompt.title}:`, error);
        }
      }

      // Add primary categories to prompts
      await Promise.all([
        tx.promptCategory.create({
          data: {
            prompt_id: prompts[0].id,
            category_id: promptCategory.id,
            type: CategoryType.Primary,
          },
        }),
        tx.promptCategory.create({
          data: {
            prompt_id: prompts[1].id,
            category_id: promptCategory.id,
            type: CategoryType.Primary,
          },
        }),
        tx.promptCategory.create({
          data: {
            prompt_id: prompts[2].id,
            category_id: promptCategory.id,
            type: CategoryType.Primary,
          },
        }),
      ]);

      // Event
      await tx.event.create({
        data: {
          title: 'AI Conference 2025',
          description: 'Annual conference on AI',
          event_date: new Date(Date.now() + 7 * 24 * 3600 * 1000),
          approved: true,
        },
      });

      // Create GlossaryTerms with new fields and category structure
      await tx.glossaryTerm.createMany({
        data: [
          {
            term: 'AI',
            definition:
              'Artificial Intelligence - The simulation of human intelligence in machines that are programmed to think and learn like humans.',
            status: GlossaryStatus.Published,
            moderation_status: ModerationStatus.Approved,
            is_featured: true,
            user_id: user.id,
          },
          {
            term: 'Machine Learning',
            definition:
              'A subset of AI that enables systems to automatically learn and improve from experience without being explicitly programmed.',
            status: GlossaryStatus.Published,
            moderation_status: ModerationStatus.Approved,
            is_featured: false,
            user_id: user.id,
          },
          {
            term: 'Deep Learning',
            definition:
              'A subset of machine learning that uses neural networks with multiple layers to model and understand complex patterns.',
            status: GlossaryStatus.Published,
            moderation_status: ModerationStatus.Approved,
            is_featured: false,
            user_id: user.id,
          },
          {
            term: 'Neural Network',
            definition:
              'A computing system inspired by biological neural networks, consisting of interconnected nodes that process information.',
            status: GlossaryStatus.Published,
            moderation_status: ModerationStatus.Approved,
            is_featured: false,
            user_id: user.id,
          },
          {
            term: 'Natural Language Processing',
            definition:
              'A branch of AI that helps computers understand, interpret, and manipulate human language.',
            status: GlossaryStatus.Published,
            moderation_status: ModerationStatus.Approved,
            is_featured: false,
            user_id: user.id,
          },
        ],
      });

      // Add glossary categories to glossary terms
      const createdGlossaryTerms = await tx.glossaryTerm.findMany({
        where: { user_id: user.id },
      });

      // Generate embeddings for glossary terms
      console.log('🔮 Generating embeddings for glossary terms...');
      for (const term of createdGlossaryTerms) {
        try {
          const sourceText = `${term.term} ${term.definition}`;
          const embedding = await getEmbedding(sourceText);
          await tx.$executeRawUnsafe(
            `UPDATE "GlossaryTerm" SET embedding = $1::vector WHERE id = $2`,
            embedding,
            term.id
          );
        } catch (error) {
          console.log(`Error generating embedding for glossary term ${term.term}:`, error);
        }
      }

      for (const term of createdGlossaryTerms) {
        await tx.glossaryTermCategory.create({
          data: {
            glossary_term_id: term.id,
            category_id: glossaryCategory.id,
            type: CategoryType.Primary,
          },
        });
      }

      // ✅ Review with Nested Criteria
      const review = await tx.review.create({
        data: {
          user_id: user.id,
          tool_id: tools[0].id,
          overall_rating: 5,
          comment: 'good',
          status: ReviewStatus.Approved,
          criteria: {
            create: [
              { name: 'Quality', rating: 4, comment: 'Good' },
              { name: 'Ease of Use', rating: 5, comment: 'Very intuitive' },
            ],
          },
        },
      });

      // Review Moderation
      await tx.reviewModeration.create({
        data: {
          review_id: review.id,
          moderator_id: user.id,
          remarks: 'Fine',
        },
      });

      // Create additional reviews for new users
      const additionalReviews = await Promise.all([
        tx.review.create({
          data: {
            user_id: additionalUsers[0].id, // john_developer
            tool_id: tools[4].id, // GitHub Copilot
            overall_rating: 5,
            comment: 'Excellent coding assistant! Saves me hours every day.',
            status: ReviewStatus.Approved,
            criteria: {
              create: [
                { name: 'Code Quality', rating: 5, comment: 'Generates high-quality code' },
                { name: 'Learning Curve', rating: 4, comment: 'Easy to get started' },
              ],
            },
          },
        }),
        tx.review.create({
          data: {
            user_id: additionalUsers[1].id, // sarah_designer
            tool_id: tools[1].id, // Canva AI
            overall_rating: 4,
            comment: 'Great for quick design work. AI suggestions are helpful.',
            status: ReviewStatus.Approved,
            criteria: {
              create: [
                { name: 'Design Quality', rating: 4, comment: 'Good templates and AI features' },
                { name: 'User Interface', rating: 5, comment: 'Very intuitive design' },
              ],
            },
          },
        }),
        tx.review.create({
          data: {
            user_id: additionalUsers[2].id, // mike_marketer
            tool_id: tools[3].id, // HubSpot AI
            overall_rating: 4,
            comment: 'Powerful marketing automation. AI insights are valuable.',
            status: ReviewStatus.Approved,
            criteria: {
              create: [
                { name: 'Marketing Features', rating: 4, comment: 'Comprehensive marketing tools' },
                { name: 'Analytics', rating: 5, comment: 'Excellent reporting capabilities' },
              ],
            },
          },
        }),
        tx.review.create({
          data: {
            user_id: additionalUsers[3].id, // lisa_analyst
            tool_id: tools[0].id, // ChatGPT Pro
            overall_rating: 5,
            comment: 'Perfect for data analysis and research tasks.',
            status: ReviewStatus.Approved,
            criteria: {
              create: [
                {
                  name: 'Analytical Capabilities',
                  rating: 5,
                  comment: 'Excellent for data analysis',
                },
                { name: 'Research Support', rating: 5, comment: 'Great for research tasks' },
              ],
            },
          },
        }),
        tx.review.create({
          data: {
            user_id: additionalUsers[4].id, // david_creator
            tool_id: tools[5].id, // Midjourney
            overall_rating: 4,
            comment: 'Amazing for creating visual content. AI art generation is impressive.',
            status: ReviewStatus.Approved,
            criteria: {
              create: [
                { name: 'Art Quality', rating: 4, comment: 'High-quality AI-generated art' },
                { name: 'Creativity', rating: 5, comment: 'Very creative outputs' },
              ],
            },
          },
        }),
        tx.review.create({
          data: {
            user_id: additionalUsers[5].id, // emma_student
            tool_id: tools[6].id, // Grammarly
            overall_rating: 4,
            comment: 'Essential for academic writing. Catches all my grammar mistakes.',
            status: ReviewStatus.Approved,
            criteria: {
              create: [
                { name: 'Grammar Check', rating: 5, comment: 'Excellent grammar correction' },
                { name: 'Academic Writing', rating: 4, comment: 'Great for essays and papers' },
              ],
            },
          },
        }),
        tx.review.create({
          data: {
            user_id: additionalUsers[6].id, // alex_researcher
            tool_id: tools[2].id, // Notion AI
            overall_rating: 4,
            comment: 'Perfect for organizing research notes and collaborating with team.',
            status: ReviewStatus.Approved,
            criteria: {
              create: [
                { name: 'Organization', rating: 5, comment: 'Excellent for research organization' },
                { name: 'Collaboration', rating: 4, comment: 'Good team collaboration features' },
              ],
            },
          },
        }),
        tx.review.create({
          data: {
            user_id: additionalUsers[7].id, // rachel_entrepreneur
            tool_id: tools[7].id, // Zapier
            overall_rating: 5,
            comment: 'Game-changer for business automation. Saves countless hours.',
            status: ReviewStatus.Approved,
            criteria: {
              create: [
                { name: 'Automation', rating: 5, comment: 'Excellent workflow automation' },
                { name: 'Integration', rating: 4, comment: 'Great app integrations' },
              ],
            },
          },
        }),
        tx.review.create({
          data: {
            user_id: additionalUsers[8].id, // tom_consultant
            tool_id: tools[9].id, // Figma AI
            overall_rating: 4,
            comment: 'Great for client presentations and design collaboration.',
            status: ReviewStatus.Approved,
            criteria: {
              create: [
                { name: 'Design Tools', rating: 4, comment: 'Excellent design capabilities' },
                { name: 'Client Collaboration', rating: 5, comment: 'Perfect for client work' },
              ],
            },
          },
        }),
        tx.review.create({
          data: {
            user_id: additionalUsers[9].id, // nina_manager
            tool_id: tools[8].id, // Jasper
            overall_rating: 3,
            comment: 'Good for content creation but could be more accurate.',
            status: ReviewStatus.Approved,
            criteria: {
              create: [
                { name: 'Content Quality', rating: 3, comment: 'Decent content generation' },
                { name: 'Accuracy', rating: 3, comment: 'Sometimes generates inaccurate content' },
              ],
            },
          },
        }),
      ]);

      // Create review moderations for additional reviews
      await Promise.all(
        additionalReviews.map((review) =>
          tx.reviewModeration.create({
            data: {
              review_id: review.id,
              moderator_id: user.id,
              remarks: 'Approved - Good quality review',
            },
          })
        )
      );

      // Create some flagged reviews for testing
      const flaggedReviews = await Promise.all([
        tx.review.create({
          data: {
            user_id: additionalUsers[0].id,
            tool_id: tools[2].id, // Notion AI
            overall_rating: 2,
            comment: 'This tool is terrible and should be removed from the platform.',
            status: ReviewStatus.Flagged,
            criteria: {
              create: [
                { name: 'Quality', rating: 1, comment: 'Poor quality' },
                { name: 'Ease of Use', rating: 2, comment: 'Difficult to use' },
              ],
            },
          },
        }),
        tx.review.create({
          data: {
            user_id: additionalUsers[1].id,
            tool_id: tools[6].id, // Grammarly
            overall_rating: 1,
            comment: 'Spam review - this tool is completely useless.',
            status: ReviewStatus.Flagged,
            criteria: {
              create: [
                { name: 'Functionality', rating: 1, comment: 'Does not work as advertised' },
                { name: 'Value', rating: 1, comment: 'No value for money' },
              ],
            },
          },
        }),
      ]);

      // Create review moderations for flagged reviews
      await Promise.all(
        flaggedReviews.map((review) =>
          tx.reviewModeration.create({
            data: {
              review_id: review.id,
              moderator_id: user.id,
              remarks: 'Flagged - Inappropriate content detected',
            },
          })
        )
      );

      // Newsletter Seeding
      console.log('📧 Creating newsletters...');

      const newsletters = await Promise.all([
        // Weekly AI Tools Newsletter
        tx.newsletter.create({
          data: {
            subject: 'Weekly AI Tools Roundup',
            template: `
            <h1>🚀 This Week's Top AI Tools</h1>
            <p>Discover the latest and greatest AI tools that are making waves in the industry.</p>
            <h2>Featured Tools:</h2>
            <ul>
              <li>ChatGPT - Advanced language model for conversations</li>
              <li>Midjourney - AI-powered image generation</li>
              <li>Notion AI - Intelligent workspace assistant</li>
            </ul>
            <p>Stay tuned for more updates next week!</p>
          `,
            frequency: 'Weekly',
            send_day: 'Monday',
            send_time: new Date('2024-01-01T09:00:00Z'),
            start_date: new Date('2024-01-01T09:00:00Z'),
            status: 'Sent',
            is_enabled: true,
            send_mode: 'Automatic',
            template_type: 'TOP_TOOLS_WEEK',
            fallback_type: 'SHOW_POPULAR_TOOLS',
          },
        }),

        // Monthly Learning Content Newsletter
        tx.newsletter.create({
          data: {
            subject: 'Monthly AI Learning Digest',
            template: `
            <h1>📚 AI Learning Resources</h1>
            <p>Your monthly guide to mastering artificial intelligence.</p>
            <h2>This Month's Highlights:</h2>
            <ul>
              <li>Machine Learning Fundamentals Course</li>
              <li>Deep Learning with PyTorch Tutorial</li>
              <li>AI Ethics and Responsible Development</li>
            </ul>
            <p>Keep learning and growing with AI!</p>
          `,
            frequency: 'Monthly',
            send_day: 'Friday',
            send_time: new Date('2024-01-01T18:00:00Z'),
            start_date: new Date('2024-01-01T18:00:00Z'),
            status: 'Sent',
            is_enabled: true,
            send_mode: 'Automatic',
            template_type: 'FEATURED_LEARNING_CONTENT',
            fallback_type: 'INCLUDE_TRENDING_CONTENT',
          },
        }),

        // Daily AI News Newsletter
        tx.newsletter.create({
          data: {
            subject: 'Daily AI News Update',
            template: `
            <h1>📰 Today's AI Headlines</h1>
            <p>Stay updated with the latest developments in artificial intelligence.</p>
            <h2>Breaking News:</h2>
            <ul>
              <li>OpenAI releases GPT-5 with enhanced capabilities</li>
              <li>Google announces new AI research breakthrough</li>
              <li>Microsoft integrates AI into Office 365</li>
            </ul>
            <p>More updates tomorrow!</p>
          `,
            frequency: 'Daily',
            send_day: 'Monday',
            send_time: new Date('2024-01-01T08:00:00Z'),
            start_date: new Date('2024-01-01T08:00:00Z'),
            status: 'Sent',
            is_enabled: true,
            send_mode: 'Automatic',
            template_type: 'AI_NEWS',
            fallback_type: 'INCLUDE_TRENDING_CONTENT',
          },
        }),

        // Custom Newsletter (Draft)
        tx.newsletter.create({
          data: {
            subject: 'Special AI Conference Announcement',
            template: `
            <h1>🎯 AI Conference 2024</h1>
            <p>Join us for the biggest AI conference of the year!</p>
            <h2>Event Details:</h2>
            <ul>
              <li>Date: March 15-17, 2024</li>
              <li>Location: San Francisco, CA</li>
              <li>Keynote Speakers: Industry leaders and researchers</li>
            </ul>
            <p>Registration opens soon!</p>
          `,
            frequency: 'Custom',
            send_day: null,
            send_time: null,
            start_date: new Date('2024-03-15T10:00:00Z'),
            status: 'Draft',
            is_enabled: false,
            send_mode: 'Approval',
            template_type: 'AI_NEWSLETTER_OVERVIEW',
            fallback_type: 'SHOW_POPULAR_TOOLS',
          },
        }),

        // Scheduled Newsletter
        tx.newsletter.create({
          data: {
            subject: 'AI Tools Comparison Guide',
            template: `
            <h1>🔍 AI Tools Comparison</h1>
            <p>Comprehensive comparison of popular AI tools to help you choose the right one.</p>
            <h2>Tools Compared:</h2>
            <ul>
              <li>ChatGPT vs Claude vs Bard</li>
              <li>Midjourney vs DALL-E vs Stable Diffusion</li>
              <li>GitHub Copilot vs Amazon CodeWhisperer</li>
            </ul>
            <p>Make informed decisions for your AI journey!</p>
          `,
            frequency: 'Weekly',
            send_day: 'Wednesday',
            send_time: new Date('2024-01-01T14:00:00Z'),
            start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
            status: 'Scheduled',
            is_enabled: true,
            send_mode: 'Automatic',
            template_type: 'AI_NEWSLETTER_OVERVIEW',
            fallback_type: 'SHOW_POPULAR_TOOLS',
          },
        }),

        // Failed Newsletter
        tx.newsletter.create({
          data: {
            subject: 'AI Security Best Practices',
            template: `
            <h1>🔒 AI Security Guide</h1>
            <p>Essential security practices for AI development and deployment.</p>
            <h2>Key Topics:</h2>
            <ul>
              <li>Data privacy and protection</li>
              <li>Model security and robustness</li>
              <li>Ethical AI development</li>
            </ul>
            <p>Stay secure in the AI era!</p>
          `,
            frequency: 'Monthly',
            send_day: 'Tuesday',
            send_time: new Date('2024-01-01T16:00:00Z'),
            start_date: new Date('2024-01-01T16:00:00Z'),
            status: 'Failed',
            is_enabled: true,
            send_mode: 'Automatic',
            template_type: 'AI_NEWSLETTER_OVERVIEW',
            fallback_type: 'SHOW_POPULAR_TOOLS',
          },
        }),

        // Cancelled Newsletter
        tx.newsletter.create({
          data: {
            subject: 'AI Market Trends Report',
            template: `
            <h1>📊 AI Market Analysis</h1>
            <p>Quarterly report on AI market trends and investment opportunities.</p>
            <h2>Report Highlights:</h2>
            <ul>
              <li>Market size and growth projections</li>
              <li>Investment trends and funding rounds</li>
              <li>Emerging AI sectors and startups</li>
            </ul>
            <p>Strategic insights for investors and entrepreneurs!</p>
          `,
            frequency: 'Monthly',
            send_day: 'Thursday',
            send_time: new Date('2024-01-01T11:00:00Z'),
            start_date: new Date('2024-01-01T11:00:00Z'),
            status: 'Cancelled',
            is_enabled: false,
            send_mode: 'Approval',
            template_type: 'AI_NEWSLETTER_OVERVIEW',
            fallback_type: 'INCLUDE_TRENDING_CONTENT',
          },
        }),

        // Bi-weekly Developer Newsletter
        tx.newsletter.create({
          data: {
            subject: 'AI Developer Weekly',
            template: `
            <h1>👨‍💻 AI Developer Resources</h1>
            <p>Your bi-weekly guide to AI development tools and techniques.</p>
            <h2>Developer Tools:</h2>
            <ul>
              <li>New AI libraries and frameworks</li>
              <li>Code examples and tutorials</li>
              <li>Best practices and optimization tips</li>
              <li>Community highlights and events</li>
            </ul>
            <p>Level up your AI development skills!</p>
          `,
            frequency: 'Weekly',
            send_day: 'Tuesday',
            send_time: new Date('2024-01-01T10:00:00Z'),
            start_date: new Date('2024-01-01T10:00:00Z'),
            status: 'Sent',
            is_enabled: true,
            send_mode: 'Automatic',
            template_type: 'AI_NEWSLETTER_OVERVIEW',
            fallback_type: 'SHOW_POPULAR_TOOLS',
          },
        }),

        // Quarterly Research Newsletter
        tx.newsletter.create({
          data: {
            subject: 'AI Research Quarterly',
            template: `
            <h1>🔬 AI Research Highlights</h1>
            <p>Quarterly digest of breakthrough research in artificial intelligence.</p>
            <h2>Research Areas:</h2>
            <ul>
              <li>Natural Language Processing advances</li>
              <li>Computer Vision breakthroughs</li>
              <li>Reinforcement Learning innovations</li>
              <li>AI Ethics and Governance research</li>
            </ul>
            <p>Stay ahead of the AI research curve!</p>
          `,
            frequency: 'Monthly',
            send_day: 'Friday',
            send_time: new Date('2024-01-01T15:00:00Z'),
            start_date: new Date('2024-01-01T15:00:00Z'),
            status: 'Sent',
            is_enabled: true,
            send_mode: 'Automatic',
            template_type: 'FEATURED_LEARNING_CONTENT',
            fallback_type: 'INCLUDE_TRENDING_CONTENT',
          },
        }),
      ]);

      console.log(`✅ Created ${newsletters.length} newsletters`);

      // Create newsletter engagements for analytics testing
      console.log('📊 Creating newsletter engagements...');

      const engagementPromises = [];

      // Add engagements for sent newsletters (first 5)
      for (let i = 0; i < 5; i++) {
        const newsletter = newsletters[i];

        // Create multiple engagements with varying open/click rates
        for (let j = 0; j < 50; j++) {
          const isOpened = Math.random() > 0.3; // 70% open rate
          const isClicked = isOpened && Math.random() > 0.6; // 40% click rate for opened emails

          engagementPromises.push(
            tx.newsletterEngagement.create({
              data: {
                newsletter_id: newsletter.id,
                opened: isOpened,
                clicked: isClicked,
              },
            })
          );
        }
      }

      // Add some engagements for the scheduled newsletter
      for (let j = 0; j < 25; j++) {
        engagementPromises.push(
          tx.newsletterEngagement.create({
            data: {
              newsletter_id: newsletters[5].id, // Scheduled newsletter (index 5)
              opened: Math.random() > 0.4, // 60% open rate
              clicked: Math.random() > 0.7, // 30% click rate
            },
          })
        );
      }

      // Add engagements for the last 2 newsletters (Research and Developer)
      for (let i = 6; i < 8; i++) {
        const newsletter = newsletters[i];

        for (let j = 0; j < 40; j++) {
          const isOpened = Math.random() > 0.25; // 75% open rate for specialized content
          const isClicked = isOpened && Math.random() > 0.5; // 50% click rate for specialized content

          engagementPromises.push(
            tx.newsletterEngagement.create({
              data: {
                newsletter_id: newsletter.id,
                opened: isOpened,
                clicked: isClicked,
              },
            })
          );
        }
      }

      await Promise.all(engagementPromises);
      console.log(`✅ Created ${engagementPromises.length} newsletter engagements`);

      // Create sample comments for different content types
      console.log('💬 Creating sample comments...');

      const comments = await Promise.all([
        // Tool comments
        tx.comment.create({
          data: {
            content: 'This tool has been incredibly helpful for my coding projects!',
            content_type: 'TOOL',
            content_id: tools[0].id,
            user_id: additionalUsers[0].id,
            status: 'APPROVED',
          },
        }),
        tx.comment.create({
          data: {
            content: 'Great design tool, the AI features are amazing!',
            content_type: 'TOOL',
            content_id: tools[1].id, // Canva AI
            user_id: additionalUsers[1].id,
            status: 'APPROVED',
          },
        }),
        tx.comment.create({
          data: {
            content: 'Perfect for productivity and note-taking.',
            content_type: 'TOOL',
            content_id: tools[2].id, // Notion AI
            user_id: additionalUsers[2].id,
            status: 'APPROVED',
          },
        }),

        // News comments
        tx.comment.create({
          data: {
            content: 'Exciting news! GPT-5 will be a game-changer.',
            content_type: 'NEWS',
            content_id: newsItems[0].id,
            user_id: user.id,
            status: 'APPROVED',
          },
        }),
        tx.comment.create({
          data: {
            content: 'Looking forward to seeing the new capabilities.',
            content_type: 'NEWS',
            content_id: newsItems[0].id,
            user_id: additionalUsers[0].id,
            status: 'APPROVED',
          },
        }),

        // Article comments
        tx.comment.create({
          data: {
            content: 'Very informative article about SuperAI!',
            content_type: 'ARTICLE',
            content_id: articles[0].id,
            user_id: additionalUsers[1].id,
            status: 'APPROVED',
          },
        }),
        tx.comment.create({
          data: {
            content: 'Great explanation of AI concepts.',
            content_type: 'ARTICLE',
            content_id: articles[0].id,
            user_id: additionalUsers[2].id,
            status: 'APPROVED',
          },
        }),

        // Learning comments
        tx.comment.create({
          data: {
            content: 'This course helped me understand ML basics!',
            content_type: 'LEARNING',
            content_id: learningResources[0].id,
            user_id: additionalUsers[3].id,
            status: 'APPROVED',
          },
        }),
        tx.comment.create({
          data: {
            content: 'Excellent course for beginners.',
            content_type: 'LEARNING',
            content_id: learningResources[0].id,
            user_id: additionalUsers[4].id,
            status: 'APPROVED',
          },
        }),

        // Prompt comments
        tx.comment.create({
          data: {
            content: 'This prompt template is very useful for writing!',
            content_type: 'PROMPT',
            content_id: prompts[0].id,
            user_id: additionalUsers[5].id,
            status: 'APPROVED',
          },
        }),
        tx.comment.create({
          data: {
            content: 'Great for creative writing projects.',
            content_type: 'PROMPT',
            content_id: prompts[0].id,
            user_id: additionalUsers[6].id,
            status: 'APPROVED',
          },
        }),
        tx.comment.create({
          data: {
            content: 'Excellent CSS guide, very helpful!',
            content_type: 'PROMPT',
            content_id: prompts[1].id,
            user_id: additionalUsers[7].id,
            status: 'APPROVED',
          },
        }),
        tx.comment.create({
          data: {
            content: 'Perfect for learning HTML basics.',
            content_type: 'PROMPT',
            content_id: prompts[2].id,
            user_id: additionalUsers[8].id,
            status: 'APPROVED',
          },
        }),

        // Glossary comments
        tx.comment.create({
          data: {
            content: 'Clear and concise definition of AI.',
            content_type: 'GLOSSARY',
            content_id: createdGlossaryTerms[0].id, // AI term
            user_id: additionalUsers[7].id,
            status: 'APPROVED',
          },
        }),
        tx.comment.create({
          data: {
            content: 'Very helpful explanation of machine learning.',
            content_type: 'GLOSSARY',
            content_id: createdGlossaryTerms[1].id, // Machine Learning term
            user_id: additionalUsers[8].id,
            status: 'APPROVED',
          },
        }),

        // Some pending comments for moderation testing
        tx.comment.create({
          data: {
            content: 'This tool needs improvement in user interface.',
            content_type: 'TOOL',
            content_id: tools[3].id, // HubSpot AI
            user_id: additionalUsers[9].id,
            status: 'PENDING',
          },
        }),
        tx.comment.create({
          data: {
            content: 'Interesting article, but could use more examples.',
            content_type: 'ARTICLE',
            content_id: articles[0].id,
            user_id: additionalUsers[0].id,
            status: 'PENDING',
          },
        }),

        // Some rejected comments
        tx.comment.create({
          data: {
            content: 'This is spam content that should be removed.',
            content_type: 'TOOL',
            content_id: tools[4].id, // GitHub Copilot
            user_id: additionalUsers[1].id,
            status: 'REJECTED',
          },
        }),

        // Some flagged comments
        tx.comment.create({
          data: {
            content: 'Inappropriate content that needs review.',
            content_type: 'NEWS',
            content_id: newsItems[0].id,
            user_id: additionalUsers[2].id,
            status: 'FLAGGED',
          },
        }),

        // Nested comments (replies)
        tx.comment.create({
          data: {
            content: 'I agree, this tool is amazing!',
            content_type: 'TOOL',
            content_id: tools[0].id, // ChatGPT Pro
            user_id: additionalUsers[3].id,
            status: 'APPROVED',
          },
        }),
        tx.comment.create({
          data: {
            content: 'Thanks for sharing your experience!',
            content_type: 'TOOL',
            content_id: tools[0].id, // ChatGPT Pro
            user_id: additionalUsers[4].id,
            status: 'APPROVED',
          },
        }),
      ]);

      console.log(`✅ Created ${comments.length} sample comments`);

      // FormField
      await tx.formField.create({
        data: {
          label: 'Email',
          type: 'email',
          required: true,
          position: 1,
        },
      });

      // EmailTemplate
      await tx.emailTemplate.create({
        data: {
          name: 'Welcome Email',
          content: 'Hello {{name}}, welcome to SuperAI!',
        },
      });

      console.log('✅ Seeding complete inside transaction');
    },
    {
      timeout: 180000, // 3 minutes timeout for embedding generation
    }
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });

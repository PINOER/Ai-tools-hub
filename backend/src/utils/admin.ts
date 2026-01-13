import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, getModelByName, Resource } from '@adminjs/prisma';
import { prisma } from '@config/index.ts';

AdminJS.registerAdapter({ Database, Resource });

// List of all your Prisma model names
const modelNames = [
  'Role',
  'User',
  'PasswordReset',
  'Tool',
  'ToolClaim',
  'ToolSubmission',
  'NewsTag',
  'ArticleTag',
  'GlossaryTag',
  'LearningTag',
  'PromptTag',
  'News',
  'Article',
  'Learning',
  'Prompt',
  'PromptChain',
  'Event',
  'Category',
  'Tag',
  'Review',
  'ReviewCriteria',
  'ReviewModeration',
  'ReviewHelpfulVote',
  'ReviewReport',
  'Newsletter',
  'NewsletterEngagement',
  'FormField',
  'EmailTemplate',
  'AuditLog',
  'GlossaryTerm',
  'GlossaryTermRelation',
  'SocialLink',
  'ToolComparisonSet',
  'ToolComparisonTool',
  'Notification',
  'UserPreferences',
  'APIKey',
  'Bookmark',
  'Comment',
  'Vote',
];

// Dynamically generate resources
const resources = modelNames.map((name) => ({
  resource: { model: getModelByName(name), client: prisma },
  options: {},
}));

// Create AdminJS instance
const admin = new AdminJS({ resources });

// Export the AdminJS router
export default AdminJSExpress.buildRouter(admin);

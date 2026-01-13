// src/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication routes',
      },
      {
        name: 'Categories',
        description: 'Category management routes',
      },
      {
        name: 'Glossary',
        description: 'Glossary terms and AI glossary management',
      },
      {
        name: 'Prompts',
        description: 'AI Prompt management',
      },
      {
        name: 'Prompt Chains',
        description: 'Prompt chain management routes',
      },
      {
        name: 'Reviews',
        description: 'Review management routes',
      },
      {
        name: 'Tags',
        description: 'Tag management routes',
      },
      {
        name: 'Tool Claims',
        description: 'Tool claim management routes',
      },
      {
        name: 'Tool Submissions',
        description: 'Tool submission management routes',
      },
      {
        name: 'Tools',
        description: 'Tools routes',
      },
      {
        name: 'Users',
        description: 'User management routes',
      },
      {
        name: 'AWS',
        description: 'AWS S3 presigned URL generation',
      },
      {
        name: 'Newsletters',
        description: 'Newsletter management and analytics routes',
      },
      {
        name: 'Comments',
        description: 'Comment management routes',
      },
      {
        
        name: 'Import/Export',
        description: 'Import and export data for various entities',
      },
      {
        name: 'Relatedness',
        description: 'Get related content based on tags and NLP similarity',
      },
    ],
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation using Swagger with JSDoc comments',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['src/features/**/*.ts']
});

CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('Active', 'Inactive', 'Banned', 'Suspended', 'Deleted', 'Pending');

-- CreateEnum
CREATE TYPE "public"."ToolStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Deleted');

-- CreateEnum
CREATE TYPE "public"."PricingModel" AS ENUM ('Free', 'Paid', 'Freemium', 'Subscription', 'PaidOnly', 'OneTimePurchase');

-- CreateEnum
CREATE TYPE "public"."PlatformAvailability" AS ENUM ('Web', 'Desktop', 'MobileApp', 'BrowserExtension', 'Api');

-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('Public', 'Private', 'Unlisted', 'FeaturedOnHomepage', 'IncludeInNewsletter');

-- CreateEnum
CREATE TYPE "public"."ReviewStatus" AS ENUM ('Approved', 'PendingReport', 'Reported', 'Flagged');

-- CreateEnum
CREATE TYPE "public"."ArticleStatus" AS ENUM ('Draft', 'Published', 'Scheduled');

-- CreateEnum
CREATE TYPE "public"."LearningStatus" AS ENUM ('Draft', 'Published', 'Scheduled');

-- CreateEnum
CREATE TYPE "public"."SkillLevel" AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- CreateEnum
CREATE TYPE "public"."PromptStatus" AS ENUM ('Draft', 'Published', 'Scheduled');

-- CreateEnum
CREATE TYPE "public"."BookmarkTargetType" AS ENUM ('Tool', 'News', 'Article', 'Learning', 'Prompt', 'Glossary');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('System', 'Update', 'Newsletter', 'Review');

-- CreateEnum
CREATE TYPE "public"."ImportExportStatus" AS ENUM ('Pending', 'Processing', 'Completed', 'Failed', 'Cancelled');

-- CreateEnum
CREATE TYPE "public"."EntityType" AS ENUM ('Tool', 'Prompt', 'Glossary', 'News', 'Article', 'Learning', 'Category', 'Tag');

-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('Import', 'Export');

-- CreateEnum
CREATE TYPE "public"."RoleType" AS ENUM ('Admin', 'Moderator', 'User', 'Contributor');

-- CreateEnum
CREATE TYPE "public"."ClaimStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "public"."CategoryType" AS ENUM ('Primary', 'Secondary');

-- CreateEnum
CREATE TYPE "public"."GlossaryStatus" AS ENUM ('Draft', 'Published', 'Scheduled');

-- CreateEnum
CREATE TYPE "public"."GlossarySource" AS ENUM ('MANUAL', 'AI');

-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('Email', 'Github', 'Facebook', 'Gmail');

-- CreateEnum
CREATE TYPE "public"."ModerationStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "public"."Section" AS ENUM ('Tool', 'News', 'Article', 'Learning', 'Prompt', 'Glossary');

-- CreateEnum
CREATE TYPE "public"."Relationship" AS ENUM ('Creator', 'CEO', 'MarketingManager');

-- CreateEnum
CREATE TYPE "public"."NewsletterFrequency" AS ENUM ('Daily', 'Weekly', 'Monthly', 'Custom');

-- CreateEnum
CREATE TYPE "public"."WeekDay" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateEnum
CREATE TYPE "public"."SendMode" AS ENUM ('Automatic', 'Approval');

-- CreateEnum
CREATE TYPE "public"."NewsletterTemplateContent" AS ENUM ('AI_NEWSLETTER_OVERVIEW', 'TOP_TOOLS_WEEK', 'TOP_ARTICLES_WEEK', 'FEATURED_LEARNING_CONTENT', 'AI_NEWS');

-- CreateEnum
CREATE TYPE "public"."FallbackContent" AS ENUM ('SHOW_POPULAR_TOOLS', 'INCLUDE_TRENDING_CONTENT');

-- CreateEnum
CREATE TYPE "public"."NewsletterStatus" AS ENUM ('Draft', 'Scheduled', 'Sent', 'Failed', 'Cancelled');

-- CreateEnum
CREATE TYPE "public"."SiteStatus" AS ENUM ('Live', 'Maintenance');

-- CreateEnum
CREATE TYPE "public"."ReviewApprovalStatus" AS ENUM ('AutoPublish', 'AdminApproval');

-- CreateEnum
CREATE TYPE "public"."SubmissionApprovalStatus" AS ENUM ('AutoApprove', 'AdminApproval');

-- CreateEnum
CREATE TYPE "public"."EmailServiceProvider" AS ENUM ('SMTP', 'SendGrid', 'Mailgun', 'AmazonSES');

-- CreateEnum
CREATE TYPE "public"."EmailNotificationType" AS ENUM ('ToolSubmission', 'ArticleSubmission', 'LearningSubmission', 'FlaggedContentReport', 'NewUserRegistration');

-- CreateEnum
CREATE TYPE "public"."SitemapSetting" AS ENUM ('Tools', 'Users', 'Articles', 'Learning', 'News');

-- CreateEnum
CREATE TYPE "public"."CommentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "public"."CommentContentType" AS ENUM ('TOOL', 'NEWS', 'ARTICLE', 'LEARNING', 'PROMPT', 'GLOSSARY');

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" SERIAL NOT NULL,
    "role" "public"."RoleType" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "role_id" INTEGER NOT NULL,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'Active',
    "avatar" TEXT,
    "provider" "public"."Provider" NOT NULL DEFAULT 'Email',
    "provider_id" TEXT,
    "access_token" TEXT,
    "bio" TEXT,
    "moderation_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bookmark" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "target_id" INTEGER NOT NULL,
    "target_type" "public"."BookmarkTargetType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tool" (
    "id" SERIAL NOT NULL,
    "avatar" TEXT,
    "name" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "user_id" INTEGER,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_claimed" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."ToolStatus" NOT NULL DEFAULT 'Pending',
    "website_url" TEXT NOT NULL,
    "seo_meta_title" TEXT,
    "seo_meta_description" TEXT,
    "pricing_model" "public"."PricingModel",
    "free_plan_available" BOOLEAN DEFAULT false,
    "free_plan_details" TEXT,
    "paid_plan_details" TEXT,
    "platform_availability" "public"."PlatformAvailability"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "full_description" TEXT,
    "use_cases" TEXT[],
    "features" TEXT[],
    "screenshots" TEXT[],
    "is_unique" BOOLEAN NOT NULL,
    "embedding" vector,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ToolClaim" (
    "id" SERIAL NOT NULL,
    "tool_id" INTEGER NOT NULL,
    "claimant_id" INTEGER,
    "status" "public"."ClaimStatus" NOT NULL DEFAULT 'Pending',
    "review_notes" TEXT,
    "full_name" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "company_email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "relationship" "public"."Relationship" NOT NULL,
    "company_website" TEXT NOT NULL,
    "tool_website" TEXT,
    "company_image" TEXT NOT NULL,
    "professional_profile" TEXT NOT NULL,
    "additional_information" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ToolSubmission" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "tool_id" INTEGER NOT NULL,
    "status" "public"."ClaimStatus" NOT NULL DEFAULT 'Pending',
    "internal_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ToolTag" (
    "tool_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "ToolTag_pkey" PRIMARY KEY ("tool_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."ToolCategory" (
    "id" SERIAL NOT NULL,
    "tool_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "type" "public"."CategoryType" NOT NULL,

    CONSTRAINT "ToolCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NewsTag" (
    "news_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "NewsTag_pkey" PRIMARY KEY ("news_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."ArticleTag" (
    "article_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "ArticleTag_pkey" PRIMARY KEY ("article_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."GlossaryTag" (
    "glossary_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "GlossaryTag_pkey" PRIMARY KEY ("glossary_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."LearningTag" (
    "learning_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "LearningTag_pkey" PRIMARY KEY ("learning_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."PromptTag" (
    "prompt_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "PromptTag_pkey" PRIMARY KEY ("prompt_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."News" (
    "id" SERIAL NOT NULL,
    "headline" TEXT NOT NULL,
    "seo_title" TEXT,
    "url_slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "user_id" INTEGER,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."ArticleStatus" NOT NULL DEFAULT 'Draft',
    "moderation_status" "public"."ModerationStatus" NOT NULL DEFAULT 'Pending',
    "published_date" TIMESTAMP(3),
    "published_time" TEXT,
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'Public',
    "allow_comments" BOOLEAN NOT NULL DEFAULT false,
    "embedding" vector,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Article" (
    "id" SERIAL NOT NULL,
    "headline" TEXT NOT NULL,
    "url_slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "user_id" INTEGER,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."ArticleStatus" NOT NULL DEFAULT 'Draft',
    "moderation_status" "public"."ModerationStatus" NOT NULL DEFAULT 'Pending',
    "published_date" TIMESTAMP(3),
    "published_time" TEXT,
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'Public',
    "allow_comments" BOOLEAN NOT NULL DEFAULT false,
    "embedding" vector,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Learning" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url_slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "user_id" INTEGER,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."LearningStatus" NOT NULL DEFAULT 'Draft',
    "moderation_status" "public"."ModerationStatus" NOT NULL DEFAULT 'Pending',
    "skill_level" "public"."SkillLevel" NOT NULL,
    "lesson_link" TEXT NOT NULL,
    "published_date" TIMESTAMP(3),
    "published_time" TEXT,
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'Public',
    "allow_comments" BOOLEAN NOT NULL DEFAULT false,
    "embedding" vector,

    CONSTRAINT "Learning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prompt" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url_slug" TEXT NOT NULL,
    "user_id" INTEGER,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."PromptStatus" NOT NULL DEFAULT 'Draft',
    "moderation_status" "public"."ModerationStatus" NOT NULL DEFAULT 'Pending',
    "ai_models" TEXT[],
    "short_description" TEXT,
    "main_prompt" TEXT NOT NULL,
    "user_guide" TEXT,
    "published_date" TIMESTAMP(3),
    "published_time" TEXT,
    "moderation_notes" TEXT,
    "allow_comments" BOOLEAN NOT NULL DEFAULT false,
    "embedding" vector,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PromptCategory" (
    "id" SERIAL NOT NULL,
    "prompt_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "type" "public"."CategoryType" NOT NULL,

    CONSTRAINT "PromptCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PromptChain" (
    "id" SERIAL NOT NULL,
    "prompt_id" INTEGER NOT NULL,
    "part_number" INTEGER NOT NULL,
    "step_title" TEXT NOT NULL,
    "step_description" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "PromptChain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "event_date" TIMESTAMP(3),
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" SERIAL NOT NULL,
    "section" "public"."Section" NOT NULL,
    "name" TEXT NOT NULL,
    "url_slug" TEXT NOT NULL,
    "description" TEXT,
    "display_order" INTEGER,
    "seo_title" TEXT,
    "parentCategoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "tool_id" INTEGER NOT NULL,
    "overall_rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "helpful_count" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."ReviewStatus" NOT NULL DEFAULT 'Approved',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReviewCriteria" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "review_id" INTEGER NOT NULL,

    CONSTRAINT "ReviewCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReviewModeration" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "remarks" TEXT NOT NULL,
    "moderator_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewModeration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReviewHelpfulVote" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "review_id" INTEGER NOT NULL,

    CONSTRAINT "ReviewHelpfulVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReviewReport" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Newsletter" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "frequency" "public"."NewsletterFrequency" NOT NULL DEFAULT 'Daily',
    "send_day" "public"."WeekDay",
    "send_time" TIMESTAMP(3),
    "start_date" TIMESTAMP(3),
    "status" "public"."NewsletterStatus" NOT NULL DEFAULT 'Draft',
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "send_mode" "public"."SendMode" NOT NULL DEFAULT 'Automatic',
    "template_type" "public"."NewsletterTemplateContent" NOT NULL DEFAULT 'AI_NEWSLETTER_OVERVIEW',
    "fallback_type" "public"."FallbackContent" NOT NULL DEFAULT 'SHOW_POPULAR_TOOLS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NewsletterEngagement" (
    "id" SERIAL NOT NULL,
    "newsletter_id" INTEGER NOT NULL,
    "opened" BOOLEAN NOT NULL DEFAULT false,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FormField" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "type_id" INTEGER,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmailTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GlossaryTerm" (
    "id" SERIAL NOT NULL,
    "term" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "status" "public"."GlossaryStatus" NOT NULL DEFAULT 'Draft',
    "moderation_status" "public"."ModerationStatus" NOT NULL DEFAULT 'Pending',
    "source" "public"."GlossarySource" NOT NULL DEFAULT 'MANUAL',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "allow_comments" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER,
    "embedding" vector,

    CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GlossaryTermCategory" (
    "id" SERIAL NOT NULL,
    "glossary_term_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "type" "public"."CategoryType" NOT NULL,

    CONSTRAINT "GlossaryTermCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GlossaryTermRelation" (
    "id" SERIAL NOT NULL,
    "term_id" INTEGER NOT NULL,
    "related_id" INTEGER NOT NULL,

    CONSTRAINT "GlossaryTermRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GlossaryEditSubmission" (
    "id" SERIAL NOT NULL,
    "glossary_term_id" INTEGER NOT NULL,
    "term" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "status" "public"."ModerationStatus" NOT NULL DEFAULT 'Pending',
    "admin_comment" TEXT,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GlossaryEditSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SocialLink" (
    "id" SERIAL NOT NULL,
    "tool_id" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ToolComparisonSet" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "is_shared" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolComparisonSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ToolComparisonTool" (
    "id" SERIAL NOT NULL,
    "tool_id" INTEGER NOT NULL,
    "comparison_set_id" INTEGER NOT NULL,

    CONSTRAINT "ToolComparisonTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPreferences" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "newsletter_subscribed" BOOLEAN NOT NULL DEFAULT true,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "search_alerts" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."APIKey" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "key_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "permissions" TEXT NOT NULL,
    "rate_limit" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "last_used" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "APIKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" INTEGER,
    "status" "public"."CommentStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "content_type" "public"."CommentContentType" NOT NULL,
    "content_id" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vote" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "prompt_id" INTEGER NOT NULL,
    "vote_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PasswordReset" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NewsCategory" (
    "id" SERIAL NOT NULL,
    "news_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "type" "public"."CategoryType" NOT NULL,

    CONSTRAINT "NewsCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArticleCategory" (
    "id" SERIAL NOT NULL,
    "article_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "type" "public"."CategoryType" NOT NULL,

    CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LearningCategory" (
    "id" SERIAL NOT NULL,
    "learning_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "type" "public"."CategoryType" NOT NULL,

    CONSTRAINT "LearningCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ToolRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ToolIndustry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolIndustry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ImportExportJob" (
    "id" TEXT NOT NULL,
    "entityType" "public"."EntityType" NOT NULL,
    "jobType" "public"."JobType" NOT NULL,
    "fileName" TEXT,
    "filePath" TEXT,
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "processedRows" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."ImportExportStatus" NOT NULL DEFAULT 'Pending',
    "errorLogs" TEXT,
    "metadata" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "ImportExportJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActivityLog" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "user_id" INTEGER,
    "reference_id" INTEGER,
    "entity_type" TEXT,
    "entity_name" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."site_information" (
    "id" SERIAL NOT NULL,
    "site_name" TEXT NOT NULL,
    "site_description" TEXT NOT NULL,
    "site_tagline" TEXT NOT NULL,
    "status" "public"."SiteStatus" NOT NULL DEFAULT 'Live',
    "maintenance_message" TEXT,
    "favicon" TEXT,
    "social_preview" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "sitemap_settings" "public"."SitemapSetting"[] DEFAULT ARRAY[]::"public"."SitemapSetting"[],
    "google_search_console_verification" TEXT,
    "bing_webmaster_tools_verification" TEXT,
    "twitter_url" TEXT,
    "github_url" TEXT,
    "linkedin_url" TEXT,
    "youtube_url" TEXT,
    "google_analytics_id" TEXT,
    "google_tag_manager_id" TEXT,
    "facebook_pixel_id" TEXT,
    "review_status" BOOLEAN NOT NULL DEFAULT true,
    "review_approval" "public"."ReviewApprovalStatus" NOT NULL DEFAULT 'AutoPublish',
    "min_review_length" INTEGER NOT NULL DEFAULT 10,
    "max_review_length" INTEGER NOT NULL DEFAULT 500,
    "tool_submission_approval" "public"."SubmissionApprovalStatus" NOT NULL DEFAULT 'AdminApproval',
    "article_submission_approval" "public"."SubmissionApprovalStatus" NOT NULL DEFAULT 'AdminApproval',
    "learning_submission_approval" "public"."SubmissionApprovalStatus" NOT NULL DEFAULT 'AdminApproval',
    "admin_notification_email" TEXT,
    "notify_admins_for" "public"."EmailNotificationType"[] DEFAULT ARRAY[]::"public"."EmailNotificationType"[],
    "email_service_provider" "public"."EmailServiceProvider" NOT NULL DEFAULT 'SMTP',
    "smtp_host" TEXT,
    "smtp_port" INTEGER,
    "smtp_username" TEXT,
    "smtp_password" TEXT,
    "from_email" TEXT,
    "from_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ToolRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ToolRoles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_ToolIndustries" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ToolIndustries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_key" ON "public"."Role"("role");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_name_key" ON "public"."Tool"("name");

-- CreateIndex
CREATE UNIQUE INDEX "News_url_slug_key" ON "public"."News"("url_slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_url_slug_key" ON "public"."Category"("url_slug");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewHelpfulVote_user_id_review_id_key" ON "public"."ReviewHelpfulVote"("user_id", "review_id");

-- CreateIndex
CREATE INDEX "GlossaryTermCategory_glossary_term_id_idx" ON "public"."GlossaryTermCategory"("glossary_term_id");

-- CreateIndex
CREATE INDEX "GlossaryTermCategory_category_id_idx" ON "public"."GlossaryTermCategory"("category_id");

-- CreateIndex
CREATE INDEX "GlossaryTermRelation_term_id_idx" ON "public"."GlossaryTermRelation"("term_id");

-- CreateIndex
CREATE INDEX "GlossaryTermRelation_related_id_idx" ON "public"."GlossaryTermRelation"("related_id");

-- CreateIndex
CREATE INDEX "GlossaryEditSubmission_glossary_term_id_idx" ON "public"."GlossaryEditSubmission"("glossary_term_id");

-- CreateIndex
CREATE UNIQUE INDEX "ToolComparisonSet_slug_key" ON "public"."ToolComparisonSet"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ToolComparisonTool_tool_id_comparison_set_id_key" ON "public"."ToolComparisonTool"("tool_id", "comparison_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_user_id_key" ON "public"."UserPreferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "public"."RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "NewsCategory_news_id_category_id_key" ON "public"."NewsCategory"("news_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleCategory_article_id_category_id_key" ON "public"."ArticleCategory"("article_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "LearningCategory_learning_id_category_id_key" ON "public"."LearningCategory"("learning_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "ToolRole_name_key" ON "public"."ToolRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ToolIndustry_name_key" ON "public"."ToolIndustry"("name");

-- CreateIndex
CREATE INDEX "ImportExportJob_adminId_idx" ON "public"."ImportExportJob"("adminId");

-- CreateIndex
CREATE INDEX "ImportExportJob_status_idx" ON "public"."ImportExportJob"("status");

-- CreateIndex
CREATE INDEX "ImportExportJob_entityType_idx" ON "public"."ImportExportJob"("entityType");

-- CreateIndex
CREATE INDEX "ImportExportJob_startedAt_idx" ON "public"."ImportExportJob"("startedAt");

-- CreateIndex
CREATE INDEX "ActivityLog_created_at_idx" ON "public"."ActivityLog"("created_at");

-- CreateIndex
CREATE INDEX "ActivityLog_user_id_idx" ON "public"."ActivityLog"("user_id");

-- CreateIndex
CREATE INDEX "_ToolRoles_B_index" ON "public"."_ToolRoles"("B");

-- CreateIndex
CREATE INDEX "_ToolIndustries_B_index" ON "public"."_ToolIndustries"("B");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bookmark" ADD CONSTRAINT "Bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tool" ADD CONSTRAINT "Tool_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolClaim" ADD CONSTRAINT "ToolClaim_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "public"."Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolClaim" ADD CONSTRAINT "ToolClaim_claimant_id_fkey" FOREIGN KEY ("claimant_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolSubmission" ADD CONSTRAINT "ToolSubmission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolSubmission" ADD CONSTRAINT "ToolSubmission_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "public"."Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolTag" ADD CONSTRAINT "ToolTag_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "public"."Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolTag" ADD CONSTRAINT "ToolTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolCategory" ADD CONSTRAINT "ToolCategory_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "public"."Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolCategory" ADD CONSTRAINT "ToolCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NewsTag" ADD CONSTRAINT "NewsTag_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "public"."News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NewsTag" ADD CONSTRAINT "NewsTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleTag" ADD CONSTRAINT "ArticleTag_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleTag" ADD CONSTRAINT "ArticleTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GlossaryTag" ADD CONSTRAINT "GlossaryTag_glossary_id_fkey" FOREIGN KEY ("glossary_id") REFERENCES "public"."GlossaryTerm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GlossaryTag" ADD CONSTRAINT "GlossaryTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningTag" ADD CONSTRAINT "LearningTag_learning_id_fkey" FOREIGN KEY ("learning_id") REFERENCES "public"."Learning"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningTag" ADD CONSTRAINT "LearningTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PromptTag" ADD CONSTRAINT "PromptTag_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "public"."Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PromptTag" ADD CONSTRAINT "PromptTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."News" ADD CONSTRAINT "News_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Learning" ADD CONSTRAINT "Learning_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prompt" ADD CONSTRAINT "Prompt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PromptCategory" ADD CONSTRAINT "PromptCategory_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "public"."Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PromptCategory" ADD CONSTRAINT "PromptCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PromptChain" ADD CONSTRAINT "PromptChain_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "public"."Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "public"."Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReviewCriteria" ADD CONSTRAINT "ReviewCriteria_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReviewModeration" ADD CONSTRAINT "ReviewModeration_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReviewModeration" ADD CONSTRAINT "ReviewModeration_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReviewHelpfulVote" ADD CONSTRAINT "ReviewHelpfulVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReviewHelpfulVote" ADD CONSTRAINT "ReviewHelpfulVote_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReviewReport" ADD CONSTRAINT "ReviewReport_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReviewReport" ADD CONSTRAINT "ReviewReport_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NewsletterEngagement" ADD CONSTRAINT "NewsletterEngagement_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "public"."Newsletter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GlossaryTerm" ADD CONSTRAINT "GlossaryTerm_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GlossaryTermCategory" ADD CONSTRAINT "GlossaryTermCategory_glossary_term_id_fkey" FOREIGN KEY ("glossary_term_id") REFERENCES "public"."GlossaryTerm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GlossaryTermCategory" ADD CONSTRAINT "GlossaryTermCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GlossaryTermRelation" ADD CONSTRAINT "GlossaryTermRelation_term_id_fkey" FOREIGN KEY ("term_id") REFERENCES "public"."GlossaryTerm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GlossaryTermRelation" ADD CONSTRAINT "GlossaryTermRelation_related_id_fkey" FOREIGN KEY ("related_id") REFERENCES "public"."GlossaryTerm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GlossaryEditSubmission" ADD CONSTRAINT "GlossaryEditSubmission_glossary_term_id_fkey" FOREIGN KEY ("glossary_term_id") REFERENCES "public"."GlossaryTerm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GlossaryEditSubmission" ADD CONSTRAINT "GlossaryEditSubmission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SocialLink" ADD CONSTRAINT "SocialLink_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "public"."Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolComparisonSet" ADD CONSTRAINT "ToolComparisonSet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolComparisonTool" ADD CONSTRAINT "ToolComparisonTool_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "public"."Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolComparisonTool" ADD CONSTRAINT "ToolComparisonTool_comparison_set_id_fkey" FOREIGN KEY ("comparison_set_id") REFERENCES "public"."ToolComparisonSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPreferences" ADD CONSTRAINT "UserPreferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."APIKey" ADD CONSTRAINT "APIKey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "public"."Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PasswordReset" ADD CONSTRAINT "PasswordReset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NewsCategory" ADD CONSTRAINT "NewsCategory_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "public"."News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NewsCategory" ADD CONSTRAINT "NewsCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleCategory" ADD CONSTRAINT "ArticleCategory_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleCategory" ADD CONSTRAINT "ArticleCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningCategory" ADD CONSTRAINT "LearningCategory_learning_id_fkey" FOREIGN KEY ("learning_id") REFERENCES "public"."Learning"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningCategory" ADD CONSTRAINT "LearningCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ImportExportJob" ADD CONSTRAINT "ImportExportJob_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ToolRoles" ADD CONSTRAINT "_ToolRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ToolRoles" ADD CONSTRAINT "_ToolRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."ToolRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ToolIndustries" ADD CONSTRAINT "_ToolIndustries_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ToolIndustries" ADD CONSTRAINT "_ToolIndustries_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."ToolIndustry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

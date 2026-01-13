import { apiClient } from '@/lib/apiClient';

export interface SiteSettings {
  id: number;
  site_name: string;
  site_description: string;
  site_tagline: string;
  status: 'Live' | 'Maintenance';
  maintenance_message: string;
  favicon: string;
  social_preview: string;
  meta_title: string;
  meta_description: string;
  sitemap_settings: string[];
  google_search_console_verification: string;
  bing_webmaster_tools_verification: string;
  twitter_url: string;
  github_url: string;
  linkedin_url: string;
  youtube_url: string;
  google_analytics_id: string;
  google_tag_manager_id: string;
  facebook_pixel_id: string;
  review_status: boolean;
  review_approval: 'AutoPublish' | 'AdminApproval';
  min_review_length: number;
  max_review_length: number;
  tool_submission_approval: 'AutoApprove' | 'AdminApproval';
  article_submission_approval: 'AutoApprove' | 'AdminApproval';
  learning_submission_approval: 'AutoApprove' | 'AdminApproval';
  admin_notification_email: string;
  notify_admins_for: string[];
  email_service_provider: 'SMTP' | 'SendGrid' | 'Mailgun';
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string | null;
  from_email: string;
  from_name: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateSiteSettingsRequest {
  site_name?: string;
  site_description?: string;
  site_tagline?: string;
  status?: 'Live' | 'Maintenance';
  maintenance_message?: string;
  favicon?: string;
  social_preview?: string;
  meta_title?: string;
  meta_description?: string;
  sitemap_settings?: string[];
  google_search_console_verification?: string;
  bing_webmaster_tools_verification?: string;
  twitter_url?: string;
  github_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  google_analytics_id?: string;
  google_tag_manager_id?: string;
  facebook_pixel_id?: string;
  review_status?: boolean;
  review_approval?: 'AutoPublish' | 'AdminApproval';
  min_review_length?: number;
  max_review_length?: number;
  tool_submission_approval?: 'AutoApprove' | 'AdminApproval';
  article_submission_approval?: 'AutoApprove' | 'AdminApproval';
  learning_submission_approval?: 'AutoApprove' | 'AdminApproval';
  admin_notification_email?: string;
  notify_admins_for?: string[];
  email_service_provider?: 'SMTP' | 'SendGrid' | 'Mailgun';
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string | null;
  from_email?: string;
  from_name?: string;
}

export const siteSettingsApi = {
  getSiteSettings: async (): Promise<SiteSettings> => {
    const response = await apiClient.get('/site/settings');
    return response.data;
  },

  updateSiteSettings: async (data: UpdateSiteSettingsRequest): Promise<SiteSettings> => {
    const response = await apiClient.patch('/site/information', data);
    return response.data;
  },
};

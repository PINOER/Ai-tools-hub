import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SiteInformationTab } from '@/components/settings/tabs/SiteInformationTab';
import { BrandingTab } from '@/components/settings/tabs/BrandingTab';
import { SEOTab } from '@/components/settings/tabs/SEOTab';
import { SocialTab } from '@/components/settings/tabs/SocialTab';
import { AnalyticsTab } from '@/components/settings/tabs/AnalyticsTab';
import { ReviewsTab } from '@/components/settings/tabs/ReviewsTab';
import { SubmissionsTab } from '@/components/settings/tabs/SubmissionsTab';
import { EmailTab } from '@/components/settings/tabs/EmailTab';
import { NewsTab } from '@/components/settings/tabs/NewsTab';
import { NewsletterTab } from '@/components/settings/tabs/NewsletterTab';
import { UsersTab } from '@/components/settings/tabs/UsersTab';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';

const generalTabs = [
  { value: 'site', label: 'Site information' },
  { value: 'branding', label: 'Branding' },
  { value: 'seo', label: 'SEO' },
  { value: 'social', label: 'Social' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'submissions', label: 'Submissions' },
  { value: 'email', label: 'Email' },
  { value: 'news', label: 'News' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'users', label: 'Users' },
];

export default function Settings() {
  const [tab, setTab] = useState('profile');
  const [generalTab, setGeneralTab] = useState('site');

  return (
    <div className="container px-8 py-2">
      <h1 className="text-2xl mb-2 text-gray-300">Settings</h1>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-2 space-x-2 bg-transparent">
          <TabsTrigger value="profile" className="border-1 bg-white border-gray-200 data-[state=active]:bg-[#4D4D4D] data-[state=active]:text-white hover:cursor-pointer">Profile</TabsTrigger>
          <TabsTrigger value="general" className="border-1 bg-white border-gray-200 data-[state=active]:bg-[#4D4D4D] data-[state=active]:text-white hover:cursor-pointer">General Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileSettings/>
        </TabsContent>
        <TabsContent value="general">
          <Tabs value={generalTab} onValueChange={setGeneralTab} className="w-full bg-white py-6 px-8 rounded-lg">
            <TabsList className="mb-2 flex flex-wrap gap-2 bg-transparent">
              {generalTabs.map(t => (
                <TabsTrigger key={t.value} value={t.value} className="border-1 bg-white border-gray-200 data-[state=active]:bg-[#4D4D4D] data-[state=active]:text-white hover:cursor-pointer">{t.label}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="site">
              <SiteInformationTab />
            </TabsContent>
            <TabsContent value="branding">
              <BrandingTab />
            </TabsContent>
            <TabsContent value="seo">
              <SEOTab />
            </TabsContent>
            <TabsContent value="social">
              <SocialTab />
            </TabsContent>
            <TabsContent value="analytics">
              <AnalyticsTab />
            </TabsContent>
            <TabsContent value="reviews">
              <ReviewsTab />
            </TabsContent>
            <TabsContent value="submissions">
              <SubmissionsTab />
            </TabsContent>
            <TabsContent value="email">
              <EmailTab />
            </TabsContent>
            <TabsContent value="news">
              <NewsTab />
            </TabsContent>
            <TabsContent value="newsletter">
              <NewsletterTab />
            </TabsContent>
            <TabsContent value="users">
              <UsersTab />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
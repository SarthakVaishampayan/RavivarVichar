import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import ContentHub from '../pages/manage-content/ContentHub';
import {
  ArticleList, EventList, PartnerList,
  TestimonialList,
  NewsletterList, ContactList,
  FeatureRequestList, JoinInitiativeList, MediaMentionList, PartnerApplicationList,
  ResearchReportList, SuccessStoryList, InterviewList,
} from '../pages/manage-content/ContentListPages';
import {
  ArticleEditor, EventEditor, PartnerEditor,
  TestimonialEditor, MediaMentionEditor,
  ResearchReportEditor, SuccessStoryEditor, InterviewEditor,
} from '../pages/manage-content/Editors';
import Analytics from '../pages/Analytics';
import Traffic from '../pages/Traffic';
import SEO from '../pages/SEO';
import HomepageBuilder from '../pages/HomepageBuilder';
import GalleryManager from '../pages/manage-content/GalleryManager';
import SubmissionDetail from '../pages/manage-content/SubmissionDetail';
import Users from '../pages/Users';
import Settings from '../pages/Settings';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Content Management */}
        <Route path="content" element={<ContentHub />} />

        <Route path="content/articles" element={<ArticleList />} />
        <Route path="content/articles/:id/edit" element={<ArticleEditor />} />
        <Route path="content/articles/new" element={<ArticleEditor />} />

        <Route path="content/events" element={<EventList />} />
        <Route path="content/events/:id/edit" element={<EventEditor />} />
        <Route path="content/events/new" element={<EventEditor />} />

        <Route path="content/partners" element={<PartnerList />} />
        <Route path="content/partners/:id/edit" element={<PartnerEditor />} />
        <Route path="content/partners/new" element={<PartnerEditor />} />

        <Route path="content/testimonials" element={<TestimonialList />} />
        <Route path="content/testimonials/:id/edit" element={<TestimonialEditor />} />
        <Route path="content/testimonials/new" element={<TestimonialEditor />} />

        <Route path="content/newsletters" element={<NewsletterList />} />
        <Route path="content/newsletters/:id/edit" element={<SubmissionDetail />} />

        <Route path="content/contacts" element={<ContactList />} />
        <Route path="content/contacts/:id/edit" element={<SubmissionDetail />} />

        <Route path="content/featureRequests" element={<FeatureRequestList />} />
        <Route path="content/joinInitiative" element={<JoinInitiativeList />} />
        <Route path="content/gallery" element={<GalleryManager />} />
        <Route path="content/mediaMentions" element={<MediaMentionList />} />

        <Route path="content/mediaMentions/:id/edit" element={<MediaMentionEditor />} />
        <Route path="content/mediaMentions/new" element={<MediaMentionEditor />} />

        <Route path="content/researchReports" element={<ResearchReportList />} />
        <Route path="content/researchReports/:id/edit" element={<ResearchReportEditor />} />
        <Route path="content/researchReports/new" element={<ResearchReportEditor />} />

        <Route path="content/successStories" element={<SuccessStoryList />} />
        <Route path="content/successStories/:id/edit" element={<SuccessStoryEditor />} />
        <Route path="content/successStories/new" element={<SuccessStoryEditor />} />

        <Route path="content/interviews" element={<InterviewList />} />
        <Route path="content/interviews/:id/edit" element={<InterviewEditor />} />
        <Route path="content/interviews/new" element={<InterviewEditor />} />

        <Route path="content/partnerApplications" element={<PartnerApplicationList />} />

        <Route path="content/featureRequests/:id/edit" element={<SubmissionDetail />} />
        <Route path="content/joinInitiative/:id/edit" element={<SubmissionDetail />} />
        <Route path="content/partnerApplications/:id/edit" element={<SubmissionDetail />} />

        {/* Additional Pages */}
        <Route path="analytics" element={<Analytics />} />
        <Route path="traffic" element={<Traffic />} />
        <Route path="seo" element={<SEO />} />
        <Route path="homepage" element={<HomepageBuilder />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

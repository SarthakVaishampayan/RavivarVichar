import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import ContentHub from '../pages/manage-content/ContentHub';
import {
  ArticleList, ProgramList, ProjectList, ReportList,
  EventList, PartnerList, EntrepreneurList, SHGList,
  MentorList, MediaList, TestimonialList,
} from '../pages/manage-content/ContentListPages';
import {
  ArticleEditor, ProgramEditor, ProjectEditor, ReportEditor,
  EventEditor, PartnerEditor, MediaEditor, TestimonialEditor,
  DirectoryEditor,
} from '../pages/manage-content/Editors';
import Analytics from '../pages/Analytics';
import SEO from '../pages/SEO';
import HomepageBuilder from '../pages/HomepageBuilder';
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

        <Route path="content/programs" element={<ProgramList />} />
        <Route path="content/programs/:id/edit" element={<ProgramEditor />} />
        <Route path="content/programs/new" element={<ProgramEditor />} />

        <Route path="content/projects" element={<ProjectList />} />
        <Route path="content/projects/:id/edit" element={<ProjectEditor />} />
        <Route path="content/projects/new" element={<ProjectEditor />} />

        <Route path="content/reports" element={<ReportList />} />
        <Route path="content/reports/:id/edit" element={<ReportEditor />} />
        <Route path="content/reports/new" element={<ReportEditor />} />

        <Route path="content/events" element={<EventList />} />
        <Route path="content/events/:id/edit" element={<EventEditor />} />
        <Route path="content/events/new" element={<EventEditor />} />

        <Route path="content/partners" element={<PartnerList />} />
        <Route path="content/partners/:id/edit" element={<PartnerEditor />} />
        <Route path="content/partners/new" element={<PartnerEditor />} />

        <Route path="content/entrepreneurs" element={<EntrepreneurList />} />
        <Route path="content/entrepreneurs/:id/edit" element={<DirectoryEditor type="entrepreneurs" />} />
        <Route path="content/entrepreneurs/new" element={<DirectoryEditor type="entrepreneurs" />} />

        <Route path="content/shgs" element={<SHGList />} />
        <Route path="content/shgs/:id/edit" element={<DirectoryEditor type="shgs" />} />
        <Route path="content/shgs/new" element={<DirectoryEditor type="shgs" />} />

        <Route path="content/mentors" element={<MentorList />} />
        <Route path="content/mentors/:id/edit" element={<DirectoryEditor type="mentors" />} />
        <Route path="content/mentors/new" element={<DirectoryEditor type="mentors" />} />

        <Route path="content/media" element={<MediaList />} />
        <Route path="content/media/:id/edit" element={<MediaEditor />} />
        <Route path="content/media/new" element={<MediaEditor />} />

        <Route path="content/testimonials" element={<TestimonialList />} />
        <Route path="content/testimonials/:id/edit" element={<TestimonialEditor />} />
        <Route path="content/testimonials/new" element={<TestimonialEditor />} />

        {/* Additional Pages */}
        <Route path="analytics" element={<Analytics />} />
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

import api from '../../lib/axios';
import { RESOURCES } from '../../lib/constants';
import ContentList from './ContentList';

const fetchAll = (apiPath) => async () => {
  const { data } = await api.get(apiPath, { params: { limit: 100, sort: '-updatedAt' } });
  return data.data;
};

export function ArticleList() {
  return (
    <ContentList
      resourceKey="articles"
      resourceConfig={RESOURCES.articles}
      fetchFn={fetchAll('/articles')}
    />
  );
}

export function ProgramList() {
  return (
    <ContentList
      resourceKey="programs"
      resourceConfig={RESOURCES.programs}
      fetchFn={fetchAll('/programs')}
    />
  );
}

export function ProjectList() {
  return (
    <ContentList
      resourceKey="projects"
      resourceConfig={RESOURCES.projects}
      fetchFn={fetchAll('/projects')}
    />
  );
}

export function ReportList() {
  return (
    <ContentList
      resourceKey="reports"
      resourceConfig={RESOURCES.reports}
      fetchFn={fetchAll('/reports')}
    />
  );
}

export function EventList() {
  return (
    <ContentList
      resourceKey="events"
      resourceConfig={RESOURCES.events}
      fetchFn={fetchAll('/events')}
    />
  );
}

export function PartnerList() {
  return (
    <ContentList
      resourceKey="partners"
      resourceConfig={RESOURCES.partners}
      fetchFn={fetchAll('/partners')}
    />
  );
}

export function EntrepreneurList() {
  return (
    <ContentList
      resourceKey="entrepreneurs"
      resourceConfig={RESOURCES.entrepreneurs}
      fetchFn={fetchAll('/directory/entrepreneurs')}
    />
  );
}

export function SHGList() {
  return (
    <ContentList
      resourceKey="shgs"
      resourceConfig={RESOURCES.shgs}
      fetchFn={fetchAll('/directory/shgs')}
    />
  );
}

export function MentorList() {
  return (
    <ContentList
      resourceKey="mentors"
      resourceConfig={RESOURCES.mentors}
      fetchFn={fetchAll('/directory/mentors')}
    />
  );
}

export function MediaList() {
  return (
    <ContentList
      resourceKey="media"
      resourceConfig={RESOURCES.media}
      fetchFn={fetchAll('/media')}
    />
  );
}

export function TestimonialList() {
  return (
    <ContentList
      resourceKey="testimonials"
      resourceConfig={RESOURCES.testimonials}
      fetchFn={fetchAll('/testimonials')}
    />
  );
}

export function NewsletterList() {
  return (
    <ContentList
      resourceKey="newsletters"
      resourceConfig={RESOURCES.newsletters}
      fetchFn={fetchAll('/newsletter')}
    />
  );
}

export function ContactList() {
  return (
    <ContentList
      resourceKey="contacts"
      resourceConfig={RESOURCES.contacts}
      fetchFn={fetchAll('/contact')}
    />
  );
}

export function MembershipList() {
  return (
    <ContentList
      resourceKey="memberships"
      resourceConfig={RESOURCES.memberships}
      fetchFn={fetchAll('/membership')}
    />
  );
}

export function DonationList() {
  return (
    <ContentList
      resourceKey="donations"
      resourceConfig={RESOURCES.donations}
      fetchFn={fetchAll('/donations')}
    />
  );
}

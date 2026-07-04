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

export function FeatureRequestList() {
  return (
    <ContentList
      resourceKey="featureRequests"
      resourceConfig={RESOURCES.featureRequests}
      fetchFn={fetchAll('/feature-requests')}
    />
  );
}

export function JoinInitiativeList() {
  return (
    <ContentList
      resourceKey="joinInitiative"
      resourceConfig={RESOURCES.joinInitiative}
      fetchFn={fetchAll('/join-initiative')}
    />
  );
}

export function MediaMentionList() {
  return (
    <ContentList
      resourceKey="mediaMentions"
      resourceConfig={RESOURCES.mediaMentions}
      fetchFn={fetchAll('/media-mentions')}
    />
  );
}

export function PartnerApplicationList() {
  return (
    <ContentList
      resourceKey="partnerApplications"
      resourceConfig={RESOURCES.partnerApplications}
      fetchFn={fetchAll('/partner-applications')}
    />
  );
}

export function ResearchReportList() {
  return (
    <ContentList
      resourceKey="researchReports"
      resourceConfig={RESOURCES.researchReports}
      fetchFn={fetchAll('/articles?category=Research')}
    />
  );
}

export function SuccessStoryList() {
  return (
    <ContentList
      resourceKey="successStories"
      resourceConfig={RESOURCES.successStories}
      fetchFn={fetchAll('/articles?category=Success%20Stories')}
    />
  );
}

export function InterviewList() {
  return (
    <ContentList
      resourceKey="interviews"
      resourceConfig={RESOURCES.interviews}
      fetchFn={fetchAll('/articles?category=Interview')}
    />
  );
}

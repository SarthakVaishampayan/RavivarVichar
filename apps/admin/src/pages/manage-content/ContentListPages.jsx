import api from '../../lib/axios';
import { RESOURCES } from '../../lib/constants';
import ContentList from './ContentList';

// Fetch EVERY record across all pages. The server caps `limit` at 100 per
// request (see paginate util), so a single request could silently truncate
// older content — which would hide it from the unified Content list.
const fetchAll = (apiPath) => async () => {
  const items = [];
  const LIMIT = 100;
  let page = 1;
  for (let i = 0; i < 50; i++) {
    const { data } = await api.get(apiPath, { params: { limit: LIMIT, page, sort: '-updatedAt' } });
    const batch = data.data || [];
    items.push(...batch);
    const meta = data.meta;
    if (!batch.length || batch.length < LIMIT || (meta && page >= meta.totalPages)) break;
    page++;
  }
  return items;
};

// Single unified Content list — every article (all primary categories,
// all statuses) lives here. The Category column shows the content type.
export function ContentListPage() {
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

export function RecognitionList() {
  return (
    <ContentList
      resourceKey="recognitions"
      resourceConfig={RESOURCES.recognitions}
      fetchFn={fetchAll('/recognitions')}
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

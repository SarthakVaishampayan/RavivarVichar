import {
  LayoutDashboard,
  FileText,
  Handshake,
  Calendar,
  MessageSquareQuote,
  MessageSquare,
  Mail,
  BarChart3,
  Search,
  Settings,
  Layout,
  UserCog,
  Star,
  HandHelping,
  Image,
  Newspaper,
  Activity,
  KeyRound,
} from 'lucide-react';

export const RESOURCES = {
  articles: {
    label: 'Content',
    singularLabel: 'Content',
    icon: FileText,
    color: 'text-primary-500',
    bgColor: 'bg-primary-50',
    apiPath: '/articles',
    fields: ['title', 'category', 'status', 'author', 'views', 'updatedAt'],
  },
  partners: {
    label: 'Partners',
    icon: Handshake,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    apiPath: '/partners',
    fields: ['name', 'category', 'status', 'updatedAt'],
  },
  events: {
    label: 'Events',
    icon: Calendar,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    apiPath: '/events',
    fields: ['title', 'type', 'location', 'updatedAt'],
  },
  testimonials: {
    label: 'Testimonials',
    icon: MessageSquareQuote,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    apiPath: '/testimonials',
    fields: ['name', 'role', 'featured', 'updatedAt'],
  },
  newsletters: {
    label: 'Newsletter Subscribers',
    icon: Mail,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    apiPath: '/newsletter',
    fields: ['email', 'subscribed', 'updatedAt'],
  },
  contacts: {
    label: 'Contact Messages',
    icon: MessageSquare,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    apiPath: '/contact',
    fields: ['name', 'email', 'subject', 'read', 'createdAt'],
  },
  featureRequests: {
    label: 'Featured Requests',
    icon: Star,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    apiPath: '/feature-requests',
    fields: ['name', 'placeOfWork', 'typeOfWork', 'phoneNo', 'createdAt'],
  },
  joinInitiative: {
    label: 'Join Initiative',
    icon: HandHelping,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    apiPath: '/join-initiative',
    fields: ['name', 'phoneNo', 'city', 'state', 'createdAt'],
  },
  gallery: {
    label: 'Gallery Manager',
    icon: Image,
    color: 'text-violet-500',
    bgColor: 'bg-violet-50',
    apiPath: '/gallery',
    fields: [],
  },
  partnerApplications: {
    label: 'Partner Applications',
    icon: Handshake,
    color: 'text-primary-500',
    bgColor: 'bg-primary-50',
    apiPath: '/partner-applications',
    fields: ['name', 'organization', 'email', 'phoneNo', 'createdAt'],
  },
  recognitions: {
    label: 'Recognitions',
    icon: Newspaper,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    apiPath: '/recognitions',
    fields: ['title', 'source', 'date', 'url', 'updatedAt'],
  },
};

export const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', exact: true },
  {
    label: 'Manage Content',
    icon: FileText,
    path: '/content',
    children: Object.entries(RESOURCES).map(([key, res]) => ({
      label: res.label,
      icon: res.icon,
      path: `/content/${key}`,
    })),
  },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Traffic', icon: Activity, path: '/traffic' },
  { label: 'Homepage Builder', icon: Layout, path: '/homepage' },
  { label: 'SEO', icon: Search, path: '/seo' },
  { label: 'Users', icon: UserCog, path: '/users' },
  { label: 'Change Password', icon: KeyRound, path: '/change-password' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

// The 5 canonical content types. The stored `value` is what the public site's
// sections match on (e.g. category === 'Interview' feeds the Interviews tab).
export const ARTICLE_CATEGORIES = [
  { value: 'Articles', label: 'Articles' },
  { value: 'Research', label: 'Research & Reports' },
  { value: 'Success Stories', label: 'Success Stories' },
  { value: 'Interview', label: 'Interviews' },
  { value: 'Podcast', label: 'Podcasts' },
];

export const PARTNER_CATEGORIES = ['government', 'corporate', 'ngo', 'educational'];
export const EVENT_TYPES = ['upcoming', 'past'];

export const HOMEPAGE_SECTIONS = [
  { key: 'hero', label: 'Hero Banner' },
  { key: 'impactStats', label: 'Impact Stats' },
  { key: 'programs', label: 'What We Do' },
  { key: 'research', label: 'Success Stories' },
  { key: 'partners', label: 'Partners' },
  { key: 'recognitions', label: 'Recognitions' },
  { key: 'testimonials', label: 'Testimonials' },
];

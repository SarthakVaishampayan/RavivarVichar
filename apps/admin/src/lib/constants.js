import {
  LayoutDashboard,
  FileText,
  Layers,
  Briefcase,
  Handshake,
  FileBarChart,
  Users,
  UserCircle,
  GraduationCap,
  Calendar,
  PlayCircle,
  MessageSquareQuote,
  BarChart3,
  Search,
  Settings,
  Layout,
  UserCog,
} from 'lucide-react';

export const RESOURCES = {
  articles: {
    label: 'Articles',
    icon: FileText,
    color: 'text-primary-500',
    bgColor: 'bg-primary-50',
    apiPath: '/articles',
    fields: ['title', 'category', 'status', 'author', 'views', 'updatedAt'],
  },
  programs: {
    label: 'Programs',
    icon: Layers,
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-50',
    apiPath: '/programs',
    fields: ['title', 'status', 'updatedAt'],
  },
  projects: {
    label: 'Projects',
    icon: Briefcase,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    apiPath: '/projects',
    fields: ['title', 'status', 'location', 'budget', 'updatedAt'],
  },
  partners: {
    label: 'Partners',
    icon: Handshake,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    apiPath: '/partners',
    fields: ['name', 'category', 'status', 'updatedAt'],
  },
  reports: {
    label: 'Reports',
    icon: FileBarChart,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    apiPath: '/reports',
    fields: ['title', 'category', 'author', 'year', 'updatedAt'],
  },
  entrepreneurs: {
    label: 'Entrepreneurs',
    icon: Users,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    apiPath: '/directory/entrepreneurs',
    fields: ['name', 'district', 'sector', 'updatedAt'],
  },
  shgs: {
    label: 'SHGs',
    icon: UserCircle,
    color: 'text-teal-500',
    bgColor: 'bg-teal-50',
    apiPath: '/directory/shgs',
    fields: ['groupName', 'district', 'members', 'updatedAt'],
  },
  mentors: {
    label: 'Mentors',
    icon: GraduationCap,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    apiPath: '/directory/mentors',
    fields: ['name', 'skills', 'availability', 'updatedAt'],
  },
  events: {
    label: 'Events',
    icon: Calendar,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    apiPath: '/events',
    fields: ['title', 'type', 'location', 'updatedAt'],
  },
  media: {
    label: 'Media',
    icon: PlayCircle,
    color: 'text-violet-500',
    bgColor: 'bg-violet-50',
    apiPath: '/media',
    fields: ['title', 'type', 'date', 'updatedAt'],
  },
  testimonials: {
    label: 'Testimonials',
    icon: MessageSquareQuote,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    apiPath: '/testimonials',
    fields: ['name', 'role', 'featured', 'updatedAt'],
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
  { label: 'Homepage Builder', icon: Layout, path: '/homepage' },
  { label: 'SEO', icon: Search, path: '/seo' },
  { label: 'Users', icon: UserCog, path: '/users' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export const ARTICLE_CATEGORIES = [
  'General',
  'Case Study',
  'Research',
  'Explainer',
  'Interview',
  'News',
  'Opinion',
];

export const PARTNER_CATEGORIES = ['government', 'corporate', 'ngo', 'educational'];
export const MEDIA_TYPES = ['news', 'press-release', 'podcast', 'video'];
export const PROJECT_STATUSES = ['ongoing', 'completed'];
export const PROGRAM_STATUSES = ['active', 'inactive'];
export const EVENT_TYPES = ['upcoming', 'past'];

export const HOMEPAGE_SECTIONS = [
  { key: 'hero', label: 'Hero Banner' },
  { key: 'mission', label: 'Mission Statement' },
  { key: 'programs', label: 'Programs Grid' },
  { key: 'research', label: 'Featured Research' },
  { key: 'articles', label: 'Latest Articles' },
  { key: 'stats', label: 'Impact Stats' },
  { key: 'projects', label: 'Current Projects' },
  { key: 'partners', label: 'Partners' },
  { key: 'videos', label: 'Videos' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'events', label: 'Events Preview' },
  { key: 'membership', label: 'Membership CTA' },
  { key: 'donate', label: 'Donate CTA' },
  { key: 'newsletter', label: 'Newsletter Signup' },
];

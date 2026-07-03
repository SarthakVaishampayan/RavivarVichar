const Article = require('../models/Article');
const Program = require('../models/Program');
const Project = require('../models/Project');
const Partner = require('../models/Partner');
const Report = require('../models/Report');
const Entrepreneur = require('../models/Entrepreneur');
const SHG = require('../models/SHG');
const Mentor = require('../models/Mentor');
const Event = require('../models/Event');
const MediaItem = require('../models/MediaItem');
const Testimonial = require('../models/Testimonial');
const Newsletter = require('../models/Newsletter');
const ContactMessage = require('../models/ContactMessage');
const Membership = require('../models/Membership');
const Donation = require('../models/Donation');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

// GET /api/v1/analytics/summary
const getSummary = catchAsync(async (req, res) => {
  const [
    articles,
    programs,
    projects,
    partners,
    reports,
    entrepreneurs,
    shgs,
    mentors,
    events,
    mediaItems,
    testimonials,
    newsletters,
    contactMessages,
    memberships,
    donations,
  ] = await Promise.all([
    Article.countDocuments(),
    Program.countDocuments(),
    Project.countDocuments(),
    Partner.countDocuments(),
    Report.countDocuments(),
    Entrepreneur.countDocuments(),
    SHG.countDocuments(),
    Mentor.countDocuments(),
    Event.countDocuments(),
    MediaItem.countDocuments(),
    Testimonial.countDocuments(),
    Newsletter.countDocuments(),
    ContactMessage.countDocuments(),
    Membership.countDocuments(),
    Donation.countDocuments(),
  ]);

  // Content distribution breakdown
  const contentBreakdown = {
    articles: { label: 'Articles', count: articles, color: '#F4A43B' },
    programs: { label: 'Programs', count: programs, color: '#2A8C75' },
    projects: { label: 'Projects', count: projects, color: '#3B82F6' },
    partners: { label: 'Partners', count: partners, color: '#8B5CF6' },
    reports: { label: 'Reports', count: reports, color: '#EC4899' },
    entrepreneurs: { label: 'Entrepreneurs', count: entrepreneurs, color: '#F97316' },
    shgs: { label: 'SHGs', count: shgs, color: '#14B8A6' },
    mentors: { label: 'Mentors', count: mentors, color: '#6366F1' },
    events: { label: 'Events', count: events, color: '#E11D48' },
    mediaItems: { label: 'Media', count: mediaItems, color: '#A855F7' },
    testimonials: { label: 'Testimonials', count: testimonials, color: '#F59E0B' },
    newsletters: { label: 'Newsletters', count: newsletters, color: '#10B981' },
    contactMessages: { label: 'Contact Messages', count: contactMessages, color: '#6B7280' },
    memberships: { label: 'Memberships', count: memberships, color: '#8B5CF6' },
    donations: { label: 'Donations', count: donations, color: '#F43F5E' },
  };

  // Recent activity (last 20 actions)
  const recentActivity = await ActivityLog.find()
    .sort('-createdAt')
    .limit(20)
    .populate('user', 'name')
    .lean();

  // Articles by status for monthly chart
  const publishedCount = await Article.countDocuments({ status: 'published' });
  const draftCount = await Article.countDocuments({ status: 'draft' });

  const total = articles + programs + projects + partners + reports + entrepreneurs + shgs + mentors + events + mediaItems + testimonials + newsletters + contactMessages + memberships + donations;

  sendSuccess(res, {
    total,
    contentBreakdown,
    recentActivity,
    stats: {
      totalArticles: articles,
      publishedArticles: publishedCount,
      draftArticles: draftCount,
      totalProjects: projects,
      ongoingProjects: await Project.countDocuments({ status: 'ongoing' }),
      totalEvents: events,
      upcomingEvents: await Event.countDocuments({ type: 'upcoming' }),
    },
  });
});

module.exports = { getSummary };

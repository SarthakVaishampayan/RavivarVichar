const Article = require('../models/Article');
const Partner = require('../models/Partner');
const Event = require('../models/Event');
const Testimonial = require('../models/Testimonial');
const Newsletter = require('../models/Newsletter');
const ContactMessage = require('../models/ContactMessage');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

// GET /api/v1/analytics/summary
const getSummary = catchAsync(async (req, res) => {
  const [
    articles,
    partners,
    events,
    testimonials,
    newsletters,
    contactMessages,
  ] = await Promise.all([
    Article.countDocuments(),
    Partner.countDocuments(),
    Event.countDocuments(),
    Testimonial.countDocuments(),
    Newsletter.countDocuments(),
    ContactMessage.countDocuments(),
  ]);

  // Content distribution breakdown
  const contentBreakdown = {
    articles: { label: 'Articles', count: articles, color: '#F4A43B' },
    partners: { label: 'Partners', count: partners, color: '#8B5CF6' },
    events: { label: 'Events', count: events, color: '#E11D48' },
    testimonials: { label: 'Testimonials', count: testimonials, color: '#F59E0B' },
    newsletters: { label: 'Newsletters', count: newsletters, color: '#10B981' },
    contactMessages: { label: 'Contact Messages', count: contactMessages, color: '#6B7280' },
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

  const total = articles + partners + events + testimonials + newsletters + contactMessages;

  sendSuccess(res, {
    total,
    contentBreakdown,
    recentActivity,
    stats: {
      totalArticles: articles,
      publishedArticles: publishedCount,
      draftArticles: draftCount,
      totalEvents: events,
      upcomingEvents: await Event.countDocuments({ type: 'upcoming' }),
    },
  });
});

module.exports = { getSummary };

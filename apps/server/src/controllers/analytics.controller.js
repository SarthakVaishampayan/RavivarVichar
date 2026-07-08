const crypto = require('crypto');
const Article = require('../models/Article');
const Partner = require('../models/Partner');
const Event = require('../models/Event');
const Testimonial = require('../models/Testimonial');
const Newsletter = require('../models/Newsletter');
const ContactMessage = require('../models/ContactMessage');
const GalleryImage = require('../models/GalleryImage');
const FeatureRequest = require('../models/FeatureRequest');
const JoinInitiative = require('../models/JoinInitiative');
const PartnerApplication = require('../models/PartnerApplication');
const MediaMention = require('../models/MediaMention');
const ActivityLog = require('../models/ActivityLog');
const PageView = require('../models/PageView');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

// GET /api/v1/analytics/summary
const getSummary = catchAsync(async (req, res) => {
  const [
    articles,
    partners,
    events,
    testimonials,
    newsletters,
    contacts,
    gallery,
    featureRequests,
    joinInitiative,
    partnerApplications,
    mediaMentions,
    researchReports,
    successStories,
    interviews,
  ] = await Promise.all([
    Article.countDocuments(),
    Partner.countDocuments(),
    Event.countDocuments(),
    Testimonial.countDocuments(),
    Newsletter.countDocuments(),
    ContactMessage.countDocuments(),
    GalleryImage.countDocuments(),
    FeatureRequest.countDocuments(),
    JoinInitiative.countDocuments(),
    PartnerApplication.countDocuments(),
    MediaMention.countDocuments(),
    Article.countDocuments({ category: 'Research' }),
    Article.countDocuments({ category: 'Success Stories' }),
    Article.countDocuments({ category: 'Interview' }),
  ]);

  // Content distribution breakdown — keys match RESOURCES keys in admin constants
  const contentBreakdown = {
    articles: { label: 'Articles', count: articles, color: '#F4A43B' },
    partners: { label: 'Partners', count: partners, color: '#8B5CF6' },
    events: { label: 'Events', count: events, color: '#E11D48' },
    testimonials: { label: 'Testimonials', count: testimonials, color: '#F59E0B' },
    newsletters: { label: 'Newsletter Subscribers', count: newsletters, color: '#10B981' },
    contacts: { label: 'Contact Messages', count: contacts, color: '#6B7280' },
    gallery: { label: 'Gallery Manager', count: gallery, color: '#8B5CF6' },
    featureRequests: { label: 'Featured Requests', count: featureRequests, color: '#F59E0B' },
    joinInitiative: { label: 'Join Initiative', count: joinInitiative, color: '#10B981' },
    partnerApplications: { label: 'Partner Applications', count: partnerApplications, color: '#F4A43B' },
    mediaMentions: { label: 'Media Mentions', count: mediaMentions, color: '#3B82F6' },
    researchReports: { label: 'Research & Reports', count: researchReports, color: '#8B5CF6' },
    successStories: { label: 'Success Stories', count: successStories, color: '#10B981' },
    interviews: { label: 'Interviews', count: interviews, color: '#F59E0B' },
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

  const total = articles + partners + events + testimonials + newsletters + contacts
    + gallery + featureRequests + joinInitiative + partnerApplications + mediaMentions
    + researchReports + successStories + interviews;

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

// POST /api/v1/analytics/pageview — record a page visit
const recordPageview = catchAsync(async (req, res) => {
  const { path, referrer, sessionId, articleId } = req.body;

  if (!path || !sessionId) {
    return sendError(res, 'path and sessionId are required', 400);
  }

  // Hash the IP for privacy (never store raw IP)
  const ipHash = crypto
    .createHash('sha256')
    .update(req.ip + (process.env.IP_HASH_SALT || 'ravivarvichar-salt'))
    .digest('hex');

  await PageView.create({
    path,
    articleId: articleId || undefined,
    referrer: referrer || req.get('Referer') || '',
    userAgent: req.get('User-Agent') || '',
    ipHash,
    sessionId,
    timestamp: new Date(),
  });

  // Send minimal response — no data needed, client doesn't use it
  sendSuccess(res, null, 'Pageview recorded', 201);
});

// GET /api/v1/analytics/traffic — aggregated traffic stats
const getTraffic = catchAsync(async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days) || 30, 1), 365);
  const now = new Date();
  const sinceDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);

  const [
    totalPageviews,
    visitorsToday,
    visitorsThisWeek,
    visitorsThisMonth,
    activeNow,
    totalUniqueSessions,
    topPages,
    topReferrers,
    visitorTrend,
  ] = await Promise.all([
    // Total pageviews in date range
    PageView.countDocuments({ timestamp: { $gte: sinceDate } }),

    // Unique visitors today (unique IP hashes)
    PageView.distinct('ipHash', { timestamp: { $gte: todayStart } }).then(
      (ips) => ips.length
    ),

    // Unique visitors this week
    PageView.distinct('ipHash', { timestamp: { $gte: weekAgo } }).then(
      (ips) => ips.length
    ),

    // Unique visitors this month (30 days)
    PageView.distinct('ipHash', { timestamp: { $gte: sinceDate } }).then(
      (ips) => ips.length
    ),

    // Active users right now (last 5 minutes)
    PageView.distinct('ipHash', { timestamp: { $gte: fiveMinAgo } }).then(
      (ips) => ips.length
    ),

    // Total unique sessions in date range
    PageView.distinct('sessionId', { timestamp: { $gte: sinceDate } }).then(
      (sessions) => sessions.length
    ),

    // Top pages (group by path, count, limit 20)
    PageView.aggregate([
      { $match: { timestamp: { $gte: sinceDate } } },
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { path: '$_id', count: 1, _id: 0 } },
    ]),

    // Top referrers (group by referrer, count, limit 20)
    PageView.aggregate([
      { $match: { timestamp: { $gte: sinceDate }, referrer: { $ne: '' } } },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { referrer: '$_id', count: 1, _id: 0 } },
    ]),

    // Visitor trend (daily counts for date range)
    PageView.aggregate([
      { $match: { timestamp: { $gte: sinceDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: '$_id.day',
                },
              },
            },
          },
          count: 1,
        },
      },
    ]),
  ]);

  sendSuccess(res, {
    summary: {
      visitorsToday,
      visitorsThisWeek,
      visitorsThisMonth,
      activeNow,
      totalPageviews,
      totalSessions: totalUniqueSessions,
    },
    topPages,
    topReferrers: topReferrers.map((r) => ({
      ...r,
      // Clean up referrer for display
      referrer: r.referrer
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '')
        .slice(0, 100),
    })),
    visitorTrend,
    period: {
      days,
      startDate: sinceDate,
      endDate: now,
    },
  });
});

module.exports = { getSummary, recordPageview, getTraffic };

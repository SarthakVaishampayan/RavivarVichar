const { z } = require('zod');

// Auth schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(20, 'Invalid reset token'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

// Article schemas
// NOTE: keep in sync with apps/server/src/models/Article.js — every field the
// editor saves must be listed here, because Zod strips unknown keys on POST.
const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  slug: z.string().optional(),
  category: z.string().optional(),
  additionalCategories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  bannerDescription: z.string().optional(),
  focusKeyphrase: z.string().optional(),
  credit: z.string().optional(),
  authorName: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  publishedAt: z.string().optional(),
  featured: z.boolean().optional(),
  pinned: z.boolean().optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    ogImage: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    twitterTitle: z.string().optional(),
    twitterDescription: z.string().optional(),
    twitterImage: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    metaNewsKeywords: z.array(z.string()).optional(),
    canonicalUrl: z.string().optional(),
    schemaType: z.string().optional(),
    excludeFromSearch: z.boolean().optional(),
  }).optional(),
});
module.exports = {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  articleSchema,
};

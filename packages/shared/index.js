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

// Article schemas
const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  slug: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  featured: z.boolean().optional(),
  pinned: z.boolean().optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    ogImage: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
});
module.exports = {
  loginSchema,
  registerSchema,
  articleSchema,
};

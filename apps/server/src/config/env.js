const { z } = require('zod');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().default('mongodb://localhost:27017/ravivarvichar'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  ADMIN_URL: z.string().default('http://localhost:5174'),
  IP_HASH_SALT: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().default('Ravivar Vichar <onboarding@resend.dev>'),
}).superRefine((data, ctx) => {
  // Fail fast in production if secrets/values that should never ship as defaults are missing
  if (data.NODE_ENV === 'production') {
    if (!data.IP_HASH_SALT) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['IP_HASH_SALT'], message: 'IP_HASH_SALT is required in production (set a long random string)' });
    }
    if (data.JWT_ACCESS_SECRET.length < 32 || data.JWT_REFRESH_SECRET.length < 32) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['JWT_ACCESS_SECRET'], message: 'JWT secrets must be at least 32 characters in production' });
    }
  }
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

module.exports = parsed.data;

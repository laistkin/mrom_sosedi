import { z } from 'zod';

// Campaign validation schema
export const campaignSchema = z.object({
  id: z.string().min(1, "Campaign ID is required").max(64),
  title: z.string().min(1, "Title is required").max(200),
  category: z.string().max(64).optional(),
  location: z.string().max(128).optional(),
  status: z.enum(['active', 'completed', 'hidden']).default('active'),
  needed: z.number().min(0).default(0),
  collected: z.number().int().nonnegative().default(0),
  donors: z.number().int().nonnegative().default(0),
  comments: z.number().int().nonnegative().default(0),
  image: z.string().url("Invalid URL").or(z.literal('')),
  summary: z.string().max(500).optional(),
  description: z.union([z.string(), z.array(z.any())]).default([]),
  documents: z.union([z.string(), z.array(z.any())]).default([]),
});

// Donation validation schema
export const donationSchema = z.object({
  campaignId: z.string().min(1, "Campaign ID is required").max(64),
  campaignTitle: z.string().max(256).optional(),
  amount: z.number().min(10, "Минимальная сумма пожертвования — 10₽").max(999999999),
  donorName: z.string().max(100).default(''),
  anonymous: z.boolean().default(false),
  method: z.enum(['bank_card', 'sbp']).default('bank_card'),
  userPhone: z.string().max(32).optional(),
});

// Admin auth validation schema
export const adminAuthSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

// ─── Site Content Section Schemas ─────────────────────────────

export const heroSchema = z.object({
  subtitle: z.string().max(128),
  title: z.string().max(256),
  description: z.string().max(1024).default(''),
});

export const aboutSchema = z.object({
  title: z.string().max(256),
  description: z.string().max(8192),
  phone: z.string().max(32).optional(),
  email: z.string().email('Некорректный email').or(z.literal('')).default(''),
  address: z.string().max(512).optional(),
  legalName: z.string().max(256).optional(),
  inn: z.string().regex(/^\d{10}$|^\d{12}$/, 'ИНН должен содержать 10 или 12 цифр').optional(),
  ogrn: z.string().regex(/^\d{13}$|^\d{15}$/, 'ОГРН должен содержать 13 или 15 цифр').optional(),
  activities: z.array(z.string().max(256)).default([]),
  requisites: z.string().max(4096).optional(),
});

export const helpStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().max(128),
  description: z.string().max(1024),
  icon: z.string().max(8).default('👆'),
});

export const faqSchema = z.object({
  question: z.string().max(512),
  answer: z.string().max(2048),
});

export const galleryImageSchema = z.object({
  id: z.string().min(1).max(64),
  url: z.string().url('Некорректный URL').max(2048),
  caption: z.string().max(256),
  date: z.string().max(64).default('Дата не указана'),
});

export const teamMemberSchema = z.object({
  id: z.string().min(1).max(64),
  name: z.string().max(128),
  role: z.string().max(128),
  bio: z.string().max(2048).optional(),
  photo: z.string().url('Некорректный URL').or(z.literal('')).default(''),
});

export const reportPostSchema = z.object({
  id: z.string().min(1).max(64),
  title: z.string().max(256),
  date: z.string().max(64).default('Дата не указана'),
  amount: z.number().int().nonnegative(),
  text: z.string().max(8192).optional(),
  image: z.string().url('Некорректный URL').or(z.literal('')).default(''),
  documents: z.array(z.string().max(2048)).default([]),
});

export const siteContentSchema = z.object({
  hero: heroSchema,
  about: aboutSchema,
  helpSteps: z.array(helpStepSchema).default([]),
  faq: z.array(faqSchema).default([]),
  gallery: z.array(galleryImageSchema).default([]),
  team: z.array(teamMemberSchema).default([]),
  reports: z.array(reportPostSchema).default([]),
});

// Helper function to parse and validate JSON data
export function safeParseJson<T>(schema: z.ZodType<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

// Helper to format Zod validation errors for API response
export function formatZodError(error: z.ZodError): string {
  const messages = error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`);
  return messages[0] || 'Validation failed';
}

// ─── URL / Query Param Schemas ──────────────────────────────

export const idParamSchema = z.object({
  id: z.string().min(1).max(64),
});

export const campaignQuerySchema = z.object({
  status: z.enum(['active', 'completed', 'hidden']).optional(),
  category: z.string().max(64).optional(),
  search: z.string().max(128).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const donationQuerySchema = z.object({
  campaignId: z.string().max(64).optional(),
  status: z.enum(['pending', 'confirmed', 'failed']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ─── Security Helpers ────────────────────────────────────────

/** Strip HTML tags to prevent basic XSS in user-provided text */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/** Sanitize a single string value (strip HTML, trim) */
export function sanitizeString(value: string | undefined | null): string {
  if (!value) return '';
  return stripHtml(value.trim());
}

// ─── Rate Limiter ──────────────────────────────────────────

interface RateLimitEntry {
  attempts: number[]; // timestamps in ms
}

const authRateLimit = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 10;

/** Check rate limit for a given key (e.g. IP address). Returns true if allowed. */
export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = authRateLimit.get(key);
  if (!entry) {
    authRateLimit.set(key, { attempts: [now] });
    return true;
  }

  // Prune old attempts outside the window
  entry.attempts = entry.attempts.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (entry.attempts.length >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false; // rate limited
  }

  entry.attempts.push(now);
  authRateLimit.set(key, entry); // update pruned list
  return true;
}

// Periodically clean up stale entries (every 5 min)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of authRateLimit.entries()) {
    if (entry.attempts.length === 0 || now - entry.attempts[entry.attempts.length - 1] > RATE_LIMIT_WINDOW_MS) {
      authRateLimit.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

export { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_ATTEMPTS };

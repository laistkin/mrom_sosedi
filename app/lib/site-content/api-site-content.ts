// Absolute URL for server-side RSC fetch compatibility on non-root routes
function getApiBase() {
  if (typeof window !== 'undefined') return '/api';
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '') + '/api';
  // Dev fallback: use localhost
  return 'http://localhost:3000/api';
}
const API_BASE = getApiBase();

async function apiFetch(url: string, options?: RequestInit): Promise<any> {
  const res = await fetch(API_BASE + url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Helper to parse JSONB fields returned from PostgreSQL
function safeParse(obj: any, key: string): any {
  const val = obj?.[key];
  if (val === undefined || val === null) return {};
  if (typeof val === 'object') return val; // already parsed
  try { return JSON.parse(val); } catch { return {}; }
}

// GET all site content
export async function getSiteContent() {
  try {
    const raw = await apiFetch('/site-content');
    if (!raw) return null;
    // Parse JSONB fields that PostgreSQL returns as strings
    return {
      ...raw,
      about: safeParse(raw, 'about'),
      hero: safeParse(raw, 'hero'),
      help_steps: safeParse(raw, 'help_steps'),
      faq: safeParse(raw, 'faq'),
      gallery: safeParse(raw, 'gallery'),
      team: safeParse(raw, 'team'),
      reports: safeParse(raw, 'reports')
    };
  } catch (err) {
    console.error('Failed to fetch site content:', err);
    return null;
  }
}

// UPDATE site content
export async function updateSiteContent(data: Record<string, any>) {
  try {
    await apiFetch('/site-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return true;
  } catch (err) {
    console.error('Failed to update site content:', err);
    return false;
  }
}

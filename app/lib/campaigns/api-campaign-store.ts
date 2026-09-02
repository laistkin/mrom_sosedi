import type { Campaign } from '../../data/campaigns';

// Absolute URL for server-side RSC fetch compatibility on non-root routes
function getApiBase() {
  if (typeof window !== 'undefined') return '/api';
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '') + '/api';
  return 'http://localhost:3000/api';
}
const API_BASE = getApiBase();

// Helper to handle API responses
async function apiFetch(url: string, options?: RequestInit): Promise<any> {
  const res = await fetch(`${API_BASE}${url}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// GET all campaigns from API
export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const data = await apiFetch('/campaigns');
    // Convert string amounts to numbers for frontend compatibility
    return (data || []).map((c: any) => ({
      ...c,
      needed: Number(c.needed),
      collected: Number(c.collected),
      donors: Number(c.donors),
      comments: Number(c.comments)
    }));
  } catch (err) {
    console.error('Failed to fetch campaigns:', err);
    return [];
  }
}

// GET single campaign by ID
export async function getCampaignById(id: string): Promise<Campaign | null> {
  try {
    const data = await apiFetch(`/campaigns/${id}`);
    if (!data) return null;
    return {
      ...data,
      needed: Number(data.needed),
      collected: Number(data.collected),
      donors: Number(data.donors),
      comments: Number(data.comments)
    };
  } catch (err) {
    console.error(`Failed to fetch campaign ${id}:`, err);
    return null;
  }
}

// CREATE or UPDATE a campaign (admin)
export async function saveCampaign(campaign: Campaign): Promise<boolean> {
  try {
    await apiFetch('/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: campaign.id,
        title: campaign.title,
        category: campaign.category,
        location: campaign.location,
        status: campaign.status || 'active',
        needed: campaign.needed,
        image: campaign.image,
        summary: campaign.summary,
        description: campaign.description,
        documents: campaign.documents
      })
    });
    return true;
  } catch (err) {
    console.error('Failed to save campaign:', err);
    return false;
  }
}

// DELETE a campaign (admin)
export async function deleteCampaign(id: string): Promise<boolean> {
  try {
    await apiFetch(`/campaigns/${id}`, { method: 'DELETE' });
    return true;
  } catch (err) {
    console.error(`Failed to delete campaign ${id}:`, err);
    return false;
  }
}

// Helper to generate ID from title
export function makeCampaignId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/ё/g, 'e')
    .replace(/[^a-zа-я0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 42);

  return slug || `campaign-${Date.now()}`;
}

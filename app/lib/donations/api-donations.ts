import type { DemoDonation } from './demo-donations';

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

// GET all donations (optionally filtered by campaignId)
export async function getDonations(campaignId?: string): Promise<DemoDonation[]> {
  try {
    const url = campaignId ? `/donations?campaignId=${campaignId}` : '/donations';
    const data = await apiFetch(url);
    return (data || []).map((d: any) => ({
      ...d,
      amount: Number(d.amount),
      created_at: d.created_at
    }));
  } catch (err) {
    console.error('Failed to fetch donations:', err);
    return [];
  }
}

// CREATE a new donation
export async function createDonation(params: {
  campaignId: string;
  campaignTitle: string;
  amount: number;
  donorName?: string;
  anonymous?: boolean;
  method?: 'bank_card' | 'sbp';
  userPhone?: string;
}): Promise<{ success: boolean; donationId?: string }> {
  try {
    const data = await apiFetch('/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: params.campaignId,
        campaignTitle: params.campaignTitle,
        amount: params.amount,
        donorName: params.donorName || '',
        anonymous: params.anonymous || false,
        method: params.method || 'bank_card',
        userPhone: params.userPhone || ''
      })
    });
    return { success: true, donationId: data.donationId };
  } catch (err) {
    console.error('Failed to create donation:', err);
    return { success: false };
  }
}

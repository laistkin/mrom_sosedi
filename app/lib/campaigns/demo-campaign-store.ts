import { campaigns, type Campaign } from '../../data/campaigns';

export const campaignsStorageKey = 'mrom_sosedi_demo_campaigns';

export function readDemoCampaigns(): Campaign[] {
  try {
    const storedCampaigns = window.localStorage.getItem(campaignsStorageKey);
    if (!storedCampaigns) {
      return campaigns;
    }

    return JSON.parse(storedCampaigns) as Campaign[];
  } catch {
    return campaigns;
  }
}

export function saveDemoCampaigns(nextCampaigns: Campaign[]) {
  window.localStorage.setItem(campaignsStorageKey, JSON.stringify(nextCampaigns));
}

export function resetDemoCampaigns() {
  window.localStorage.removeItem(campaignsStorageKey);
}

export function makeCampaignId(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/ё/g, 'e')
    .replace(/[^a-zа-я0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 42);

  return slug || `campaign-${Date.now()}`;
}

import type { Metadata } from 'next';
import { CampaignDetail } from '../../components/CampaignDetail';
import { SiteHeader } from '../../components/SiteHeader';
import { getCampaigns, getCampaignById as apiGetCampaignById } from '../../lib/campaigns/api-campaign-store';

type CampaignPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  const all = await getCampaigns();
  if (all.length > 0) return all.map((c) => ({ id: c.id }));
  // Fallback to demo IDs at build time
  return [
    { id: 'winter-clothes' },
    { id: 'ramadan-aid' },
    { id: 'mosque-renovation' },
    { id: 'family-support' }
  ];
}

export async function generateMetadata({
  params,
}: CampaignPageProps): Promise<Metadata> {
  const { id } = await params;
  const campaign = await apiGetCampaignById(id);

  return {
    title: campaign ? `${campaign.title} | МРОМ Соседи` : 'Сбор | МРОМ Соседи',
    description:
      campaign?.summary || 'Страница сбора местного исламского центра.',
  };
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { id } = await params;
  const campaign = await apiGetCampaignById(id);

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#07111f]">
      <SiteHeader />
      <CampaignDetail campaignId={id} initialCampaign={campaign || null} />
    </main>
  );
}

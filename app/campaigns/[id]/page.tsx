import type { Metadata } from 'next';
import { CampaignDetail } from '../../components/CampaignDetail';
import { SiteHeader } from '../../components/SiteHeader';
import { campaigns, getCampaignById } from '../../data/campaigns';

type CampaignPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return campaigns.map((campaign) => ({ id: campaign.id }));
}

export async function generateMetadata({
  params,
}: CampaignPageProps): Promise<Metadata> {
  const { id } = await params;
  const campaign = getCampaignById(id);

  return {
    title: campaign ? `${campaign.title} | МРОМ Соседи` : 'Сбор | МРОМ Соседи',
    description:
      campaign?.summary || 'Страница сбора местного исламского центра.',
  };
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { id } = await params;
  const campaign = getCampaignById(id);

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#07111f]">
      <SiteHeader />
      <CampaignDetail campaignId={id} initialCampaign={campaign || null} />
    </main>
  );
}

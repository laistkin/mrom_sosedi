'use client';


import { useEffect, useMemo, useState } from 'react';
import { formatRub, type Campaign } from '../data/campaigns';
import { getCampaigns, getDonations } from '../lib/campaigns/api-campaign-store';
import { ShareButton } from './ShareButton';

export function CampaignList({ initialCampaigns }: { initialCampaigns: Campaign[] }) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);

  useEffect(() => {
    getCampaigns().then(setCampaigns);
  }, []);

  const donationsByCampaign = useMemo(() => {
    // Donations are now tracked in campaign.donors and campaign.collected fields
    return {} as Record<string, number>;
  }, [campaigns]);

  const visibleCampaigns = campaigns.filter(
    (campaign) => campaign.status !== 'hidden',
  );

  return (
    <section
      className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 md:grid-cols-2 md:px-8 lg:grid-cols-3"
      id="collections"
    >
      {visibleCampaigns.map((campaign) => {
        const collected = donationsByCampaign[campaign.id] || campaign.collected;
        const percent = Math.min(
          100,
          Math.round((collected / campaign.needed) * 100),
        );

        return (
          <article
            className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_rgb(7_17_31/10%)]"
            key={campaign.id}
          >
            <a
              aria-label={`Открыть сбор: ${campaign.title}`}
              className="relative block h-80 overflow-hidden bg-zinc-200"
              href={`/campaigns/${campaign.id}`}
            >
              <img alt="" className="h-full w-full object-cover" src={campaign.image} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/5 to-black/30" />
              <div className="absolute left-4 top-4 flex items-center gap-3 text-white">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-center text-[10px] font-black uppercase leading-3 text-[#2f7d5f]">
                  МРОМ
                  <br />
                  Соседи
                </span>
                <div>
                  <p className="text-lg font-black leading-5">{campaign.category}</p>
                  <p className="mt-1 text-sm font-semibold text-white/85">
                    {campaign.location}
                  </p>
                </div>
              </div>
            </a>

            <div className="-mt-8 relative rounded-t-[28px] bg-white px-4 pb-4 pt-3">
              <div className="grid grid-cols-2 gap-3">
                <ShareButton
                  className="h-14 rounded-full bg-[#eef6f2] text-base font-black text-[#356f59]"
                  path={`/campaigns/${campaign.id}`}
                  title={campaign.title}
                />
                <a
                  className="grid h-14 place-items-center rounded-full bg-[#2f9f6b] text-base font-black text-white shadow-[0_12px_28px_rgb(47_159_107/18%)]"
                  href={`/campaigns/${campaign.id}#donation-preview`}
                >
                  Помочь
                </a>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-5">
                <div>
                  <p className="text-sm font-semibold text-zinc-400">нужно</p>
                  <p className="mt-1 text-3xl font-black tracking-tight">
                    {formatRub(campaign.needed)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-400">собрали</p>
                  <p className="mt-1 text-3xl font-black tracking-tight">
                    {formatRub(collected)}
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-[#2f9f6b]"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <a
                className="mt-5 block text-xl font-black leading-7 tracking-tight hover:text-[#2f7d5f]"
                href={`/campaigns/${campaign.id}`}
              >
                {campaign.title}
              </a>

              <div className="mt-5 flex items-center justify-between border-t border-zinc-200 pt-4 text-sm font-semibold text-zinc-400">
                <span>{campaign.donors} поддержали</span>
                <span>{campaign.comments} комментариев</span>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

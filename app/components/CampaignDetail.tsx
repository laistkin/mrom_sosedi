'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { formatRub, type Campaign } from '../data/campaigns';
import { getCampaignById } from '../lib/campaigns/api-campaign-store';
import { readDemoDonations } from '../lib/donations/demo-donations';
import { DonationForm } from './DonationForm';
import { ShareButton } from './ShareButton';

export function CampaignDetail({
  campaignId,
  initialCampaign,
}: {
  campaignId: string;
  initialCampaign: Campaign | null;
}) {
  const [campaign, setCampaign] = useState<Campaign | null>(initialCampaign);

  const getCollected = useMemo(() => {
    if (!campaign) return 0;
    return campaign.collected || 0;
  }, [campaign]);

  useEffect(() => {
    getCampaignById(campaignId).then((fetched) => {
      setCampaign(fetched || initialCampaign);
    });
  }, [campaignId, initialCampaign]);

  if (!campaign || campaign.status === 'hidden') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        <div className="rounded-[28px] bg-white p-8">
          <h1 className="text-3xl font-black">Сбор не найден</h1>
          <p className="mt-3 leading-7 text-zinc-600">
            Возможно, сбор скрыт в админ-панели или еще не создан.
          </p>
          <Link
            className="mt-6 inline-flex h-14 items-center rounded-full bg-[#2f9f6b] px-6 font-black text-white"
            href="/#collections"
          >
            Вернуться к сборам
          </Link>
        </div>
      </div>
    );
  }

  const percent = Math.min(
    100,
    Math.round((getCollected / campaign.needed) * 100),
  );

  return (
    <div className="mx-auto max-w-4xl px-0 pb-20 md:px-8">
      <div className="px-4 pt-8 md:px-0">
        <Link
          className="flex h-16 items-center justify-center gap-3 rounded-[22px] bg-white text-base font-black text-[#2f7d5f] shadow-[0_14px_45px_rgb(7_17_31/7%)]"
          href="/#collections"
        >
          <span aria-hidden="true" className="text-3xl leading-none">
            ←
          </span>
          Пожертвовать другим сборам
        </Link>
      </div>

      <section className="mt-6 overflow-hidden bg-white shadow-[0_24px_70px_rgb(7_17_31/10%)] md:rounded-[30px]">
        <div className="relative h-[430px] bg-zinc-200 sm:h-[520px]">
          <img alt="" className="h-full w-full object-cover" src={campaign.image} />
        </div>

        <div className="-mt-8 relative rounded-t-[30px] bg-white px-4 pb-6 pt-3 md:px-6">
          <div className="grid grid-cols-2 gap-3">
            <ShareButton
              className="h-14 rounded-full bg-[#eef6f2] text-base font-black text-[#356f59]"
              path={`/campaigns/${campaign.id}`}
              title={campaign.title}
            />
            <a
              className="grid h-14 place-items-center rounded-full bg-[#2f9f6b] text-base font-black text-white shadow-[0_12px_28px_rgb(47_159_107/18%)]"
              href="#donation-preview"
            >
              Помочь
            </a>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-5">
            <div>
              <p className="text-sm font-semibold text-zinc-400">нужно</p>
              <p className="mt-1 text-4xl font-black tracking-tight">
                {formatRub(campaign.needed)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-400">собрали</p>
              <p className="mt-1 text-4xl font-black tracking-tight">
                {formatRub(getCollected)}
              </p>
            </div>
          </div>

          <div className="mt-6 h-2 rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-[#2f9f6b]"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-3 text-sm font-semibold text-zinc-500">
            Собрано {percent}% от цели. Поддержали {campaign.donors} человек.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-[28px] bg-white px-4 py-7 md:px-8 md:py-9">
        <h1 className="text-3xl font-black leading-tight tracking-tight md:text-4xl">
          {campaign.title}
        </h1>

        <div className="mt-7 flex items-center gap-4 rounded-[24px] bg-[#eef1f5] p-4 md:p-5">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-center text-[11px] font-black uppercase leading-3 text-[#2f7d5f]">
            МРОМ
            <br />
            Соседи
          </span>
          <div>
            <p className="text-lg font-black">МРОМ Соседи</p>
            <p className="mt-1 leading-7 text-zinc-600">
              Местная религиозная организация мусульман
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6 text-lg leading-8 text-zinc-900">
          {campaign.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] bg-white p-6">
          <h2 className="text-xl font-black">Документы</h2>
          <div className="mt-5 space-y-3">
            {campaign.documents.length > 0 ? (
              campaign.documents.map((document) => (
                <div
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3"
                  key={document}
                >
                  <span className="font-semibold">{document}</span>
                  <span className="text-sm font-bold text-zinc-400">скоро</span>
                </div>
              ))
            ) : (
              <p className="leading-7 text-zinc-600">Документы пока не добавлены.</p>
            )}
          </div>
        </div>

        <div className="rounded-[24px] bg-white p-6">
          <h2 className="text-xl font-black">Связанные отчеты</h2>
          <div className="mt-5 space-y-3">
            {campaign.reports.length > 0 ? (
              campaign.reports.map((report) => (
                <div className="rounded-2xl bg-[#f4f5f7] p-4" key={report.title}>
                  <p className="font-black">{report.title}</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-500">
                    {report.date} · {formatRub(report.amount)}
                  </p>
                </div>
              ))
            ) : (
              <p className="leading-7 text-zinc-600">
                Отчеты появятся после первых расходов по этому сбору.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6" id="donation-preview">
        <DonationForm campaignId={campaign.id} campaignTitle={campaign.title} />
      </section>
    </div>
  );
}

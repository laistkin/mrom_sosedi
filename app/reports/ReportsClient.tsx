'use client';

import { useEffect, useState } from 'react';
import { formatRub } from '../data/campaigns';
import { getSiteContent } from '../lib/site-content/api-site-content';
type ReportPost = {
  id: string;
  title: string;
  date: string;
  image: string;
  amount: number;
  text: string;
  documents: string[];
};

export function ReportsClient({ initialReports }: { initialReports: ReportPost[] }) {
  const [reports, setReports] = useState<ReportPost[]>(initialReports);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSiteContent();
        if (data?.reports) setReports(data.reports as ReportPost[]);
      } catch {}
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <section className="max-w-3xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#05863a]">
          Отчеты
        </p>
        <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
          Прозрачность расходов и мероприятий
        </h1>
        <p className="mt-6 text-xl leading-9 text-zinc-700">
          Здесь публикуются проведенные мероприятия, потраченные средства,
          фотографии и документы, которые можно обновлять через админ-панель.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        {reports.map((report) => (
          <article
            className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_rgb(7_17_31/10%)]"
            key={report.id}
          >
            <div className="h-72 bg-zinc-200">
              <img alt="" className="h-full w-full object-cover" src={report.image} />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-zinc-500">
                <span>{report.date}</span>
                <span className="rounded-full bg-[#e8f7ef] px-3 py-1 text-[#006d2f]">
                  {formatRub(report.amount)}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-black leading-tight">
                {report.title}
              </h2>
              <p className="mt-4 leading-7 text-zinc-700">{report.text}</p>

              <div className="mt-5 space-y-2">
                {report.documents.map((document) => (
                  <div
                    className="flex items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3"
                    key={document}
                  >
                    <span className="font-semibold">{document}</span>
                    <span className="text-sm font-bold text-zinc-400">документ</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

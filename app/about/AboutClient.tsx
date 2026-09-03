'use client';

import { useEffect, useState } from 'react';
import { getSiteContent } from '../lib/site-content/api-site-content';
type AboutContent = {
  title: string;
  description: string;
  activities: string[];
  phone: string;
  email: string;
  address: string;
  legalName: string;
  inn: string;
  ogrn: string;
  requisites: string;
};

export function AboutClient() {
  const [about, setAbout] = useState<AboutContent>({ title: '', description: '', activities: [], phone: '', email: '', address: '', legalName: '', inn: '', ogrn: '', requisites: '' });

  useEffect(() => {
    (async () => {
      try {
        const data = await getSiteContent();
        if (data?.about) setAbout(data.about as AboutContent);
      } catch {}
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <section className="max-w-3xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#05863a]">
          О нас
        </p>
        <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
          {about.title}
        </h1>
        <p className="mt-6 text-xl leading-9 text-zinc-700">{about.description}</p>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-[28px] bg-white p-6 md:p-8">
          <h2 className="text-2xl font-black">Чем мы занимаемся</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {about.activities.map((activity) => (
              <div className="rounded-2xl bg-[#f4f5f7] p-5" key={activity}>
                <p className="font-black leading-7">{activity}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[28px] bg-[#07111f] p-6 text-white md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/45">
            Контакты
          </p>
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm font-bold text-white/45">Телефон</p>
              <p className="mt-1 text-xl font-black">{about.phone}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-white/45">Email</p>
              <p className="mt-1 text-xl font-black">{about.email}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-white/45">Адрес</p>
              <p className="mt-1 text-lg font-bold leading-7">(about as any).address || 'Адрес будет добавлен'</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-5 rounded-[28px] bg-white p-6 md:p-8">
        <h2 className="text-2xl font-black">Юридическая информация</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Info label="Юридическое название" value={about.legalName} />
          <Info label="ИНН" value={about.inn} />
          <Info label="ОГРН" value={about.ogrn} />
          <Info label="Реквизиты" value={about.requisites} />
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-5">
      <p className="text-sm font-bold text-zinc-400">{label}</p>
      <p className="mt-2 font-black leading-7">{value}</p>
    </div>
  );
}

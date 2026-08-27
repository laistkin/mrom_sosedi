'use client';

import { readSiteContent } from '../lib/site-content/demo-site-content';

export function TeamClient() {
  const team = readSiteContent().team;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 md:px-8">
      {/* Hero */}
      <section className="mb-16 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#05863a]">
          Люди
        </p>
        <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          Наша команда
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
          Люди, которые стоят за проектом местного исламского центра и делают его возможным.
        </p>
      </section>

      {/* Team Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <div
            key={member.id}
            className="rounded-[28px] border border-zinc-200 bg-white overflow-hidden transition-shadow hover:shadow-[0_18px_45px_rgb(7_17_31/8%)]"
          >
            <div className="aspect-square overflow-hidden bg-zinc-100">
              <img
                src={member.photo}
                alt={member.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-400">
                {member.role}
              </p>
              <h2 className="mt-2 text-2xl font-black">{member.name}</h2>
              <p className="mt-3 leading-7 text-zinc-600">{member.bio}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-16">
        <div className="rounded-[28px] border border-dashed border-zinc-300 bg-white p-8 md:p-12 text-center">
          <h2 className="text-2xl font-black">Хотите присоединиться?</h2>
          <p className="mt-4 leading-7 text-zinc-600">
            Мы всегда рады новым помощникам и волонтёрам. Свяжитесь с нами, чтобы узнать больше.
          </p>
          <a
            href="mailto:info@example.ru"
            className="mt-8 inline-block rounded-full bg-[#2f9f6b] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#258a5d]"
          >
            Написать нам →
          </a>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

import { readSiteContent } from '../lib/site-content/demo-site-content';

export function HowToHelpClient() {
  const [helpSteps] = useState(() => readSiteContent().helpSteps);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 md:px-8">
      {/* Hero */}
      <section className="mb-16 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#05863a]">
          Инструкция
        </p>
        <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          Как помочь
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
          Четыре простых шага, чтобы поддержать ваш донат наш центр. Это займёт меньше минуты.
        </p>
      </section>

      {/* Steps */}
      <section className="mb-20 grid gap-6 md:grid-cols-2">
        {helpSteps.map((step) => (
          <div
            key={step.step}
            className="rounded-[28px] border border-zinc-200 bg-white p-8 transition-shadow hover:shadow-[0_18px_45px_rgb(7_17_31/8%)]"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef6f2] text-3xl">
              {step.icon}
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-400">
              Шаг {step.step}
            </p>
            <h2 className="mt-3 text-2xl font-black">{step.title}</h2>
            <p className="mt-3 leading-7 text-zinc-600">{step.description}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="rounded-[28px] bg-white p-8 md:p-12">
        <h2 className="text-3xl font-black">Готовы поддержать?</h2>
        <p className="mt-4 max-w-xl leading-7 text-zinc-600">
          Перейдите к активным сборам и выберите тот, который откликается вашему сердцу. Каждый рубль идёт на общее дело.
        </p>
        <a
          href="/#collections"
          className="mt-8 inline-block rounded-full bg-[#2f9f6b] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#258a5d]"
        >
          Перейти к сборам →
        </a>
      </section>

      {/* FAQ preview */}
      <section className="mt-16">
        <div className="rounded-[28px] border border-dashed border-zinc-300 bg-white p-8 md:p-12">
          <h2 className="text-2xl font-black">Есть вопросы?</h2>
          <p className="mt-4 leading-7 text-zinc-600">
            Посмотрите ответы на частые вопросы или свяжитесь с нами.
          </p>
          <a
            href="/faq"
            className="mt-6 inline-block rounded-full border border-[#2f9f6b] px-8 py-4 text-lg font-bold text-[#2f9f6b] transition-colors hover:bg-[#eef6f2]"
          >
            Читать FAQ →
          </a>
        </div>
      </section>
    </div>
  );
}

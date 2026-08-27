'use client';

import { useState } from 'react';
import Link from 'next/link';
import { readSiteContent } from '../lib/site-content/demo-site-content';

export function FAQClient() {
  const faq = readSiteContent().faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-12 md:px-8">
      {/* Hero */}
      <section className="mb-16 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#05863a]">
          Помощь
        </p>
        <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          Часто задаваемые вопросы
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
          Ответы на популярные вопросы о пожертвованиях, безопасности и отчётности.
        </p>
      </section>

      {/* FAQ Accordion */}
      <section className="space-y-4">
        {faq.map((item, index) => (
          <div
            key={index}
            className="rounded-[28px] border border-zinc-200 bg-white overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-8 py-6 text-left transition-colors hover:bg-zinc-50"
            >
              <h2 className="text-lg font-bold pr-4">{item.question}</h2>
              <span className={`shrink-0 text-2xl text-zinc-400 transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            {openIndex === index && (
              <div className="px-8 pb-6">
                <p className="leading-7 text-zinc-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Contact CTA */}
      <section className="mt-16">
        <div className="rounded-[28px] border border-dashed border-zinc-300 bg-white p-8 md:p-12 text-center">
          <h2 className="text-2xl font-black">Не нашли ответ?</h2>
          <p className="mt-4 leading-7 text-zinc-600">
            Свяжитесь с нами любым удобным способом, и мы обязательно поможем.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="mailto:info@example.ru"
              className="rounded-full bg-[#2f9f6b] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#258a5d]"
            >
              Написать на почту
            </a>
            <Link
              href="/how-to-help"
              className="rounded-full border border-zinc-300 px-8 py-4 text-lg font-bold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Как помочь
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

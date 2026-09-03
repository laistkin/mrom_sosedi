
import { CampaignList } from './components/CampaignList';
import { SiteHeader } from './components/SiteHeader';
import { getCampaigns } from './lib/campaigns/api-campaign-store';
import { getSiteContent } from './lib/site-content/api-site-content';

export default async function Home() {
  const [siteContent, campaigns] = await Promise.all([
    getSiteContent(),
    getCampaigns()
  ]);
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#07111f]">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-12 md:px-8 md:pb-12 md:pt-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#05863a]">
            {(siteContent?.hero as any)?.subtitle || 'МРОМ Соседи'}
          </p>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {(siteContent?.hero as any)?.title || 'Помогаем тем, кто рядом'}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
            {(siteContent?.hero as any)?.description || 'Поддержите исламский центр, где проходят молитвы и лекции, распространяются знания о религии и реализуются социальные и просветительские проекты для нашей общины.'}
          </p>
        </div>

        <label className="mt-8 flex h-16 max-w-3xl items-center gap-4 rounded-[24px] bg-white px-5 shadow-[0_20px_60px_rgb(7_17_31/8%)]">
          <span aria-hidden="true" className="text-3xl leading-none">
            ⌕
          </span>
          <input
            className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-zinc-400"
            placeholder="Поиск по сборам"
            type="search"
          />
        </label>
      </section>

      <CampaignList initialCampaigns={campaigns} />

      <section
        className="mx-auto max-w-6xl px-4 pb-20 md:px-8"
        id="donation-preview"
      >
        <div className="rounded-[28px] border border-dashed border-zinc-300 bg-white p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#05863a]">
            Как помочь
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight">
            Пожертвовать можно прямо на странице сбора
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-zinc-600">
            Выберите сбор, нажмите «Поддержать» и внесите пожертвование удобным способом — через СБП или банковской картой.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-3 md:px-8">
        <a className="rounded-[24px] bg-white p-6 hover:shadow-[0_18px_45px_rgb(7_17_31/8%)]" href="/how-to-help">
          <h2 className="mt-3 text-xl font-black">Как помочь</h2>
          <p className="mt-3 leading-7 text-zinc-600">
            Пошаговое руководство по пожертвованиям и поддержке центра.
          </p>
        </a>
        <a className="rounded-[24px] bg-white p-6 hover:shadow-[0_18px_45px_rgb(7_17_31/8%)]" href="/faq">
          <h2 className="mt-3 text-xl font-black">Частые вопросы</h2>
          <p className="mt-3 leading-7 text-zinc-600">
            Ответы на популярные вопросы о пожертвованиях и отчётности.
          </p>
        </a>
        <a className="rounded-[24px] bg-white p-6 hover:shadow-[0_18px_45px_rgb(7_17_31/8%)]" href="/gallery">
          <h2 className="mt-3 text-xl font-black">Галерея</h2>
          <p className="mt-3 leading-7 text-zinc-600">
            Фото с мероприятий, занятий и повседневной работы центра.
          </p>
        </a>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-3 md:px-8">
        <a className="rounded-[24px] bg-white p-6 hover:shadow-[0_18px_45px_rgb(7_17_31/8%)]" href="/about" id="about">
          <h2 className="mt-3 text-xl font-black">О нас</h2>
          <p className="mt-3 leading-7 text-zinc-600">
            Вся важная информация о МРОМ «Соседи»: контакты, реквизиты и официальные данные.
          </p>
        </a>
        <a className="rounded-[24px] bg-white p-6 hover:shadow-[0_18px_45px_rgb(7_17_31/8%)]" href="/reports" id="reports">
          <h2 className="mt-3 text-xl font-black">Отчеты</h2>
          <p className="mt-3 leading-7 text-zinc-600">
            Фото, документы и информация о том, как используются пожертвования.
          </p>
        </a>
        <a className="rounded-[24px] bg-white p-6 hover:shadow-[0_18px_45px_rgb(7_17_31/8%)]" href="/team">
          <h2 className="mt-3 text-xl font-black">Команда</h2>
          <p className="mt-3 leading-7 text-zinc-600">
            Те, кто развивает МРОМ «Соседи», организует работу центра и помогает нашей общине.
          </p>
        </a>
      </section>
    </main>
  );
}

import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 rounded-b-[28px] border-b border-black/5 bg-white/95 px-4 py-3 shadow-[0_14px_45px_rgb(7_17_31/8%)] backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <img
            alt="Логотип МРОМ Соседи"
            className="h-10 w-10 shrink-0"
            src="/logo-placeholder.svg"
          />
          <span className="truncate text-lg font-black tracking-tight sm:text-xl">
            МРОМ Соседи
          </span>
        </Link>

        <nav className="hidden items-center gap-2 text-sm font-semibold text-zinc-600 md:flex">
          <Link className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/">
            Сборы
          </Link>
          <Link className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/how-to-help">
            Как помочь
          </Link>
          <Link className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/faq">
            FAQ
          </Link>
          <Link className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/about">
            О нас
          </Link>
          <Link className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/reports">
            Отчеты
          </Link>
          <Link className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/gallery">
            Галерея
          </Link>
          <Link className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/team">
            Команда
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className="hidden rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 sm:inline-flex"
            href="/account"
          >
            Войти
          </Link>
          <button
            aria-label="Открыть меню"
            className="grid h-12 w-12 place-items-center rounded-2xl border border-zinc-200 bg-white"
            type="button"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-6 rounded bg-zinc-800" />
              <span className="block h-0.5 w-6 rounded bg-zinc-800" />
              <span className="block h-0.5 w-6 rounded bg-zinc-800" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

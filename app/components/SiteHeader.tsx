

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 rounded-b-[28px] border-b border-black/5 bg-white/95 px-4 py-3 shadow-[0_14px_45px_rgb(7_17_31/8%)] backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <a className="flex min-w-0 items-center gap-3" href="/">
          <img
            alt="Логотип МРОМ Соседи"
            className="h-10 w-10 shrink-0"
            src="/logo-placeholder.svg"
          />
          <span className="truncate text-lg font-black tracking-tight sm:text-xl">
            МРОМ Соседи
          </span>
        </a>

        <nav className="hidden items-center gap-2 text-sm font-semibold text-zinc-600 md:flex">
          <a className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/">
            Сборы
          </a>
          <a className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/how-to-help">
            Как помочь
          </a>
          <a className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/faq">
            FAQ
          </a>
          <a className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/about">
            О нас
          </a>
          <a className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/reports">
            Отчеты
          </a>
          <a className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/gallery">
            Галерея
          </a>
          <a className="rounded-full px-4 py-2 hover:bg-zinc-100" href="/team">
            Команда
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            className="hidden rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 sm:inline-flex"
            href="/account"
          >
            Войти
          </a>
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

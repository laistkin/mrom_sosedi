'use client';

import { useState, useEffect } from 'react';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Закрыть меню при клике вне его области
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-mobile-menu]')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  // Блокировать скролл когда меню открыто
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { href: '/', label: 'Сборы' },
    { href: '/how-to-help', label: 'Как помочь' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'О нас' },
    { href: '/reports', label: 'Отчеты' },
    { href: '/gallery', label: 'Галерея' },
    { href: '/team', label: 'Команда' },
  ];

  return (
    <header className="sticky top-0 z-40 rounded-b-[28px] border-b border-black/5 bg-white/95 px-4 py-3 shadow-[0_14px_45px_rgb(7_17_31/8%)] backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        {/* Логотип */}
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

        {/* Десктопная навигация */}
        <nav className="hidden items-center gap-2 text-sm font-semibold text-zinc-600 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} className="rounded-full px-4 py-2 hover:bg-zinc-100" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Правая часть: кнопка входа + бургер */}
        <div className="flex items-center gap-2">
          <a
            className="hidden rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 sm:inline-flex"
            href="/account"
          >
            Войти
          </a>

          {/* Кнопка бургер */}
          <button
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            className="grid h-12 w-12 place-items-center rounded-2xl border border-zinc-200 bg-white md:hidden"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            type="button"
          >
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-6 rounded bg-zinc-800 transition-transform ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-0.5 w-6 rounded bg-zinc-800 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 rounded bg-zinc-800 transition-transform ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <div data-mobile-menu className="fixed inset-x-0 top-[68px] z-50 bg-white px-4 py-6 shadow-lg md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="rounded-full px-4 py-3 text-center font-semibold text-zinc-700 hover:bg-zinc-100"
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4">
              <a
                className="block rounded-full bg-[#2f9f6b] px-4 py-3 text-center font-bold text-white"
                href="/account"
                onClick={() => setMenuOpen(false)}
              >
                Войти
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

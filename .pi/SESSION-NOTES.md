# MROM Sosedi — Заметки сессии (для продолжения)

## 🏁 Текущая сессия: ЗАВЕРШЕНА
**Дата завершения:** 2025-01-XX
**Выполнено:** Task 7.8 (Zod валидация) + Task 7.9 (привязка пожертвований к пользователям)
**Статус проекта:** Этап 7 завершён до Task 7.9. Ожидание решения по приоритету: Деплой (7.11) vs P1 задачи.

### Что сделано в этой сессии:
#### Task 7.8 — Zod валидация и обработка ошибок
- Все API endpoints имеют серверную валидацию через Zod схемы
- Rate limiting на `/api/admin-auth`: 10 попыток / 5 минут по IP
- Security utils: `stripHtml()`, `sanitizeString()` для XSS защиты
- Единый формат ошибок `{ error: string }` во всех route handlers

#### Task 7.9 — Привязка пожертвований к пользователям + глобальные метрики
- Миграция `003_add_user_phone.sql`: добавлено поле `user_phone` в donations с индексом
- API `/api/donations/[phone]`: GET — история пожертвований пользователя по телефону
- API `/api/metrics`: GET — глобальные метрики (totalDonations, totalAmount, activeCampaigns)

---

## 🏁 Сессия продолжения: ЗАВЕРШЕНА
**Дата завершения:** 2025-01-XX
**Выполнено:** Деплой на Cloudflare Pages + исправление навигации + мобильное меню

### Что сделано в этой сессии:
#### Исправление деплоя и навигации
1. ✅ Удалён `vercel.json` (не совместим)
2. ✅ Создан `wrangler.toml` с `[vars]` (DATABASE_URL, JWT_SECRET)
3. ✅ Исправлен `app/lib/db.ts` — graceful fallback при отсутствии DATABASE_URL
4. ✅ Исправлен `app/lib/auth/jwt.ts` — cookie domain для Cloudflare Workers
5. ✅ Заменены все `<Link>` на `<a>` в 8 файлах (SiteHeader, page, CampaignList, CampaignDetail, AccountClient, AdminClient, FAQClient, HowToHelpClient)
6. ✅ Удалён `SafeLink.tsx` (не нужен после замены на `<a>`)
7. ✅ Конвертирован `/about` в client component для HTTP 200

#### Мобильное меню (последнее действие)
8. ✅ Полностью переписан `SiteHeader.tsx`:
   - Кнопка-бургер теперь работает (открывает/закрывает меню)
   - Анимация иконки: три полоски → крестик
   - Выпадающее меню со всеми пунктами навигации
   - Закрытие по клику вне меню
   - Блокировка скролла когда меню открыто

### Следующий шаг при возвращении:
1. Прочитать `.pi/CONTEXT.md` — полный контекст проекта
2. **РЕШИТЬ КРИТИЧЕСКУЮ ПРОБЛЕМУ:** API маршруты НЕ работают на Cloudflare Pages
3. Выбрать: Wrangler Workers (вручную) или VPS/HTTPS

---

## 🔴 КРИТИЧЕСКАЯ ПРОБЛЕМА: BUG-DEPLOY-1

### Суть
Cloudflare Pages **не поддерживает API маршруты** (`/api/*`). Все запросы к `/api/admin-auth`, `/api/campaigns` и т.д. возвращают ошибку 404.

### Симптомы
- При входе в админку: «Неверный пароль» (хотя пароль `sosedi2026` верный)
- Прямой запрос к API: `curl https://...workers.dev/api/admin-auth` → error code 1101

### Решение: переключиться на Wrangler Workers
Деплоить через `npx wrangler deploy` вместо GitHub → Cloudflare Pages.

**Плюсы:**
- ✅ API маршруты работают полностью
- ✅ Полный доступ к Edge Runtime
- ✅ Бесплатный тариф: 100к запросов/день

**Минусы:**
- ❌ Нет автодеплоя из GitHub — нужно деплоить вручную с компьютера
- ❌ Нужно держать CLI `wrangler` установленным
- ⚠️ Сложнее для команды

### Что уже сделано
1. ✅ Создан `wrangler.toml` с `[vars]` (DATABASE_URL, JWT_SECRET)
2. ✅ Исправлен `app/lib/db.ts` — graceful fallback при отсутствии DATABASE_URL
3. ✅ Исправлен `app/lib/auth/jwt.ts` — cookie domain для Cloudflare Workers
4. ✅ Заменены все `<Link>` на `<a>` в 8 файлах (навигация работает)
5. ✅ Добавлено рабочее мобильное меню (`SiteHeader.tsx`)
6. ✅ Удалён `vercel.json`
7. ✅ Удалён `SafeLink.tsx`

### Следующий шаг
Решение пользователя: Workers (вручную) или VPS/HTTPS для полноценного деплоя.

---

## 📍 Где остановились
Этап 7: Миграция фронтенда на Neon PostgreSQL + API маршруты.

**Последнее действие:** Добавлено рабочее мобильное меню в SiteHeader.tsx, закоммичено и запушено на GitHub.

**Статус сессии:** Сессия завершена пользователем.

## ✅ Что сделано в этой сессии
1. Обновлены импорты в `AdminClient.tsx`: убраны `baseCampaigns`, `readDemoCampaigns`, `saveDemoDonation`; добавлены `getCampaigns`, `apiSaveCampaign`, `apiDeleteCampaign`, `getDonations`
2. `useState<Campaign[]>([])` — пустой старт вместо `baseCampaigns`
3. `useEffect` при монтировании: fetch кампаний и донатов из API, populate state
4. `donationsByCampaign` перенесён в `useState`, заполняется в useEffect
5. `login()` → POST `/api/admin-auth` с fallback на демо-пароль
6. `saveCampaign()` → `await apiSaveCampaign(nextCampaign)` + локальный set
7. `openDeleteModal()` → `await apiDeleteCampaign(id)` внутри deleteRef
8. `resetAll()` → перезагрузка кампаний из API
9. Все site-content handlers (Hero, HelpSteps, FAQ, Gallery, Team, Reports) → `apiSaveSiteContent`

## 🔧 Что нужно проверить/доделать в следующей сессии

### Фаза 2: Исправление аудита (P0) — ✅ ЗАВЕРШЕНО
- [x] **Homepage** (`app/page.tsx`): заменены `readSiteContent()` и статические `campaigns` на API fetch
- [x] **ReportsClient**: убрана `readSiteContent()`, добавлен fetch `/api/site-content`
- [x] **AboutClient**: аналогично ReportsClient
- [x] **GalleryClient**: добавлен useEffect с fetch gallery данных
- [x] **TeamClient**: добавлен useEffect с fetch team данных
- [x] **Campaigns page** (`app/campaigns/[id]/page.tsx`): заменён демо-импорт на `api-campaign-store`
- [x] **AdminClient**: переключены site-content CRUD на `api-site-content.ts`, добавлена загрузка при монтировании

### Фаза 3: Тестирование API + исправление багов — ✅ ЗАВЕРШЕНО
- [x] Запустить `vinext dev`, проверить все публичные страницы против Neon DB
- [x] Протестировать админку: логин, CRUD кампаний, редактирование site-content
- [x] Проверить форму пожертвования — запись в БД через `/api/donations`
- [x] Исправлен BUG-7: PostgreSQL JSONB поля возвращаются как строки → добавлен `safeParse()` в `api-site-content.ts`

### Фаза 4.1: JWT-сессии для админа — ✅ ЗАВЕРШЕНО
- [x] Создан `app/lib/auth/jwt.ts`: `signToken()`, `verifyToken()`, `setCookie()`, `clearCookie()` (jose библиотека)
- [x] Обновлён `/api/admin-auth/route.ts`: POST → JWT cookie, GET → проверка сессии, DELETE → logout
- [x] AdminClient.tsx: login/logout через HTTP-only cookie

### Фаза 5: Деплой и исправление навигации — ✅ ЗАВЕРШЕНО (частично)
- [x] Удалён `vercel.json`
- [x] Создан `wrangler.toml` с env vars
- [x] Исправлен `app/lib/db.ts` — graceful fallback
- [x] Исправлен `app/lib/auth/jwt.ts` — cookie domain
- [x] Заменены все `<Link>` на `<a>` в 8 файлах
- [x] Удалён `SafeLink.tsx`
- [x] Конвертирован `/about` в client component
- [x] Добавлено рабочее мобильное меню (`SiteHeader.tsx`)

### Осталось по Этапу 7
- [ ] **7.3** YooKassa: создание платежа, редирект, вебхуки (blocked: нужен HTTPS)
- [ ] **7.4** Idempotency keys
- [ ] **7.5** Авто-обновление `collected` после успешного платежа
- [ ] **7.6** Интеграция реального SMS-провайдера для аутентификации
- [ ] **7.7** Загрузка файлов (фото, документы)
- [ ] **7.11** Деплой на VPS + HTTPS

## 🗄️ База данных
- Neon PostgreSQL: `wild-brook-98327580`, branch: production
- Таблицы: campaigns, donations, site_content, admin_users
- Сидировано 3 кампании + контент сайта
- Драйвер: `@neondatabase/serverless`

## 🔑 Ключевые файлы
| Файл | Роль |
|------|------|
| `app/lib/db.ts` | Клиент PostgreSQL (graceful fallback) |
| `app/api/campaigns/route.ts` | GET /api/campaigns, POST /api/campaigns |
| `app/api/donations/route.ts` | GET /api/donations, POST /api/donations |
| `app/api/site-content/route.ts` | GET /api/site-content, POST /api/site-content |
| `app/api/admin-auth/route.ts` | POST/GET/DELETE /api/admin-auth (JWT login/check/logout) |
| `app/lib/auth/jwt.ts` | JWT sign/verify + httpOnly cookie helpers |
| `wrangler.toml` | Конфиг Wrangler с DATABASE_URL и JWT_SECRET |

## ⚠️ Известные ограничения
- Пароль админа `sosedi2026` на сервере (demo mode, Phase 7.2+ → bcrypt + DB)
- YooKassa требует HTTPS для заявки
- Fallback на localStorage/demo-store при недоступности БД (client components)

## 🚀 Команды
```bash
vinext dev          # dev сервер
vinext build        # сборка
npx wrangler deploy # деплой на Workers
```

## 💡 Важные решения
- **Навигация:** заменены все `<Link>` на `<a href="...">` — работает на Cloudflare Workers через full page reload
- **Мобильное меню:** клиентский компонент с useState/useEffect, анимация иконки, блокировка скролла
- **Деплой:** wrangler.toml хранит DATABASE_URL и JWT_SECRET для persistence между деплоями
# MROM Sosedi — Полный контекст для продолжения сессии

## 🎯 Цель проекта
Создать сайт сбора пожертвований для Исламского центра «МРОМ Соседи». Пользователи могут просматривать кампании, делать пожертвования, видеть отчёты. Администратор управляет контентом через админ-панель.

## 📦 Технологический стек
- **Фреймворк:** Vinext (Next.js 16.2.6 App Router стиль) с Turbopack
- **UI:** React 19, Tailwind CSS 4
- **База данных:** Neon PostgreSQL (Lakebase Postgres), branch: production
- **Драйвер БД:** `@neondatabase/serverless`
- **Аутентификация админа:** JWT через HTTP-only cookie (`mrom_admin_session`, 24ч)
- **Платёжный провайдер:** YooKassa (пока демо, нужен HTTPS для вебхуков)

## 🗄️ Структура базы данных

### Таблицы:
```sql
-- Кампании
campaigns: id, title, category, location, status, needed, collected, donors, comments,
           image, summary, description (TEXT[]), documents (TEXT[]), reports (JSONB)

-- Пожертвования
donations: id, campaign_id, campaign_title, amount, donor_name, anonymous, method, user_phone, created_at
  - user_phone: привязка к пользователю для истории пожертвований
  - method: 'bank_card' | 'sbp'

-- Контент сайта (About + Reports)
site_content: id (default='default'), hero JSONB, about JSONB, help_steps TEXT[], faq JSONB,
              gallery JSONB, team JSONB, reports JSONB

-- Администраторы
admin_users: id, username, password_hash, created_at
```

### Миграции:
- `migrations/001_initial_schema.sql` — базовая схема
- `migrations/002_seed_data.sql` — сидирование 3 кампаний + контент
- `migrations/003_add_user_phone.sql` — добавление user_phone в donations

## 🔑 Ключевые файлы и их роль

### API Routes:
| Путь | Методы | Описание |
|------|--------|----------|
| `/api/campaigns` | GET, POST | Список/создание кампаний |
| `/api/campaigns/[id]` | GET, PUT, DELETE | Операции с одной кампанией |
| `/api/donations` | GET, POST | Список/создание пожертвований |
| `/api/donations/[phone]` | GET | История пожертвований по телефону |
| `/api/site-content` | GET, POST | Контент сайта (about, reports и т.д.) |
| `/api/admin-auth` | POST, GET, DELETE | JWT login/check/logout |
| `/api/metrics` | GET | Глобальные метрики (totalDonations, totalAmount, activeCampaigns) |

### Клиентские API stores:
- `app/lib/campaigns/api-campaign-store.ts` — fetch кампаний
- `app/lib/donations/api-donations.ts` — создание/получение пожертвований
- `app/lib/site-content/api-site-content.ts` — контент сайта

### Утилиты:
- `app/lib/db.ts` — PostgreSQL клиент (neon)
- `app/lib/validators.ts` — Zod схемы валидации + security utils
- `app/lib/auth/jwt.ts` — JWT sign/verify + cookie helpers
- `app/lib/auth/session.ts` — server-side session extraction

### Компоненты:
- `app/admin/AdminClient.tsx` — админ-панель (~1300 строк)
- `app/components/DonationForm.tsx` — форма пожертвования (собирает телефон)
- `app/account/AccountClient.tsx` — личный кабинет (показывает историю из БД)

### Демо данные:
- `app/lib/donations/demo-donations.ts` — fallback для localStorage (client-only)
- `app/data/campaigns.ts` — статические демо кампании

## 🔐 Аутентификация админа
- Пароль по умолчанию: `sosedi2026` (fallback в route handler)
- JWT токен хранится в HTTP-only cookie `mrom_admin_session`
- Срок действия: 24 часа
- Rate limiting на `/api/admin-auth`: 10 попыток / 5 минут по IP

## ✅ Что завершено
### Этапы 1–6 + 1.5: Полный фронтенд
### Этап 7:
- [x] 7.1 — Миграция localStorage → Neon PostgreSQL (все фазы)
- [x] 7.2 — JWT сессии для админа
- [x] 7.8 — Zod валидация, rate limiting, security utils
- [x] 7.9 — Привязка пожертвований к пользователям + глобальные метрики

## 🔴 КРИТИЧЕСКАЯ ПРОБЛЕМА: BUG-DEPLOY-1

Cloudflare Pages **не поддерживает API маршруты** (`/api/*`). Все запросы к `/api/admin-auth`, `/api/campaigns` и т.д. возвращают ошибку 404.

**Решение:** Деплоить через `npx wrangler deploy` (Wrangler Workers) вместо GitHub → Cloudflare Pages.
- ✅ API маршруты работают полностью
- ❌ Нет автодеплоя из GitHub — нужно деплоить вручную с компьютера

### Что уже сделано:
1. ✅ Создан `wrangler.toml` с `[vars]` (DATABASE_URL, JWT_SECRET)
2. ✅ Исправлен `app/lib/db.ts` — graceful fallback при отсутствии DATABASE_URL
3. ✅ Исправлен `app/lib/auth/jwt.ts` — cookie domain для Cloudflare Workers
4. ✅ Заменены все `<Link>` на `<a>` в 8 файлах (навигация работает)
5. ✅ Добавлено рабочее мобильное меню (`SiteHeader.tsx`)
6. ✅ Удалён `vercel.json`, удалён `SafeLink.tsx`

## 🔜 Что делать дальше (приоритеты)

### БЛОКИРУЮЩЕЕ: Деплой (7.11)
YooKassa требует HTTPS для вебхуков платежей. Без публичного домена невозможно:
- 7.3 — Интеграция YooKassa (создание платежа, редирект, вебхуки)
- 7.4 — Idempotency keys
- 7.5 — Авто-обновление collected после платежа

**Рекомендуемый порядок:**
1. **7.11 Деплой на VPS + HTTPS** (Vercel/Neon deploy или свой VPS + Cloudflare)
2. Затем платежи 7.3–7.5

### Альтернатива: P1 задачи без HTTPS
Если деплой откладывается, можно сделать:
- **7.6 SMS-провайдер** — замена демо SMS на реальный сервис (Twilio/Azure/СМС-шлюз)
- **7.7 File Upload** — загрузка фото/документов через API

## ⚠️ Известные проблемы (не блокирующие)
1. `AdminClient.tsx` строка ~165: `data as unknown` TS warning
2. `CampaignList.tsx` строка 6: отсутствует экспорт `getDonations` из api-campaign-store
3. Пароль админа хранится в plaintext в route handler (bcrypt pending)

## 🚀 Команды
```bash
vinext dev          # dev сервер на localhost:3000
vinext build        # сборка
vinext start        # продакшн сервер
npx tsc --noEmit    # проверка TypeScript
```

## 💡 Важные решения
- **Schema Naming:** snake_case в БД → camelCase в API ответах (`help_steps` → `helpSteps`)
- **Error Format:** единый формат `{ error: string }` для всех API ответов
- **Validation:** Zod схемы на сервере, клиент отправляет camelCase
- **Phone format:** +7 с удалением нецифровых символов, макс 16 символов

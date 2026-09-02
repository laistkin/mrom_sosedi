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
- Instance-checked сообщения об ошибках (`err instanceof Error ? err.message : "Internal server error"`)

#### Task 7.9 — Привязка пожертвований к пользователям + глобальные метрики
- Миграция `003_add_user_phone.sql`: добавлено поле `user_phone` в donations с индексом
- API `/api/donations/[phone]`: GET — история пожертвований пользователя по телефону
- API `/api/metrics`: GET — глобальные метрики (totalDonations, totalAmount, activeCampaigns)
- DonationForm собирает телефон пользователя (+7 формат)
- AccountClient загружает историю из БД через API вместо localStorage

### Следующий шаг при возвращении:
1. Прочитать `.pi/CONTEXT.md` — полный контекст проекта
2. Решить приоритет: Деплой (7.11) или P1 задачи (SMS 7.6, File Upload 7.7)
3. `vinext dev` для проверки что всё работает

---

## 📍 Где остановились
Этап 7: Миграция фронтенда на Neon PostgreSQL + API маршруты.

**Последнее действие:** Завершены Task 7.8 (Zod валидация) и Task 7.9 (привязка пожертвований к пользователям). Ожидание решения по приоритету: Deployment (7.11) vs P1 задачи (SMS, File Upload).

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
10. Сборка прошла успешно — все 15 маршрутов определены

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
- [x] Исправлен BUG-7: PostgreSQL JSONB поля возвращаются как строки → добавлен `safeParse()` в `api-site-content.ts` для автоматического парсинга всех JSONB полей
- [x] Все страницы работают корректно: `/`, `/about`, `/reports`, `/gallery`, `/team`, `/campaigns/[id]`
- [x] POST `/api/donations` создаёт запись в БД, GET `/api/donations` верифицирует

### Фаза 4.1: JWT-сессии для админа — ✅ ЗАВЕРШЕНО
- [x] Создан `app/lib/auth/jwt.ts`: `signToken()`, `verifyToken()`, `setCookie()`, `clearCookie()` (jose библиотека)
- [x] Обновлён `/api/admin-auth/route.ts`: POST → JWT cookie, GET → проверка сессии, DELETE → logout
- [x] Создан `app/lib/auth/session.ts`: `getAdminSession()`, `requireAdmin()` для middleware-защиты API
- [x] AdminClient.tsx: login/logout через HTTP-only cookie, убран localStorage флаг
- [x] Кнопка «Выйти» добавлена в хедер админки
- [x] Тестирование: POST логин ✅, GET с кукой ✅, DELETE logout ✅, wrong password 401 ✅

### Осталось по Этапу 7
- [x] **7.8** Zod валидация + rate limiting + security utils — ✅ ЗАВЕРШЕНО
- [ ] **7.9** Привязка пожертвований к пользователям — ✅ ЗАВЕРШЕНО
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

### Task 7.8: Zod валидация и обработка ошибок
- [x] Обновлён `app/lib/validators.ts`: добавлены явные схемы для всех секций site-content (hero, about, helpStep, faq, galleryImage, teamMember, reportPost)
- [x] Добавлены URL/query параметр схемы: `idParamSchema`, `campaignQuerySchema`, `donationQuerySchema`
- [x] Добавлен `donationSchema` с полями campaignId, amount (min 10), donorName, anonymous, method
- [x] Security utils: `stripHtml()`, `sanitizeString()` для XSS защиты
- [x] Rate limiter на `/api/admin-auth`: 10 попыток / 5 минут по IP
- [x] Обновлены все route handlers с единым форматом ошибок и instance-checked сообщениями
- [x] Исправлен `formatZodError` для Zod v3+ (`error.issues` вместо deprecated `.errors`)

### Task 7.9: Привязка пожертвований к пользователям + глобальные метрики
- [x] Миграция `migrations/003_add_user_phone.sql`: добавлено поле `user_phone` в donations с индексом
- [x] API `/api/donations/[phone]`: GET — история пожертвований пользователя по телефону
- [x] API `/api/metrics`: GET — глобальные метрики (totalDonations, totalAmount, activeCampaigns)
- [x] Обновлён `app/api/donations/route.ts`: POST принимает userPhone
- [x] Обновлён `app/lib/validators.ts`: donationSchema включает userPhone
- [x] Обновлён `app/components/DonationForm.tsx`: добавлено поле телефона (+7 формат)
- [x] Обновлён `app/account/AccountClient.tsx`: история загружается из БД через API по телефону
- [x] Обновлён `app/lib/donations/api-donations.ts`: createDonation принимает userPhone

## 🔑 Ключевые файлы
| Файл | Роль |
|------|------|
| `app/lib/db.ts` | Клиент PostgreSQL |
| `app/api/campaigns/route.ts` | GET /api/campaigns, POST /api/campaigns |
| `app/api/campaigns/[id]/route.ts` | GET/PUT/DELETE /api/campaigns/:id |
| `app/api/donations/route.ts` | GET /api/donations, POST /api/donations |
| `app/api/site-content/route.ts` | GET /api/site-content, POST /api/site-content |
| `app/api/admin-auth/route.ts` | POST/GET/DELETE /api/admin-auth (JWT login/check/logout) |
| `app/lib/auth/jwt.ts` | JWT sign/verify + httpOnly cookie helpers |
| `app/lib/auth/session.ts` | Server-side session extraction & `requireAdmin()` guard |
| `app/lib/campaigns/api-campaign-store.ts` | Клиентский API store для кампаний |
| `app/lib/donations/api-donations.ts` | Клиентский API store для донатов |
| `app/lib/site-content/api-site-content.ts` | Клиентский API store для контента |
| `app/admin/AdminClient.tsx` | Админ-панель (~1300 строк, мигрирована) |

## ⚠️ Известные ограничения
- Пароль админа `sosedi2026` на сервере (demo mode, Phase 7.2+ → bcrypt + DB)
- YooKassa требует HTTPS для заявки
- Fallback на localStorage/demo-store при недоступности БД (client components)

## 🚀 Команды
```bash
vinext dev          # dev сервер
vinext build        # сборка
vinext start        # продакшн сервер
npx neon@latest auth  # авторизация Neon CLI
```

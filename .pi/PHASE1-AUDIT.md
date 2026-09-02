# Фаза 1: Аудит миграции localStorage → Neon PostgreSQL + API

**Дата:** 2025-07-14  
**Статус:** Завершена ✅

---

## Сводка

| Категория | Статус | Детали |
|-----------|--------|--------|
| Сборка (build) | ✅ PASS | `vinext build` проходит без ошибок |
| Бэкенд API routes | ✅ WORKING | `/api/campaigns`, `/api/donations`, `/api/site-content`, `/api/admin-auth` — все 4 роута работают |
| Клиентские stores (campaigns, donations) | ✅ MIGRATED | `api-campaign-store.ts`, `api-donations.ts` — читают/пишут в Neon через API |
| AdminClient: кампании и пожертвования | ✅ MIGRATED | CRUD операций для кампаний и донатов идёт через API |
| AdminClient: site-content (запись) | ⚠️ PARTIAL | `apiSaveSiteContent` вызывается, но импортируется из demo-store; есть отдельный `api-site-content.ts` с `getSiteContent()`/`updateSiteContent()`, который не используется |
| Публичные страницы: hero/campaigns | ❌ BROKEN | Homepage читает hero из localStorage/demo, кампании — статический массив |
| Страница кампании `/campaigns/[id]` | ⚠️ PARTIAL | SSR использует демо-данные для metadata; клиентский компонент CampaignDetail уже fetch'ит через API ✅ |
| Отчёты `/reports` | ❌ BROKEN | ReportsClient игнорирует props и перезаписывает данные из demo-store в useEffect |
| О нас `/about` | ❌ BROKEN | AboutClient игнорирует props и перезаписывает данные из demo-store в useEffect |
| Галерея `/gallery` | ❌ BROKEN | GalleryClient напрямую читает `readSiteContent()` из demo-store, нет API fetch |
| Команда `/team` | ❌ BROKEN | TeamClient напрямую читает `readSiteContent()` из demo-store, нет API fetch |

---

## Детальный аудит по файлам

### 1. ✅ CampaignDetail.tsx — ИСПРАВЛЕНО
**Проблема:** Использовал `useEffect` без импорта из React  
**Решение:** Добавлен `useEffect` в import строки 4  
**Статус:** Исправлено, сборка прошла

### 2. ❌ app/page.tsx (Homepage) — ТРЕБУЕТ ИСПРАВЛЕНИЯ
```typescript
// Строка 5-6: импорты из демо
import { campaigns } from './data/campaigns';
import { readSiteContent } from './lib/site-content/demo-site-content';

// Строка 10: чтение из localStorage
const siteContent = readSiteContent();

// Строка 43: статический массив кампаний
<CampaignList initialCampaigns={campaigns} />
```
**Нужно:** Заменить на `getSiteContent()` из `api-site-content.ts` и `getCampaigns()` из `api-campaign-store.ts`. Поскольку это Server Component, можно fetch'ить данные при рендере.

### 3. ⚠️ app/campaigns/[id]/page.tsx — ЧАСТИЧНО МИГРИРОВАНО
```typescript
// Строка 5: демо-импорт
import { campaigns, getCampaignById } from '../../data/campaigns';
```
**Проблема:** `getCampaignById` берёт из localStorage/demo для SSR metadata и generateStaticParams.  
**Хорошо:** Клиентский компонент CampaignDetail уже fetch'ит через API в useEffect (строка 25).  
**Нужно:** Заменить импорт на `getCampaignById` из `api-campaign-store.ts`.

### 4. ❌ reports/page.tsx + ReportsClient.tsx — ТРЕБУЕТ ИСПРАВЛЕНИЯ
```typescript
// page.tsx: передаёт демо-данные как props
<ReportsClient initialReports={defaultSiteContent.reports} />

// ReportsClient.tsx строка 13-15: игнорирует props, перезаписывает из demo
useEffect(() => {
    setReports(readSiteContent().reports);
}, []);
```
**Нужно:** Убрать `readSiteContent()` из useEffect, заменить на fetch к `/api/site-content`.

### 5. ❌ about/page.tsx + AboutClient.tsx — ТРЕБУЕТ ИСПРАВЛЕНИЯ
Аналогичная проблема: props игнорируются, данные перезаписываются из demo-store в useEffect.

### 6. ❌ gallery/GalleryClient.tsx — ТРЕБУЕТ ИСПРАВЛЕНИЯ
```typescript
// Строка 4: прямой импорт демо-функции
import { readSiteContent } from '../lib/site-content/demo-site-content';

// Строка 7: чтение из localStorage при каждом рендере
const gallery = readSiteContent().gallery;
```
**Нужно:** Добавить useEffect с fetch к `/api/site-content` или сделать Server Component.

### 7. ❌ team/TeamClient.tsx — ТРЕБУЕТ ИСПРАВЛЕНИЯ
Аналогично GalleryClient: прямой импорт и чтение из demo-store без API.

### 8. ⚠️ AdminClient.tsx — ЧАСТИЧНО МИГРИРОВАНО
```typescript
// Строка 10-12: импорты из демо (типы + defaultSiteContent)
import {
  defaultSiteContent,
  readSiteContent,
  resetSiteContent,
  saveSiteContent as apiSaveSiteContent, // ⚠️ это НЕ API версия!
} from '../lib/site-content/demo-site-content';
```
**Хорошо:** CRUD кампаний и донатов работает через API stores.  
**Проблема:** `apiSaveSiteContent` — это алиас на демо-функцию (localStorage + fetch). Есть отдельный `api-site-content.ts` с `getSiteContent()`/`updateSiteContent()`, который не используется.  
**Нужно:** 
1. Импортировать `getSiteContent` и `updateSiteContent` из `api-site-content.ts`
2. Заменить начальное состояние siteContent на fetch из API вместо `defaultSiteContent`
3. Убрать зависимость от `readSiteContent()` и `resetSiteContent()`

---

## План исправлений (Фаза 2)

### Приоритет P0 — Критические (публичные страницы не работают)
1. **Homepage** (`app/page.tsx`) — заменить demo-импорты на API fetch
2. **ReportsClient** — убрать `readSiteContent()` из useEffect, добавить API fetch
3. **AboutClient** — убрать `readSiteContent()` из useEffect, добавить API fetch  
4. **GalleryClient** — добавить useEffect с API fetch для gallery данных
5. **TeamClient** — добавить useEffect с API fetch для team данных

### Приоритет P1 — Важные (частичная миграция)
6. **Campaigns page** (`app/campaigns/[id]/page.tsx`) — заменить демо-импорт на API store
7. **AdminClient** — переключить site-content CRUD на `api-site-content.ts`

### Приоритет P2 — Тестирование
8. Запустить `vinext dev`, проверить все страницы против Neon DB
9. Протестировать админ-панель: создание/редактирование кампаний, site content
10. Проверить donation flow через API

---

## Технические детали

### Доступные API stores (готовые к использованию)
| Store | Файл | Экспорты | Статус |
|-------|------|----------|--------|
| Campaigns | `app/lib/campaigns/api-campaign-store.ts` | `getCampaigns`, `getCampaignById`, `saveCampaign`, `deleteCampaign` | ✅ Готов |
| Donations | `app/lib/donations/api-donations.ts` | `getDonations`, `submitDonation` | ✅ Готов |
| Site Content | `app/lib/site-content/api-site-content.ts` | `getSiteContent`, `updateSiteContent` | ✅ Готов (не используется!) |

### API Routes (бэкенд)
| Route | Методы | Статус |
|-------|--------|--------|
| `/api/campaigns` | GET, POST | ✅ |
| `/api/campaigns/:id` | GET, PUT, DELETE | ✅ |
| `/api/donations` | GET, POST | ✅ |
| `/api/site-content` | GET, POST | ✅ |
| `/api/admin-auth` | POST | ✅ (placeholder) |

### База данных Neon
- Project: `wild-brook-98327580`
- Таблицы: `campaigns`, `donations`, `site_content`, `admin_users`
- Данные засемлены через `migrations/002_seed_data.sql`

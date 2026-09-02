# MROM Sosedi — Project Memory

## Цель проекта
Прототип сайта пожертвований для местного исламского центра «МРОМ Соседи». Кликабельный демо-прототип с localStorage, без реального бэкенда.

## Стек и инструменты
| Компонент | Значение |
|-----------|----------|
| Фреймворк | Vinext (Next-style App Router) |
| React | 19 |
| Стилизация | Tailwind CSS 4 + app/globals.css |
| Пакетный менеджер | npm |
| Сборка/Dev | Vite 8 + vinext |
| Деплой-таргет | Cloudflare (Wrangler) |
| Язык интерфейса | Русский |

## Структура проекта
```
app/
├── layout.tsx                    # Root layout, metadata, Geist шрифты
├── page.tsx                      # Главная страница
├── globals.css                   # Глобальные стили (Tailwind + CSS vars)
│
├── components/
│   ├── SiteHeader.tsx            # Шапка с навигацией
│   ├── CampaignList.tsx          # Клиентская лента кампаний (автопересчёт collected)
│   ├── CampaignDetail.tsx        # Детали кампании (автопересчёт collected)
│   ├── DonationForm.tsx          # Форма пожертвования (демо, валидация 10₽ мин.)
│   ├── ShareButton.tsx           # Кнопка «Поделиться»
│   ├── Toast.tsx                 # Toast-уведомления (success/error/info)
│   └── ConfirmModal.tsx          # Модальное окно подтверждения действий
│
├── data/
│   └── campaigns.ts              # Базовые данные кампаний + Campaign type
│
├── lib/
│   ├── campaigns/demo-campaign-store.ts  # localStorage CRUD для кампаний (fallback)
│   ├── donations/demo-donations.ts       # localStorage для истории пожертвований (fallback)
│   ├── payments/yookassa-demo.ts         # Демо-адаптер YooKassa (заглушка)
│   ├── site-content/demo-site-content.ts # localStorage для About/Reports (fallback)
│   ├── campaigns/api-campaign-store.ts   # API CRUD для кампаний → Neon
│   ├── donations/api-donations.ts        # API пожертвований → Neon
│   └── site-content/api-site-content.ts  # API контент сайта → Neon
│
├── api/
│   ├── campaigns/route.ts          # GET/POST /api/campaigns
│   ├── campaigns/[id]/route.ts     # GET/PUT/DELETE /api/campaigns/:id
│   ├── donations/route.ts          # GET/POST /api/donations
│   ├── site-content/route.ts       # GET/POST /api/site-content
│   └── admin-auth/route.ts         # POST /api/admin-auth (логин)
│
├── campaigns/[id]/page.tsx       # Динамический маршрут деталей кампании
├── account/page.tsx + AccountClient.tsx  # Личный кабинет донора
├── admin/page.tsx + AdminClient.tsx      # Админ-панель
├── about/page.tsx + AboutClient.tsx      # О нас
├── reports/page.tsx + ReportsClient.tsx  # Публичные отчёты
├── gallery/page.tsx + GalleryClient.tsx  # Галерея
└── team/page.tsx + TeamClient.tsx        # Команда

public/logo-placeholder.svg       # Временный логотип
```

## Маршруты
| Маршрут | Описание |
|---------|----------|
| `/` | Главная: хедер, герой-секция, лента кампаний, навигационные карточки |
| `/campaigns/[id]` | Детали кампании + форма пожертвования |
| `/account` | Личный кабинет донора (SMS-логин демо) |
| `/admin` | Админ-панель (пароль: `sosedi2026`) |
| `/about` | Информация об организации, контакты, реквизиты |
| `/reports` | Публичные отчёты с фото/документами |

## localStorage ключи (fallback, данные из БД имеют приоритет)
| Ключ | Содержимое | Статус |
|------|-----------|--------|
| `mrom_sosedi_demo_campaigns` | Изменённые/созданные кампании из админки | ⚠️ Fallback (основное → Neon) |
| `mrom_sosedi_demo_donations` | История демо-пожертвований | ⚠️ Fallback (основное → Neon) |
| `mrom_sosedi_demo_user` | Профиль донора | ✅ Только демо |
| `mrom_sosedi_admin_session` | Состояние входа в админку | ✅ Заменён на JWT cookie (`mrom_admin_session`) через httpOnly |
| `mrom_sosedi_demo_site_content` | Редактируемый контент About + Reports | ⚠️ Fallback (основное → Neon) |

## Демо-данные
- **3 кампании**: Коран (180K₽), Джума помещение (320K₽), Лекции оборудование (95K₽)
- **Донорский аккаунт SMS код**: `1234`
- **Админ пароль**: `sosedi2026`

## Дизайн-направление
- Чёрно-белый современный стиль, mobile-first
- Зелёный акцент: основной ~`#2f9f6b`, фон ~`#eef6f2`, текст ~`#356f59` / `#2f7d5f`
- Шрифты: Geist Sans + Geist Mono (Google Fonts)
- Логотип — временный SVG placeholder

## Архитектурные заметки
### Текущая архитектура (Stage 7 завершён до Task 7.9)
- **Все основные данные** хранятся в **Neon PostgreSQL**, localStorage только как fallback
- Кампании создаются/редактируются через админку → сохраняются в Neon через API → видны на публичных страницах
- Форма пожертвования отправляет POST `/api/donations` → запись в Neon
- Админ-панель: HTTP-only JWT cookie (`mrom_admin_session`, 24ч), POST `/api/admin-auth` с паролем → токен, GET проверяет, DELETE выходит. Пароль `sosedi2026` только на сервере (demo mode).
- Публичные суммы на страницах кампаний автоматически пересчитываются из истории пожертвований (`donationsByCampaign` в CampaignList и CampaignDetail)
- Форма пожертвования: минимум 10₽, чекбокс согласия обязателен, имена без ограничений
- Форма собирает телефон пользователя для привязки к истории пожертвований
- Toast-уведомления используются во всей админке вместо `setNotice`
- Удаление кампаний через ConfirmModal с подтверждением
- Zod валидация на сервере для всех API endpoints (7.8)
- Rate limiting: 10 попыток / 5 мин на `/api/admin-auth` по IP
- Security utils: `stripHtml()`, `sanitizeString()` для XSS защиты
### Fallback поведение
- Если Neon недоступен → данные берутся из localStorage/demo stores
- API stores (`api-campaign-store.ts`, `api-donations.ts`) имеют try/catch и возвращают демо-данные при ошибке

## Известные проблемы
1. `next/link` внутри client-heavy компонентов может вызывать шумные предупреждения Vite/HMR после хот-редоуа. Решение: перезапуск dev сервера.
2. Dev сервер **обязательно** запускать с `--hostname 127.0.0.1`, иначе биндится на IPv6 и недоступен локально.
3. `npm install` показывает audit warnings (не исправлены в прототипе).
4. Автопересчёт работает только для демо-пожертвований; при ручном редактировании `collected` в админке значения могут расходиться.

## Текущий статус (последнее обновление: Task 7.9 завершён)
- Прототип полностью рабочий, сборка проходит без ошибок (`vinext build`)
- Все этапы 1–6 и 1.5 завершены
- Этап 7 завершён до Task 7.9:
  - ✅ 7.1 — Миграция localStorage → Neon PostgreSQL (все фазы)
  - ✅ 7.2 — JWT сессии для админа
  - ✅ 7.8 — Zod валидация, rate limiting, security utils
  - ✅ 7.9 — Привязка пожертвований к пользователям + глобальные метрики
- ⚠️ P1 задачи: SMS (7.6), File Upload (7.7)
- 🔒 БЛОКИРУЕТСЯ: YooKassa (7.3–7.5) требует HTTPS → нужен деплой (7.11)

## План продолжения (после завершения Task 7.9)
### Приоритет: Деплой (7.11) — блокирует платежи
- Купить VPS хостинг (Timeweb/Beget, от 299 ₽/мес) или использовать Vercel
- Настроить HTTPS (Let's Encrypt / Cloudflare)
- Задеплоить Next.js приложение на публичный сервер
- Подать заявку в YooKassa с URL сайта + реквизитами НКО
### Альтернатива: P1 задачи без HTTPS
- 7.6 — Реальный SMS-провайдер для входа по телефону
- 7.7 — Загрузка файлов (фото/документы) вместо URL-only полей

### День 2–6: Бэкенд параллельно (локально)
- Neon PostgreSQL (бесплатно) — схема, миграции, подключение
- API routes для CRUD кампаний и пожертвований
- ✅ Серверная аутентификация админа (JWT сессия) — Phase 4.1 DONE
- SMS-вход через SMS.ru (~2000–3000 ₽ баланс)

### День 7+: После одобрения YooKassa
- Интеграция платежей и вебхуков
- Idempotency ключи
- Загрузка файлов, серверная валидация Zod
- Финальное тестирование + обновление на продакшене

## Реквизиты организации для YooKassa
| Поле | Значение |
|------|----------|
| Название | Местная религиозная организация мусульман "Культурный центр "Соседи" |
| ИНН | 7751241690 |
| КПП | 775101001 |
| ОГРН | 1227700865314 |
| Дата образования | 14.12.2022 |
| Юр. адрес | 108850, г. Москва, ул. Лётчика Ульянина, д. 3А, помещ. 3 |

## Выбранные технологии для Этапа 7
- **База данных:** Neon PostgreSQL (бесплатный тариф, 0.5 ГБ)
- **Хостинг:** Timeweb VPS или Beget (Node.js + PostgreSQL)
- **SMS-провайдер:** SMS.ru (~2000–3000 ₽ на баланс)
- **Бюджет:** до 10 000 ₽

## Порядок действий для YooKassa
⚠️ Важно: YooKassa требует сначала выложить сайт в публичный доступ, только потом рассматривает заявку.
1. Деплой сайта → HTTPS URL
2. Регистрация на yookassa.ru → «Подключить магазин» → НКО
3. Заполнить реквизиты (см. таблицу выше)
4. Загрузить документы: устав, ИНН, ОГРН, банковские реквизиты
5. Ждать модерацию 1–3 рабочих дня

## Риски по срокам
- YooKassa модерация может задержаться — параллельно делать бэкенд локально
- Если YooKassa не пройдёт за неделю: запустить сайт без оплаты, форма заявки → ручная обработка переводов
- Вебхуки требуют HTTPS → нужен публичный сервер (не localhost)

## Что делаем при возвращении
1. Прочитать `.pi/CONTEXT.md` — полный контекст проекта и текущий статус
2. Проверить `vinext dev` — сервер должен стартовать на localhost:3000
3. Решить приоритет: Деплой (7.11) или P1 задачи (SMS 7.6, File Upload 7.7)
4. Если деплой: настроить VPS/HTTPS → подать заявку в YooKassa
5. Если P1: реализовать SMS-провайдер или загрузку файлов
6. После HTTPS: интегрировать YooKassa платежи (7.3–7.5)

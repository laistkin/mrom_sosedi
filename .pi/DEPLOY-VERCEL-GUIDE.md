# 🚀 Деплой MROM Sosedi на Vercel — Пошаговое руководство

## Предварительная проверка ✅
- [x] `vinext build` проходит без ошибок
- [x] Все 15 маршрутов определены (9 страниц + 6 API routes)
- [x] `.env.local` в `.gitignore` — секреты не уйдут в git

---

## ШАГ 1: Подготовка репозитория на GitHub

### 1.1 Создать репозиторий
1. Перейти на https://github.com/new
2. Название: `mrom-sosedi` (или любое другое)
3. **Private** или **Public** — на выбор (для теста можно public)
4. Не инициализировать README/.gitignore — репозиторий уже есть локально
5. Нажать "Create repository"

### 1.2 Подключить локальный репозиторий
```bash
cd C:\Users\PC\Documents\MROM_Sosedi
git remote add origin https://github.com/ВАШ_НИК/mrom-sosedi.git
git branch -M main
git push -u origin main
```

### 1.3 Проверить что всё на месте
На GitHub должны быть файлы:
- `app/` — все страницы и компоненты
- `api/` — API routes (campaigns, donations, site-content, admin-auth)
- `lib/` — db.ts, validators, auth/, stores
- `migrations/` — SQL миграции
- `package.json`, `vercel.json`, `.gitignore`

---

## ШАГ 2: Регистрация на Vercel

### 2.1 Создать аккаунт
1. Перейти на https://vercel.com/signup
2. Войти через **GitHub** (рекомендуется — авто-деплой из репозитория)
3. Выбрать бесплатный план (**Hobby**)

### 2.2 Импортировать проект
1. В панели Vercel нажать **"Add New..." → "Project"**
2. Найти `mrom-sosedi` в списке репозиториев GitHub
3. Нажать **"Import"**

---

## ШАГ 3: Настройка проекта в Vercel

### 3.1 Основные настройки (на экране импорта)
| Поле | Значение |
|------|----------|
| Framework Preset | **Other** (Vinext не в списке, но Next.js совместим) |
| Root Directory | `./` (корень репозитория) |
| Build Command | `npm run build` |
| Output Directory | `.vinext` |
| Development Command | `npm run dev -- --hostname 127.0.0.1` |

### 3.2 Environment Variables (ОБЯЗАТЕЛЬНО!)
На вкладке **"Environment Variables"** добавить:

| Ключ | Значение | Environment |
|------|----------|-------------|
| `DATABASE_URL` | Из `.env.local` (полный URL) | Production + Preview + Development |
| `JWT_SECRET` | `sk_mrom_sosedi_admin_2025_secure_jwt_signing_key_do_not_share` | Production + Preview + Development |
| `NEON_BRANCH` | `production` | Production + Preview + Development |

> ⚠️ **НЕ КОПИРУЙТЕ** `.env.local` целиком! Только нужные переменные.
> Vercel UI: Project Settings → Environment Variables

### 3.3 Деплой
1. Нажать **"Deploy"**
2. Ждать 2-5 минут (первый билд)
3. После успеха — ссылка на сайт появится

---

## ШАГ 4: Проверка работающего сайта

После деплоя Vercel даст URL вида:
```
https://mrom-sosedi.vercel.app
```

### Чек-лист проверки:
| Страница | Что проверить |
|----------|---------------|
| `/` | Главная — кампании загружаются из Neon |
| `/campaigns/1` | Детали кампании + форма пожертвования |
| `/about` | О нас — контент из БД |
| `/reports` | Отчёты — контент из БД |
| `/gallery` | Галерея — фото из БД |
| `/team` | Команда — члены команды из БД |
| `/account` | Личный кабинет (SMS код: 1234) |
| `/admin` | Админ-панель (пароль: sosedi2026) |

### Тестирование API:
```bash
# Проверить кампании
curl https://ВАШ_ДОМЕН.vercel.app/api/campaigns

# Проверить метрики
curl https://ВАШ_ДОМЕН.vercel.app/api/metrics
```

---

## ШАГ 5: Получение HTTPS для YooKassa

После успешного деплоя:
1. Домен `*.vercel.app` уже имеет **бесплатный SSL/HTTPS** сертификат
2. Скопировать URL (например: `https://mrom-sosedi.vercel.app`)
3. Подать заявку в YooKassa с этим URL

---

## ⚠️ Возможные проблемы и решения

### Проблема 1: Build fails — "Cannot find module"
**Решение:** Проверить что все зависимости в `package.json`:
```bash
npm install
vinext build  # локальная проверка
git add . && git commit -m "fix: dependencies" && git push
```

### Проблема 2: API routes возвращают 404
**Решение:** Убедиться что `vercel.json` существует и содержит правильные настройки. Проверить что API файлы в `app/api/`.

### Проблема 3: Neon connection error
**Решение:** 
- Проверить IP allow list в Neon dashboard (для Vercel нужно добавить все IP)
- Или использовать пуллер-подключение (уже настроено в DATABASE_URL)
- Убедиться что `DATABASE_URL` правильно установлен в Vercel env vars

### Проблема 4: CORS или headers ошибки
**Решение:** Vinext/Next.js обычно обрабатывает это автоматически. Если нет — добавить middleware.

---

## 📊 Бесплатный тариф Vercel (Hobby)

| Лимит | Значение |
|-------|----------|
| Serverless Functions | 100 GB execution hours/мес |
| Bandwidth | 100 GB/мес |
| Projects | Неограничено |
| Custom Domains | До 500 |
| Auto HTTPS | ✅ Включён |
| Preview Deployments | ✅ Каждый PR |

Для демо-сайта руководства — **более чем достаточно**.

---

## 🔄 Workflow после деплоя

### Production (main branch)
```bash
git add . && git commit -m "description" && git push origin main
# → Vercel автоматически деплоит на prod URL
```

### Preview (любая ветка)
```bash
git checkout -b feature-name
# ... изменения ...
git add . && git commit -m "feature" && git push origin feature-name
# → Vercel создаёт preview URL: https://mrom-sosedi-git-feature-name.vercel.app
```

---

## 📝 Чек-лист перед показом руководству

- [ ] Сайт открывается по HTTPS
- [ ] Кампании загружаются с Neon (не демо)
- [ ] Форма пожертвования создаёт запись в БД
- [ ] Админ-панель работает (логин, CRUD кампаний)
- [ ] Личный кабинет донора работает
- [ ] Страницы about/reports/gallery/team показывают контент из БД
- [ ] Метрики на `/api/metrics` возвращают данные

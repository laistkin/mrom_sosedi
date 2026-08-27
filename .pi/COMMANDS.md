# MROM Sosedi — Команды проекта

## Установка и запуск
```bash
npm install              # Установить зависимости (игнорировать audit warnings)
npm run dev -- --hostname 127.0.0.1   # Dev сервер → http://127.0.0.1:3000/
npm run build            # Сборка продакшн-версии
npm start                # Запуск собранного приложения
```

## Лinting
```bash
npm run lint             # ESLint проверка (исключая dist и .next)
```

## Важные замечания по командам
- **Всегда** используйте `--hostname 127.0.0.1` для dev сервера — без этого биндится на IPv6
- Если после хот-редоуа появляются шумные предупреждения React/Vite — перезапустите dev сервер
- Audit warnings от npm можно игнорировать (прототип)

## Демо-доступы
```
Админ-панель:     /admin        пароль: sosedi2026
Личный кабинет:   /account      SMS код: 1234
```

## Очистка демо-данных
Открыть консоль браузера и выполнить:
```javascript
localStorage.removeItem('mrom_sosedi_demo_campaigns');
localStorage.removeItem('mrom_sosedi_demo_donations');
localStorage.removeItem('mrom_sosedi_demo_user');
localStorage.removeItem('mrom_sosedi_admin_session');
localStorage.removeItem('mrom_sosedi_demo_site_content');
```

## Структура файлов (быстрый справочник)
| Путь | Назначение |
|------|-----------|
| `app/page.tsx` | Главная страница |
| `app/layout.tsx` | Root layout + metadata |
| `app/globals.css` | Глобальные стили Tailwind |
| `app/data/campaigns.ts` | Базовые данные кампаний |
| `app/components/SiteHeader.tsx` | Шапка с навигацией |
| `app/components/CampaignList.tsx` | Клиентская лента |
| `app/components/CampaignDetail.tsx` | Детали кампании |
| `app/components/DonationForm.tsx` | Форма пожертвования |
| `app/lib/payments/yookassa-demo.ts` | Демо YooKassa (заменить!) |
| `app/lib/campaigns/demo-campaign-store.ts` | localStorage кампаний |
| `app/lib/donations/demo-donations.ts` | localStorage пожертвований |
| `app/lib/site-content/demo-site-content.ts` | localStorage About/Reports |

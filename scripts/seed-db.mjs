import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf-8");
const urlMatch = env.match(/DATABASE_URL_UNPOOLED="([^"]+)"/);
if (!urlMatch) throw new Error("No DATABASE_URL_UNPOOLED found");

const sql = neon(urlMatch[1]);

// Seed campaigns from the project's data file
const campaignsData = [
  {
    id: "quran-classes",
    title: "Поддержать обучение Корану для детей и взрослых",
    category: "Образование",
    location: "МРОМ Соседи",
    status: "active",
    needed: 180000,
    collected: 64200,
    donors: 38,
    comments: 6,
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Сбор поможет подготовить учебные материалы, оплатить организационные расходы и сделать занятия стабильными для прихожан разного возраста.",
    description: [
      "В нашем центре проходят занятия по чтению Корана, основам вероучения и религиозной грамотности. Мы хотим сделать обучение регулярным, спокойным и доступным для детей, подростков и взрослых прихожан.",
      "Средства пойдут на учебные материалы, подготовку пространства, печатные пособия и базовые организационные расходы. После завершения этапа мы добавим отчет с фотографиями и документами.",
    ],
    documents: ["Смета учебных материалов", "План занятий на первый период"],
    reports: [
      { title: "Закуплены первые учебные пособия", date: "12 августа 2026", amount: 18500 },
    ],
  },
  {
    id: "juma-space",
    title: "Обновить помещение для джума и религиозных лекций",
    category: "Центр",
    location: "Местная община",
    status: "active",
    needed: 320000,
    collected: 118500,
    donors: 74,
    comments: 11,
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Нужно привести помещение в порядок, чтобы прихожанам было удобно собираться на джума, уроки и лекции.",
    description: [
      "Помещение центра используется для джума, встреч общины, уроков и образовательных лекций. Сейчас важно обновить базовые элементы пространства, чтобы оно оставалось аккуратным, безопасным и удобным.",
      "Сбор включает расходы на ремонтные материалы, освещение, ковровое покрытие, хранение вещей и небольшие хозяйственные работы. Все траты будут отражены в разделе отчетов.",
    ],
    documents: ["Предварительная смета работ", "Список необходимых материалов"],
    reports: [
      { title: "Оплачена часть материалов для помещения", date: "7 августа 2026", amount: 42000 },
    ],
  },
  {
    id: "lecture-equipment",
    title: "Приобрести оборудование для образовательных лекций",
    category: "Лекции",
    location: "МРОМ Соседи",
    status: "active",
    needed: 95000,
    collected: 27100,
    donors: 21,
    comments: 3,
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Проектор, звук и базовая техника помогут проводить лекции качественно и записывать материалы для тех, кто не смог прийти.",
    description: [
      "Образовательные лекции становятся полезнее, когда материал хорошо слышно и видно. Нам нужно базовое оборудование для очных встреч и будущей записи уроков.",
      "Планируем приобрести проектор, микрофон, стойку, кабели и простое оборудование для записи. После покупки опубликуем фото и документы в отчетах.",
    ],
    documents: ["Подбор оборудования", "Ориентировочная смета"],
    reports: [],
  },
];

// Helper: convert JS array to PostgreSQL array literal
function pgArray(arr) {
  if (!arr || arr.length === 0) return "{}";
  const items = arr.map(item => {
    const escaped = String(item).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `"${escaped}"`;
  });
  return `{${items.join(",")}}`;
}

for (const c of campaignsData) {
  await sql`
    INSERT INTO campaigns (id, title, category, location, status, needed, collected, donors, comments, image, summary, description, documents, reports)
    VALUES (${c.id}, ${c.title}, ${c.category}, ${c.location}, ${c.status}, ${c.needed}, ${c.collected}, ${c.donors}, ${c.comments}, ${c.image}, ${c.summary}, ${pgArray(c.description)}, ${pgArray(c.documents)}, ${JSON.stringify(c.reports)})
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title, category = EXCLUDED.category, location = EXCLUDED.location,
      status = EXCLUDED.status, needed = EXCLUDED.needed, collected = EXCLUDED.collected,
      donors = EXCLUDED.donors, comments = EXCLUDED.comments, image = EXCLUDED.image,
      summary = EXCLUDED.summary, description = EXCLUDED.description, documents = EXCLUDED.documents, reports = EXCLUDED.reports
  `;
  console.log("✅ Seeded campaign:", c.title);
}

// Seed site content with defaults
await sql`UPDATE site_content SET 
  about = '{"title":"О нас","description":"Наш центр объединяет людей для совместного выполнения благих дел.","activities":["Обучение Корану","Религиозные лекции","Джума","Помощь общине"],"legalName":"МРОМ Соседи","inn":"0000000000","ogrn":"0000000000000","phone":"+7 (999) 123-45-67","email":"info@sosedi-center.ru","requisites":"Реквизиты для пожертвований"}',
  hero = '{"subtitle":"Местный исламский центр","title":"Помочь общине выполнять важные дела","description":"Поддержите джума, обучение Корану, образовательные лекции и нужды местного религиозного центра."}'::jsonb,
  help_steps = '[{"step":1,"title":"Выберите сбор","description":"Найдите нужный проект среди активных кампаний","icon":"hand-heart"},{"step":2,"title":"Укажите сумму","description":"Минимальная сумма пожертвования — 10 рублей","icon":"ruble-sign"},{"step":3,"title":"Оплатите","description":"Выберите карту или СБП","icon":"credit-card"}]'::jsonb,
  faq = '[{"question":"Как я могу помочь?","answer":"Выберите сбор и сделайте пожертвование через форму на сайте."},{"question":"Куда пойдут мои средства?","answer":"Все средства направляются на конкретные проекты центра. Мы публикуем отчеты после каждой закупки."}]'::jsonb,
  gallery = '[]'::jsonb,
  team = '[]'::jsonb,
  reports = '[]'::jsonb
WHERE id = 'default'`;

console.log("✅ Seeded site content");

// Verify
const count = await sql`SELECT COUNT(*) as count FROM campaigns`;
console.log("\n🎉 Database seeded! Total campaigns:", count[0].count);

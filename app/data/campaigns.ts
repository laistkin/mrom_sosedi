export type Campaign = {
  id: string;
  title: string;
  category: string;
  location: string;
  status?: 'active' | 'completed' | 'hidden';
  needed: number;
  collected: number;
  donors: number;
  comments: number;
  image: string;
  summary: string;
  description: string[];
  documents: string[];
  reports: {
    title: string;
    date: string;
    amount: number;
  }[];
};

export const campaigns: Campaign[] = [
  {
    id: 'quran-classes',
    title: 'Поддержать обучение Корану для детей и взрослых',
    category: 'Образование',
    location: 'МРОМ Соседи',
    status: 'active',
    needed: 180000,
    collected: 64200,
    donors: 38,
    comments: 6,
    image:
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Сбор поможет подготовить учебные материалы, оплатить организационные расходы и сделать занятия стабильными для прихожан разного возраста.',
    description: [
      'В нашем центре проходят занятия по чтению Корана, основам вероучения и религиозной грамотности. Мы хотим сделать обучение регулярным, спокойным и доступным для детей, подростков и взрослых прихожан.',
      'Средства пойдут на учебные материалы, подготовку пространства, печатные пособия и базовые организационные расходы. После завершения этапа мы добавим отчет с фотографиями и документами.',
    ],
    documents: ['Смета учебных материалов', 'План занятий на первый период'],
    reports: [
      {
        title: 'Закуплены первые учебные пособия',
        date: '12 августа 2026',
        amount: 18500,
      },
    ],
  },
  {
    id: 'juma-space',
    title: 'Обновить помещение для джума и религиозных лекций',
    category: 'Центр',
    location: 'Местная община',
    status: 'active',
    needed: 320000,
    collected: 118500,
    donors: 74,
    comments: 11,
    image:
      'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Нужно привести помещение в порядок, чтобы прихожанам было удобно собираться на джума, уроки и лекции.',
    description: [
      'Помещение центра используется для джума, встреч общины, уроков и образовательных лекций. Сейчас важно обновить базовые элементы пространства, чтобы оно оставалось аккуратным, безопасным и удобным.',
      'Сбор включает расходы на ремонтные материалы, освещение, ковровое покрытие, хранение вещей и небольшие хозяйственные работы. Все траты будут отражены в разделе отчетов.',
    ],
    documents: ['Предварительная смета работ', 'Список необходимых материалов'],
    reports: [
      {
        title: 'Оплачена часть материалов для помещения',
        date: '7 августа 2026',
        amount: 42000,
      },
    ],
  },
  {
    id: 'lecture-equipment',
    title: 'Приобрести оборудование для образовательных лекций',
    category: 'Лекции',
    location: 'МРОМ Соседи',
    status: 'active',
    needed: 95000,
    collected: 27100,
    donors: 21,
    comments: 3,
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Проектор, звук и базовая техника помогут проводить лекции качественно и записывать материалы для тех, кто не смог прийти.',
    description: [
      'Образовательные лекции становятся полезнее, когда материал хорошо слышно и видно. Нам нужно базовое оборудование для очных встреч и будущей записи уроков.',
      'Планируем приобрести проектор, микрофон, стойку, кабели и простое оборудование для записи. После покупки опубликуем фото и документы в отчетах.',
    ],
    documents: ['Подбор оборудования', 'Ориентировочная смета'],
    reports: [],
  },
];

export const getCampaignById = (id: string) =>
  campaigns.find((campaign) => campaign.id === id);

export const formatRub = (value: number) =>
  new Intl.NumberFormat('ru-RU').format(value) + ' ₽';

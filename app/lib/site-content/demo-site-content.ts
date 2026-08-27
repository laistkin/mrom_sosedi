export type AboutContent = {
  title: string;
  description: string;
  activities: string[];
  legalName: string;
  inn: string;
  ogrn: string;
  address: string;
  phone: string;
  email: string;
  requisites: string;
};

export type ReportPost = {
  id: string;
  title: string;
  date: string;
  image: string;
  amount: number;
  text: string;
  documents: string[];
};

export type HeroContent = {
  subtitle: string;
  title: string;
  description: string;
};

export type HelpStep = {
  step: number;
  title: string;
  description: string;
  icon: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type GalleryImage = {
  id: string;
  url: string;
  caption: string;
  date: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
};

export type SiteContent = {
  about: AboutContent;
  reports: ReportPost[];
  hero: HeroContent;
  helpSteps: HelpStep[];
  faq: FAQItem[];
  gallery: GalleryImage[];
  team: TeamMember[];
};

export const siteContentStorageKey = 'mrom_sosedi_demo_site_content';

export const defaultHero: HeroContent = {
  subtitle: 'Местный исламский центр',
  title: 'Помочь общине выполнять важные дела',
  description:
    'Поддержите джума, обучение Корану, образовательные лекции и нужды\nместного религиозного центра. Выберите сбор, остальное займет\nменьше минуты.',
};

export const defaultHelpSteps: HelpStep[] = [
  {
    step: 1,
    title: 'Выберите сбор',
    description:
      'Откройте страницу нужной кампании и нажмите «Помочь».',
    icon: '👆',
  },
  {
    step: 2,
    title: 'Укажите сумму',
    description:
      'Введите удобную сумму или выберите из предложенных вариантов. Минимум — 10₽.',
    icon: '💳',
  },
  {
    step: 3,
    title: 'Выберите способ оплаты',
    description:
      'Оплатите банковской картой онлайн или через СБП (Система быстрых платежей).',
    icon: '🏦',
  },
  {
    step: 4,
    title: 'Подтвердите платёж',
    description:
      'Перейдите по ссылке из формы и завершите оплату в безопасном интерфейсе банка.',
    icon: '✅',
  },
];

export const defaultFAQ: FAQItem[] = [
  {
    question: 'Как я могу помочь?',
    answer:
      'Вы можете поддержать любой активный сбор на главной странице. Нажмите «Помочь» на карточке кампании, выберите сумму и оплатите картой или через СБП.',
  },
  {
    question: 'Какова минимальная сумма пожертвования?',
    answer:
      'Минимальная сумма составляет 10 рублей. Вы можете внести любую большую сумму.',
  },
  {
    question: 'Безопасно ли оплачивать онлайн?',
    answer:
      'Да, все платежи обрабатываются через защищённый платёжный шлюз ЮKassa. Мы не храним данные ваших карт.',
  },
  {
    question: 'Могу ли я платить регулярно?',
    answer:
      'В данный момент доступны разовые пожертвования. Регулярные платежи будут добавлены в ближайшее время.',
  },
  {
    question: 'Как я могу узнать, на что пошли мои средства?',
    answer:
      'Мы публикуем отчёты на странице «Отчеты» и в карточках каждой кампании. Там указаны суммы, даты и цели расходов.',
  },
  {
    question: 'Кто стоит за проектом?',
    answer:
      'Проект реализует местная исламская община МРОМ Соседи. Подробнее — на странице «О нас» и в разделе «Команда».',
  },
];

export const defaultGallery: GalleryImage[] = [
  {
    id: 'gallery-1',
    url: 'https://images.unsplash.com/photo-1519817652394-5cab77dc1e93?auto=format&fit=crop&w=800&q=80',
    caption: 'Занятия по чтению Корана для детей',
    date: 'Июнь 2026',
  },
  {
    id: 'gallery-2',
    url: 'https://images.unsplash.com/photo-1584697985853-ef0cc2f12a42?auto=format&fit=crop&w=800&q=80',
    caption: 'Подготовка помещения для джума-молитвы',
    date: 'Июль 2026',
  },
  {
    id: 'gallery-3',
    url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    caption: 'Образовательные лекции для взрослых',
    date: 'Август 2026',
  },
  {
    id: 'gallery-4',
    url: 'https://images.unsplash.com/photo-1585036158179-8bfb79acb6ac?auto=format&fit=crop&w=800&q=80',
    caption: 'Общинные мероприятия и встречи',
    date: 'Август 2026',
  },
];

export const defaultTeam: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Имя Фамилия',
    role: 'Основатель и руководитель',
    bio:
      'Руководит деятельностью центра, организует образовательные программы и общинные мероприятия.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'team-2',
    name: 'Имя Фамилия',
    role: 'Координатор образовательных программ',
    bio:
      'Отвечает за учебные курсы, расписание занятий и взаимодействие с преподавателями.',
    photo: 'https://images.unsplash.com/photo-1500648767077-c13c9a29b9f9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'team-3',
    name: 'Имя Фамилия',
    role: 'Финансовый директор',
    bio:
      'Контролирует бюджет, готовит отчёты и обеспечивает прозрачность расходов.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
];

export const defaultSiteContent: SiteContent = {
  about: {
    title: 'МРОМ Соседи',
    description:
      'Местная религиозная организация мусульман, где прихожане собираются на джума, изучают Коран, посещают образовательные религиозные лекции и поддерживают общинные проекты.',
    activities: [
      'Проведение джума и религиозных встреч',
      'Обучение чтению Корана для детей и взрослых',
      'Образовательные лекции и занятия',
      'Поддержка нужд местной мусульманской общины',
    ],
    legalName: 'Местная религиозная организация мусульман МРОМ Соседи',
    inn: 'будет добавлено',
    ogrn: 'будет добавлено',
    address: 'адрес будет добавлен',
    phone: '+7 (___) ___-__-__',
    email: 'info@example.ru',
    requisites:
      'Реквизиты будут добавлены после проверки юридических данных организации.',
  },
  hero: defaultHero,
  helpSteps: defaultHelpSteps,
  faq: defaultFAQ,
  gallery: defaultGallery,
  team: defaultTeam,
  reports: [
    {
      id: 'first-materials',
      title: 'Закуплены первые учебные материалы',
      date: '12 августа 2026',
      image:
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea?auto=format&fit=crop&w=1200&q=80',
      amount: 18500,
      text:
        'Для занятий по чтению Корана подготовлены первые учебные пособия и расходные материалы. Документы и фото будут прикрепляться по мере наполнения раздела.',
      documents: ['Смета учебных материалов', 'Фотоотчет'],
    },
    {
      id: 'space-materials',
      title: 'Оплачена часть материалов для помещения',
      date: '7 августа 2026',
      image:
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
      amount: 42000,
      text:
        'Часть материалов для обновления пространства центра оплачена из собранных средств. После завершения работ будет опубликован подробный отчет.',
      documents: ['Предварительная смета', 'Список материалов'],
    },
  ],
};

export function readSiteContent(): SiteContent {
  try {
    const stored = window.localStorage.getItem(siteContentStorageKey);
    return stored ? (JSON.parse(stored) as SiteContent) : defaultSiteContent;
  } catch {
    return defaultSiteContent;
  }
}

export function saveSiteContent(content: SiteContent) {
  window.localStorage.setItem(siteContentStorageKey, JSON.stringify(content));
}

export function resetSiteContent() {
  window.localStorage.removeItem(siteContentStorageKey);
}

export function makeReportId(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/ё/g, 'e')
    .replace(/[^a-zа-я0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 42);

  return slug || `report-${Date.now()}`;
}

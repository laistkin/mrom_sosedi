'use client';


import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { formatRub, type Campaign } from '../data/campaigns';
import {
  makeCampaignId,
  getCampaigns,
  saveCampaign as apiSaveCampaign,
  deleteCampaign as apiDeleteCampaign,
} from '../lib/campaigns/api-campaign-store';
import {
  saveSiteContent as apiSaveSiteContent,
  type AboutContent,
  type ReportPost,
  type SiteContent,
  type HeroContent,
  type HelpStep,
  type FAQItem,
  type GalleryImage,
  type TeamMember,
} from '../lib/site-content/demo-site-content';
import { getSiteContent as apiGetSiteContent } from '../lib/site-content/api-site-content';
import { getDonations } from '../lib/donations/api-donations';

const defaultSiteContent: SiteContent = {
  hero: { subtitle: 'МРОМ Соседи', title: 'Помогаем тем, кто рядом', description: '' },
  about: { title: 'О нас', description: '', phone: '', email: '', address: '', legalName: '', inn: '', ogrn: '', activities: [], requisites: '' },
  helpSteps: [{ step: 1, title: '', description: '', icon: '👆' }],
  faq: [{ question: '', answer: '' }],
  gallery: [] as GalleryImage[],
  team: [] as TeamMember[],
  reports: [] as ReportPost[],
};
import { ToastContainer, useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';

type CampaignForm = {
  id: string;
  title: string;
  category: string;
  location: string;
  status: 'active' | 'completed' | 'hidden';
  needed: string;
  collected: string;
  donors: string;
  comments: string;
  image: string;
  summary: string;
  description: string;
  documents: string;
};



function makeReportId(title: string) {
  const slug = title.toLowerCase().replace(/ё/g, 'e').replace(/[^a-zа-я0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 42);
  return slug || `report-${Date.now()}`;
}
const emptyImage =
  'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80';

function toForm(campaign?: Campaign): CampaignForm {
  return {
    id: campaign?.id || '',
    title: campaign?.title || '',
    category: campaign?.category || 'Сбор',
    location: campaign?.location || 'МРОМ Соседи',
    status: campaign?.status || 'active',
    needed: String(campaign?.needed || 0),
    collected: String(campaign?.collected || 0),
    donors: String(campaign?.donors || 0),
    comments: String(campaign?.comments || 0),
    image: campaign?.image || emptyImage,
    summary: campaign?.summary || '',
    description: campaign?.description.join('\n\n') || '',
    documents: campaign?.documents.join('\n') || '',
  };
}

function fromForm(form: CampaignForm, current?: Campaign): Campaign {
  return {
    id: form.id || makeCampaignId(form.title),
    title: form.title.trim(),
    category: form.category.trim() || 'Сбор',
    location: form.location.trim() || 'МРОМ Соседи',
    status: form.status,
    needed: Number(form.needed) || 0,
    collected: Number(form.collected) || 0,
    donors: Number(form.donors) || 0,
    comments: Number(form.comments) || 0,
    image: form.image.trim() || emptyImage,
    summary: form.summary.trim(),
    description: form.description
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean),
    documents: form.documents
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    reports: current?.reports || [],
  };
}

export function AdminClient() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donationsByCampaign, setDonationsByCampaign] = useState<Record<string, number>>({});
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState<CampaignForm>(toForm());
  const [notice, setNotice] = useState('');

  const [reportTitle, setReportTitle] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [reportAmount, setReportAmount] = useState('');
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [aboutForm, setAboutForm] = useState<AboutContent>(
    defaultSiteContent.about,
  );
  const [siteReportForm, setSiteReportForm] = useState<Omit<ReportPost, 'id'>>({
    title: '',
    date: '',
    image: emptyImage,
    amount: 0,
    text: '',
    documents: [],
  });
  const [siteReportDocuments, setSiteReportDocuments] = useState('');

  // Hero section state
  const [heroForm, setHeroForm] = useState<HeroContent>(defaultSiteContent.hero);

  // FAQ state
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  // Gallery state
  const [galleryUrl, setGalleryUrl] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryDate, setGalleryDate] = useState('');

  // Help steps state
  const [helpStepTitle, setHelpStepTitle] = useState('');
  const [helpStepDesc, setHelpStepDesc] = useState('');
  const [helpStepIcon, setHelpStepIcon] = useState('👆');

  // Team state
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [teamBio, setTeamBio] = useState('');
  const [teamPhoto, setTeamPhoto] = useState('');

  const { toasts, success: toastSuccess, error: toastError } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const deleteRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Check JWT cookie for auth status
    fetch('/api/admin-auth')
      .then(r => r.json())
      .then(data => setIsAuthed(!!data.authenticated))
      .catch(() => {});
    (async () => {
      const storedCampaigns = await getCampaigns();
      setCampaigns(storedCampaigns);
      setSelectedId(storedCampaigns[0]?.id || '');
      setForm(toForm(storedCampaigns[0]));
      try {
        const allDonations = await getDonations();
        const map: Record<string, number> = {};
        for (const d of allDonations) {
          if (!map[d.campaignId]) map[d.campaignId] = 0;
          map[d.campaignId] += Number(d.amount);
        }
        setDonationsByCampaign(map);
      } catch {}
      // Load site content from API
      try {
        const data = await apiGetSiteContent();
        if (data) {
          setSiteContent(data as SiteContent);
          setHeroForm((data as any).hero || defaultSiteContent.hero);
          setAboutForm((data as any).about || defaultSiteContent.about);
        }
      } catch {}
    })();
  }, []);

  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === selectedId),
    [campaigns, selectedId],
  );



  const getCollected = useCallback(
    (campaign: Campaign): number => {
      const fromDonations = donationsByCampaign[campaign.id] || 0;
      // If admin hasn't manually set collected, use donation sum
      if (fromDonations > 0) return fromDonations;
      return campaign.collected;
    },
    [donationsByCampaign],
  );

  async function persist(nextCampaigns: Campaign[], message: string) {
    setCampaigns(nextCampaigns);
    for (const c of nextCampaigns) {
      await apiSaveCampaign(c);
    }
    toastSuccess(message);
  }

  // Hero section handlers
  async function saveHero(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextContent = { ...siteContent, hero: heroForm };
    setSiteContent(nextContent);
    await apiSaveSiteContent(nextContent);
    toastSuccess('Hero-секция главной страницы обновлена.');
  }

  // Help steps handlers
  async function addHelpStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!helpStepTitle.trim() || !helpStepDesc.trim()) return;
    const nextContent = {
      ...siteContent,
      helpSteps: [
        ...siteContent.helpSteps,
        {
          step: siteContent.helpSteps.length + 1,
          title: helpStepTitle.trim(),
          description: helpStepDesc.trim(),
          icon: helpStepIcon || '👆',
        },
      ],
    };
    setSiteContent(nextContent);
    await apiSaveSiteContent(nextContent);
    setHelpStepTitle('');
    setHelpStepDesc('');
    toastSuccess('Шаг добавлен в "Как помочь".');
  }

  async function removeHelpStep(index: number) {
    const nextContent = {
      ...siteContent,
      helpSteps: siteContent.helpSteps.filter((_, i) => i !== index),
    };
    setSiteContent(nextContent);
    await apiSaveSiteContent(nextContent);
    toastSuccess('Шаг удален из "Как помочь".');
  }

  // FAQ handlers
  async function addFAQ(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;
    const nextContent = {
      ...siteContent,
      faq: [...siteContent.faq, { question: faqQuestion.trim(), answer: faqAnswer.trim() }],
    };
    setSiteContent(nextContent);
    await apiSaveSiteContent(nextContent);
    setFaqQuestion('');
    setFaqAnswer('');
    toastSuccess('Вопрос добавлен в FAQ.');
  }

  async function removeFAQ(index: number) {
    const nextContent = {
      ...siteContent,
      faq: siteContent.faq.filter((_, i) => i !== index),
    };
    setSiteContent(nextContent);
    await apiSaveSiteContent(nextContent);
    toastSuccess('Вопрос удален из FAQ.');
  }

  // Gallery handlers
  async function addGalleryImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!galleryUrl.trim() || !galleryCaption.trim()) return;
    const nextContent = {
      ...siteContent,
      gallery: [
        ...siteContent.gallery,
        {
          id: `gallery-${Date.now()}`,
          url: galleryUrl.trim(),
          caption: galleryCaption.trim(),
          date: galleryDate.trim() || 'Дата не указана',
        },
      ],
    };
    setSiteContent(nextContent);
    await apiSaveSiteContent(nextContent);
    setGalleryUrl('');
    setGalleryCaption('');
    setGalleryDate('');
    toastSuccess('Фото добавлено в галерею.');
  }

  async function removeGalleryImage(id: string) {
    const nextContent = {
      ...siteContent,
      gallery: siteContent.gallery.filter((img) => img.id !== id),
    };
    setSiteContent(nextContent);
    await apiSaveSiteContent(nextContent);
    toastSuccess('Фото удалено из галереи.');
  }

  // Team handlers
  async function addTeamMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!teamName.trim() || !teamRole.trim()) return;
    const nextContent = {
      ...siteContent,
      team: [
        ...siteContent.team,
        {
          id: `team-${Date.now()}`,
          name: teamName.trim(),
          role: teamRole.trim(),
          bio: teamBio.trim(),
          photo: teamPhoto.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        },
      ],
    };
    setSiteContent(nextContent);
    await apiSaveSiteContent(nextContent);
    setTeamName('');
    setTeamRole('');
    setTeamBio('');
    setTeamPhoto('');
    toastSuccess('Участник команды добавлен.');
  }

  async function removeTeamMember(id: string) {
    const nextContent = {
      ...siteContent,
      team: siteContent.team.filter((m) => m.id !== id),
    };
    setSiteContent(nextContent);
    await apiSaveSiteContent(nextContent);
    toastSuccess('Участник команды удален.');
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setPasswordError('Неверный пароль');
        return;
      }
      const data = await res.json();
      setIsAuthed(true);
      setPasswordError('');
    } catch {
      setPasswordError('Ошибка сервера. Попробуйте позже.');
    }
  }

  async function logout() {
    try {
      await fetch('/api/admin-auth', { method: 'DELETE' });
    } catch {}
    setIsAuthed(false);
    setPassword('');
    setPasswordError('');
  }

  function selectCampaign(campaign: Campaign) {
    setSelectedId(campaign.id);
    setForm(toForm(campaign));
    setNotice('');
  }

  function startNewCampaign() {
    const nextForm = toForm();
    nextForm.title = 'Новый сбор';
    nextForm.summary = 'Короткое описание нового сбора.';
    nextForm.description = 'Подробное описание сбора. Здесь будет понятно, на что нужны средства.';
    setSelectedId('');
    setForm(nextForm);
    setNotice('');
  }

  async function saveCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const existing = campaigns.find((campaign) => campaign.id === form.id);
    const nextCampaign = fromForm(form, existing);
    const exists = campaigns.some((campaign) => campaign.id === nextCampaign.id);
    let nextCampaigns: Campaign[];
    if (exists) {
      nextCampaigns = campaigns.map((campaign) =>
        campaign.id === nextCampaign.id ? nextCampaign : campaign,
      );
    } else {
      nextCampaigns = [nextCampaign, ...campaigns];
    }

    await apiSaveCampaign(nextCampaign);
    setCampaigns(nextCampaigns);
    toastSuccess('Сбор сохранен. Обновите публичную страницу, чтобы увидеть изменения.');
    setSelectedId(nextCampaign.id);
    setForm(toForm(nextCampaign));
  }

  function duplicateCampaign() {
    if (!selectedCampaign) {
      return;
    }

    const copy: Campaign = {
      ...selectedCampaign,
      id: `${selectedCampaign.id}-copy-${Date.now()}`,
      title: `${selectedCampaign.title} — копия`,
      status: 'hidden',
    };

    persist([copy, ...campaigns], 'Копия создана и скрыта.');
    selectCampaign(copy);
  }

  async function openDeleteModal() {
    if (!selectedCampaign) return;
    deleteRef.current = async () => {
      await apiDeleteCampaign(selectedCampaign.id);
      const nextCampaigns = campaigns.filter(
        (campaign) => campaign.id !== selectedCampaign.id,
      );
      setCampaigns(nextCampaigns);
      const nextSelected = nextCampaigns[0];
      toastSuccess('Сбор удален.');
      setSelectedId(nextSelected?.id || '');
      setForm(toForm(nextSelected));
    };
    setDeleteModalOpen(true);
  }

  function deleteCampaign() {
    if (!selectedCampaign) return;
    openDeleteModal();
  }

  const handleConfirmDelete = useCallback(() => {
    deleteRef.current?.();
    setDeleteModalOpen(false);
  }, []);

  function addReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCampaign || !reportTitle.trim()) {
      return;
    }

    const updatedCampaign = {
      ...selectedCampaign,
      reports: [
        {
          title: reportTitle.trim(),
          date: reportDate.trim() || 'Дата не указана',
          amount: Number(reportAmount) || 0,
        },
        ...selectedCampaign.reports,
      ],
    };
    const nextCampaigns = campaigns.map((campaign) =>
      campaign.id === updatedCampaign.id ? updatedCampaign : campaign,
    );

    persist(nextCampaigns, 'Отчет добавлен к сбору.');
    setReportTitle('');
    setReportDate('');
    setReportAmount('');
    setForm(toForm(updatedCampaign));
  }

  async function resetAll() {
    // Reload campaigns from API
    const storedCampaigns = await getCampaigns();
    setCampaigns(storedCampaigns);
    setSelectedId(storedCampaigns[0]?.id || '');
    setForm(toForm(storedCampaigns[0]));
    toastSuccess('Данные перезагружены из базы.');
  }

  async function saveAbout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextContent = {
      ...siteContent,
      about: aboutForm,
    };
    setSiteContent(nextContent);
    await apiSaveSiteContent(nextContent);
    toastSuccess('Страница «О нас» сохранена. Обновите публичную страницу.');
  }

  async function addSiteReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!siteReportForm.title.trim()) {
      return;
    }

    const nextReport: ReportPost = {
      ...siteReportForm,
      id: makeReportId(siteReportForm.title),
      title: siteReportForm.title.trim(),
      date: siteReportForm.date.trim() || 'Дата не указана',
      image: siteReportForm.image.trim() || emptyImage,
      amount: Number(siteReportForm.amount) || 0,
      text: siteReportForm.text.trim(),
      documents: siteReportDocuments
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    };
    const nextContent = {
      ...siteContent,
      reports: [nextReport, ...siteContent.reports],
    };

    setSiteContent(nextContent);
    await apiSaveSiteContent(nextContent);
    setSiteReportForm({
      title: '',
      date: '',
      image: emptyImage,
      amount: 0,
      text: '',
      documents: [],
    });
    setSiteReportDocuments('');
    toastSuccess('Отчет опубликован на странице «Отчеты».');
  }

  async function removeSiteReport(id: string) {
    const nextContent = {
      ...siteContent,
      reports: siteContent.reports.filter((report) => report.id !== id),
    };
    setSiteContent(nextContent);
    await apiSaveSiteContent(nextContent);
    toastSuccess('Отчет удален из демо-страницы.');
  }

  if (!isAuthed) {
    return (
      <main className="min-h-screen bg-[#f4f5f7] px-4 py-10 text-[#07111f]">
        <section className="mx-auto max-w-md rounded-[24px] bg-white p-6 shadow-[0_24px_70px_rgb(7_17_31/10%)]">
          <h1 className="text-2xl font-black">Админ-панель</h1>
          <p className="mt-3 leading-7 text-zinc-600">
            Закрытая страница прототипа. Пароль-заглушка: <strong>sosedi2026</strong>.
          </p>
          <form className="mt-6" onSubmit={login}>
            <label className="block">
              <span className="text-sm font-bold text-zinc-500">Пароль</span>
              <input
                className="mt-2 h-14 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </label>
            {passwordError ? (
              <p className="mt-3 font-semibold text-red-600">{passwordError}</p>
            ) : null}
            <button className="mt-5 h-14 w-full rounded-full bg-[#04953f] font-black text-white">
              Войти
            </button>
          </form>
          <a
            className="mt-4 inline-flex font-bold text-zinc-500"
            href="/"
          >
            Вернуться на сайт
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] px-4 py-8 text-[#07111f] md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#05863a]">
              Админ-панель
            </p>
            <h1 className="mt-2 text-3xl font-black">Управление сборами</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="rounded-full border border-zinc-200 bg-white px-5 py-3 font-black" href="/">
              На сайт
            </a>
            <button
              className="rounded-full border border-zinc-200 bg-white px-5 py-3 font-black"
              onClick={resetAll}
              type="button"
            >
              Сбросить демо
            </button>
            <button
              className="rounded-full border border-red-200 bg-red-50 text-red-600 px-5 py-3 font-black hover:bg-red-100"
              onClick={logout}
              type="button"
            >
              Выйти
            </button>
          </div>
        </header>



        <div className="mt-6 grid gap-5 lg:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="rounded-[24px] bg-white p-4">
            <button
              className="mb-4 h-12 w-full rounded-full bg-[#04953f] font-black text-white"
              onClick={startNewCampaign}
              type="button"
            >
              Новый сбор
            </button>
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <button
                  className={`w-full rounded-2xl border p-4 text-left ${
                    selectedId === campaign.id
                      ? 'border-[#04953f] bg-[#e8f7ef]'
                      : 'border-zinc-200 bg-white'
                  }`}
                  key={campaign.id}
                  onClick={() => selectCampaign(campaign)}
                  type="button"
                >
                  <p className="font-black">{campaign.title}</p>
                  <p className="mt-2 text-sm font-semibold text-zinc-500">
                    {formatRub(getCollected(campaign))} из {formatRub(campaign.needed)}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase text-zinc-400">
                    {campaign.status || 'active'}
                  </p>
                </button>
              ))}
            </div>
          </aside>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <form className="rounded-[24px] bg-white p-5" onSubmit={saveCampaign}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-black">
                  {selectedId ? 'Редактировать сбор' : 'Создать сбор'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="h-11 rounded-full border border-zinc-200 px-5 font-black"
                    onClick={duplicateCampaign}
                    type="button"
                  >
                    Дублировать
                  </button>
                  <button
                    className="h-11 rounded-full border border-red-200 bg-red-50 px-5 font-black text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!selectedCampaign}
                    onClick={deleteCampaign}
                    type="button"
                  >
                    Удалить сбор
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="md:col-span-2">
                  <span className="text-sm font-bold text-zinc-500">Название</span>
                  <input
                    className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                    required
                    value={form.title}
                  />
                </label>
                <label>
                  <span className="text-sm font-bold text-zinc-500">Категория</span>
                  <input
                    className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                    onChange={(event) => setForm({ ...form, category: event.target.value })}
                    value={form.category}
                  />
                </label>
                <label>
                  <span className="text-sm font-bold text-zinc-500">Статус</span>
                  <select
                    className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as CampaignForm['status'],
                      })
                    }
                    value={form.status}
                  >
                    <option value="active">Активен</option>
                    <option value="completed">Завершен</option>
                    <option value="hidden">Скрыт</option>
                  </select>
                </label>
                <label>
                  <span className="text-sm font-bold text-zinc-500">Нужно</span>
                  <input
                    className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                    min="0"
                    onChange={(event) => setForm({ ...form, needed: event.target.value })}
                    type="number"
                    value={form.needed}
                  />
                </label>
                <label>
                  <span className="text-sm font-bold text-zinc-500">Поддержали</span>
                  <input
                    className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                    min="0"
                    onChange={(event) => setForm({ ...form, donors: event.target.value })}
                    type="number"
                    value={form.donors}
                  />
                </label>
                <label>
                  <span className="text-sm font-bold text-zinc-500">Комментарии</span>
                  <input
                    className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                    min="0"
                    onChange={(event) => setForm({ ...form, comments: event.target.value })}
                    type="number"
                    value={form.comments}
                  />
                </label>
                <label className="md:col-span-2">
                  <span className="text-sm font-bold text-zinc-500">Фото: ссылка</span>
                  <input
                    className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                    onChange={(event) => setForm({ ...form, image: event.target.value })}
                    value={form.image}
                  />
                </label>
                <label className="md:col-span-2">
                  <span className="text-sm font-bold text-zinc-500">Короткое описание</span>
                  <textarea
                    className="mt-2 min-h-24 w-full rounded-2xl border border-zinc-200 p-4 font-semibold outline-none focus:border-[#04953f]"
                    onChange={(event) => setForm({ ...form, summary: event.target.value })}
                    value={form.summary}
                  />
                </label>
                <label className="md:col-span-2">
                  <span className="text-sm font-bold text-zinc-500">Подробное описание</span>
                  <textarea
                    className="mt-2 min-h-40 w-full rounded-2xl border border-zinc-200 p-4 font-semibold outline-none focus:border-[#04953f]"
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                    value={form.description}
                  />
                </label>
                <label className="md:col-span-2">
                  <span className="text-sm font-bold text-zinc-500">
                    Документы, по одному на строку
                  </span>
                  <textarea
                    className="mt-2 min-h-24 w-full rounded-2xl border border-zinc-200 p-4 font-semibold outline-none focus:border-[#04953f]"
                    onChange={(event) =>
                      setForm({ ...form, documents: event.target.value })
                    }
                    value={form.documents}
                  />
                </label>
              </div>

              <button className="mt-5 h-14 w-full rounded-full bg-[#04953f] font-black text-white">
                Сохранить сбор
              </button>
            </form>

            <aside className="rounded-[24px] bg-white p-5">
              <h2 className="text-2xl font-black">Отчеты по сбору</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Пока отчет хранится внутри выбранного сбора. На следующем этапе
                вынесем отчеты на отдельную публичную страницу.
              </p>

              <form className="mt-5 space-y-3" onSubmit={addReport}>
                <input
                  className="h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) => setReportTitle(event.target.value)}
                  placeholder="Название отчета"
                  value={reportTitle}
                />
                <input
                  className="h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) => setReportDate(event.target.value)}
                  placeholder="Дата"
                  value={reportDate}
                />
                <input
                  className="h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  min="0"
                  onChange={(event) => setReportAmount(event.target.value)}
                  placeholder="Сумма расходов"
                  type="number"
                  value={reportAmount}
                />
                <button className="h-12 w-full rounded-full bg-[#07111f] font-black text-white">
                  Добавить отчет
                </button>
              </form>

              <div className="mt-5 space-y-3">
                {selectedCampaign?.reports.length ? (
                  selectedCampaign.reports.map((report) => (
                    <div className="rounded-2xl bg-[#f4f5f7] p-4" key={report.title}>
                      <p className="font-black">{report.title}</p>
                      <p className="mt-1 text-sm font-semibold text-zinc-500">
                        {report.date} · {formatRub(report.amount)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl bg-[#f4f5f7] p-4 leading-7 text-zinc-600">
                    У выбранного сбора пока нет отчетов.
                  </p>
                )}
              </div>
            </aside>
          </section>
        </div>

        <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <form className="rounded-[24px] bg-white p-5" onSubmit={saveAbout}>
            <h2 className="text-2xl font-black">Страница “О нас”</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Эти данные показываются на публичной странице /about.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="text-sm font-bold text-zinc-500">Название</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) =>
                    setAboutForm({ ...aboutForm, title: event.target.value })
                  }
                  value={aboutForm.title}
                />
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-bold text-zinc-500">Описание</span>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-zinc-200 p-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) =>
                    setAboutForm({ ...aboutForm, description: event.target.value })
                  }
                  value={aboutForm.description}
                />
              </label>
              <label>
                <span className="text-sm font-bold text-zinc-500">Телефон</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) =>
                    setAboutForm({ ...aboutForm, phone: event.target.value })
                  }
                  value={aboutForm.phone}
                />
              </label>
              <label>
                <span className="text-sm font-bold text-zinc-500">Email</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) =>
                    setAboutForm({ ...aboutForm, email: event.target.value })
                  }
                  value={aboutForm.email}
                />
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-bold text-zinc-500">Адрес</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) =>
                    setAboutForm({ ...aboutForm, address: event.target.value })
                  }
                  value={aboutForm.address}
                />
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-bold text-zinc-500">
                  Юридическое название
                </span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) =>
                    setAboutForm({ ...aboutForm, legalName: event.target.value })
                  }
                  value={aboutForm.legalName}
                />
              </label>
              <label>
                <span className="text-sm font-bold text-zinc-500">ИНН</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) =>
                    setAboutForm({ ...aboutForm, inn: event.target.value })
                  }
                  value={aboutForm.inn}
                />
              </label>
              <label>
                <span className="text-sm font-bold text-zinc-500">ОГРН</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) =>
                    setAboutForm({ ...aboutForm, ogrn: event.target.value })
                  }
                  value={aboutForm.ogrn}
                />
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-bold text-zinc-500">
                  Направления деятельности, по одному на строку
                </span>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-zinc-200 p-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) =>
                    setAboutForm({
                      ...aboutForm,
                      activities: event.target.value
                        .split('\n')
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                  value={aboutForm.activities.join('\n')}
                />
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-bold text-zinc-500">Реквизиты</span>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-zinc-200 p-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) =>
                    setAboutForm({ ...aboutForm, requisites: event.target.value })
                  }
                  value={aboutForm.requisites}
                />
              </label>
            </div>

            <button className="mt-5 h-14 w-full rounded-full bg-[#04953f] font-black text-white">
              Сохранить "О нас"
            </button>
          </form>

          {/* Hero Section Editor */}
          <aside className="rounded-[24px] bg-white p-5">
            <form className="rounded-[24px] bg-white p-5" onSubmit={saveHero}>
            <h2 className="text-2xl font-black">Главная страница (Hero)</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Управление текстами на главной странице сайта.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="text-sm font-bold text-zinc-500">Подзаголовок</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) =>
                    setHeroForm({ ...heroForm, subtitle: event.target.value })
                  }
                  value={heroForm.subtitle}
                />
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-bold text-zinc-500">Заголовок</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) =>
                    setHeroForm({ ...heroForm, title: event.target.value })
                  }
                  value={heroForm.title}
                />
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-bold text-zinc-500">Описание</span>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-zinc-200 p-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) =>
                    setHeroForm({ ...heroForm, description: event.target.value })
                  }
                  value={heroForm.description}
                />
              </label>
            </div>

            <button className="mt-5 h-14 w-full rounded-full bg-[#04953f] font-black text-white">
              Сохранить Hero
            </button>
            </form>
          </aside>
        </section>

      {/* Help Steps Editor */}
      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <form className="rounded-[24px] bg-white p-5" onSubmit={addHelpStep}>
          <h2 className="text-2xl font-black">Как помочь (шаги)</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Управление шагами на странице "Как помочь".
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="text-sm font-bold text-zinc-500">Иконка (эмодзи)</span>
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) => setHelpStepIcon(event.target.value)}
                value={helpStepIcon}
              />
            </label>
            <label className="md:col-span-2">
              <span className="text-sm font-bold text-zinc-500">Название шага</span>
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) => setHelpStepTitle(event.target.value)}
                value={helpStepTitle}
              />
            </label>
            <label className="md:col-span-2">
              <span className="text-sm font-bold text-zinc-500">Описание</span>
              <textarea
                className="mt-2 min-h-28 w-full rounded-2xl border border-zinc-200 p-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) => setHelpStepDesc(event.target.value)}
                value={helpStepDesc}
              />
            </label>
          </div>

          <button className="mt-5 h-14 w-full rounded-full bg-[#07111f] font-black text-white">
            Добавить шаг
          </button>
        </form>

        <aside className="rounded-[24px] bg-white p-5">
          <h2 className="text-2xl font-black">Шаги "Как помочь"</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Список текущих шагов.
          </p>

          <div className="mt-5 space-y-3">
            {siteContent.helpSteps.map((step, index) => (
              <div className="rounded-2xl bg-[#f4f5f7] p-4" key={index}>
                <p className="font-black">{step.icon} {step.title}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{step.description}</p>
                <button
                  className="mt-3 text-sm font-black text-red-600"
                  onClick={() => removeHelpStep(index)}
                  type="button"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {/* Reports Section */}
      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <form className="rounded-[24px] bg-white p-5" onSubmit={addSiteReport}>
          <h2 className="text-2xl font-black">Добавить отчет</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Создание нового отчета о мероприятиях или расходах.
          </p>

          <div className="mt-5 space-y-3">
              <input
                className="h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) =>
                  setSiteReportForm({
                    ...siteReportForm,
                    title: event.target.value,
                  })
                }
                placeholder="Название отчета"
                value={siteReportForm.title}
              />
              <input
                className="h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) =>
                  setSiteReportForm({ ...siteReportForm, date: event.target.value })
                }
                placeholder="Дата"
                value={siteReportForm.date}
              />
              <input
                className="h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                min="0"
                onChange={(event) =>
                  setSiteReportForm({
                    ...siteReportForm,
                    amount: Number(event.target.value),
                  })
                }
                placeholder="Сумма расходов"
                type="number"
                value={siteReportForm.amount}
              />
              <input
                className="h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) =>
                  setSiteReportForm({ ...siteReportForm, image: event.target.value })
                }
                placeholder="Ссылка на фото"
                value={siteReportForm.image}
              />
              <textarea
                className="min-h-28 w-full rounded-2xl border border-zinc-200 p-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) =>
                  setSiteReportForm({ ...siteReportForm, text: event.target.value })
                }
                placeholder="Описание отчета"
                value={siteReportForm.text}
              />
              <textarea
                className="min-h-24 w-full rounded-2xl border border-zinc-200 p-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) => setSiteReportDocuments(event.target.value)}
                placeholder="Документы, по одному на строку"
                value={siteReportDocuments}
              />
              <button className="h-12 w-full rounded-full bg-[#07111f] font-black text-white">
                Опубликовать отчет
              </button>
            </div>
          </form>

        <aside className="rounded-[24px] bg-white p-5">
          <h2 className="text-2xl font-black">Опубликованные отчеты</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Список текущих отчетов.
          </p>

          <div className="mt-5 space-y-3">
            {siteContent.reports.map((report) => (
              <div className="rounded-2xl bg-[#f4f5f7] p-4" key={report.id}>
                <p className="font-black">{report.title}</p>
                <p className="mt-1 text-sm font-semibold text-zinc-500">
                  {report.date} · {formatRub(report.amount)}
                </p>
                <button
                  className="mt-3 text-sm font-black text-red-600"
                  onClick={() => removeSiteReport(report.id)}
                  type="button"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </aside>
      </section>

        {/* FAQ, Gallery & Team Management */}
        <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          {/* FAQ Editor */}
          <form className="rounded-[24px] bg-white p-5" onSubmit={addFAQ}>
            <h2 className="text-2xl font-black">Частые вопросы (FAQ)</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Управление вопросами и ответами на странице FAQ.
            </p>

            <div className="mt-5 space-y-3">
              <input
                className="h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) => setFaqQuestion(event.target.value)}
                placeholder="Вопрос"
                value={faqQuestion}
              />
              <textarea
                className="min-h-28 w-full rounded-2xl border border-zinc-200 p-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) => setFaqAnswer(event.target.value)}
                placeholder="Ответ"
                value={faqAnswer}
              />
              <button className="h-12 w-full rounded-full bg-[#07111f] font-black text-white">
                Добавить вопрос
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {siteContent.faq.map((item, index) => (
                <div className="rounded-2xl bg-[#f4f5f7] p-4" key={index}>
                  <p className="font-black">{item.question}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">{item.answer}</p>
                  <button
                    className="mt-3 text-sm font-black text-red-600"
                    onClick={() => removeFAQ(index)}
                    type="button"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          </form>

          {/* Gallery Editor */}
          <aside className="rounded-[24px] bg-white p-5">
            <h2 className="text-2xl font-black">Галерея</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Управление фотографиями на странице галереи.
            </p>

            <form className="mt-5 space-y-3" onSubmit={addGalleryImage}>
              <input
                className="h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) => setGalleryUrl(event.target.value)}
                placeholder="Ссылка на фото"
                value={galleryUrl}
              />
              <input
                className="h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) => setGalleryCaption(event.target.value)}
                placeholder="Подпись к фото"
                value={galleryCaption}
              />
              <input
                className="h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                onChange={(event) => setGalleryDate(event.target.value)}
                placeholder="Дата (необязательно)"
                value={galleryDate}
              />
              <button className="h-12 w-full rounded-full bg-[#07111f] font-black text-white">
                Добавить фото
              </button>
            </form>

            <div className="mt-5 space-y-3">
              {siteContent.gallery.map((img) => (
                <div className="rounded-2xl bg-[#f4f5f7] p-4" key={img.id}>
                  <p className="font-black">{img.caption}</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-500">{img.date}</p>
                  <button
                    className="mt-3 text-sm font-black text-red-600"
                    onClick={() => removeGalleryImage(img.id)}
                    type="button"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          </aside>
        </section>

        {/* Team Editor */}
        <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <form className="rounded-[24px] bg-white p-5" onSubmit={addTeamMember}>
            <h2 className="text-2xl font-black">Команда</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Управление участниками команды на странице "О нас".
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="text-sm font-bold text-zinc-500">Имя</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) => setTeamName(event.target.value)}
                  value={teamName}
                />
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-bold text-zinc-500">Роль</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) => setTeamRole(event.target.value)}
                  value={teamRole}
                />
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-bold text-zinc-500">Биография</span>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-zinc-200 p-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) => setTeamBio(event.target.value)}
                  value={teamBio}
                />
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-bold text-zinc-500">Фото: ссылка</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) => setTeamPhoto(event.target.value)}
                  value={teamPhoto}
                />
              </label>
            </div>

            <button className="mt-5 h-14 w-full rounded-full bg-[#07111f] font-black text-white">
              Добавить участника
            </button>
          </form>

          <aside className="rounded-[24px] bg-white p-5">
            <h2 className="text-2xl font-black">Участники команды</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Список текущих участников.
            </p>

            <div className="mt-5 space-y-3">
              {siteContent.team.map((member) => (
                <div className="rounded-2xl bg-[#f4f5f7] p-4" key={member.id}>
                  <p className="font-black">{member.name}</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-500">{member.role}</p>
                  <button
                    className="mt-3 text-sm font-black text-red-600"
                    onClick={() => removeTeamMember(member.id)}
                    type="button"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <ConfirmModal
          open={deleteModalOpen}
          title="Удалить сбор"
          description={`Вы уверены, что хотите удалить "${selectedCampaign?.title}"? Это действие нельзя отменить.`}
          confirmLabel="Удалить"
          cancelLabel="Отмена"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />

        <ToastContainer toasts={toasts} />
      </div>
    </main>
  );
}

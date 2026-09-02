import { AboutClient } from './AboutClient';
import { SiteHeader } from '../components/SiteHeader';
import { getSiteContent } from '../lib/site-content/api-site-content';

export const metadata = {
  title: 'О нас | МРОМ Соседи',
  description: 'Информация о МРОМ Соседи, контакты и юридические данные.',
};

export default async function AboutPage() {
  const data = await getSiteContent();
  const about = (data?.about as any) || null;
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#07111f]">
      <SiteHeader />
      <AboutClient initialAbout={about} />
    </main>
  );
}

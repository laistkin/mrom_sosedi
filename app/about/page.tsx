import { AboutClient } from './AboutClient';
import { SiteHeader } from '../components/SiteHeader';
import { defaultSiteContent } from '../lib/site-content/demo-site-content';

export const metadata = {
  title: 'О нас | МРОМ Соседи',
  description: 'Информация о МРОМ Соседи, контакты и юридические данные.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#07111f]">
      <SiteHeader />
      <AboutClient initialAbout={defaultSiteContent.about} />
    </main>
  );
}

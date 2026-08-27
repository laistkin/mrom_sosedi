import { ReportsClient } from './ReportsClient';
import { SiteHeader } from '../components/SiteHeader';
import { defaultSiteContent } from '../lib/site-content/demo-site-content';

export const metadata = {
  title: 'Отчеты | МРОМ Соседи',
  description: 'Отчеты о мероприятиях, расходах и документах МРОМ Соседи.',
};

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#07111f]">
      <SiteHeader />
      <ReportsClient initialReports={defaultSiteContent.reports} />
    </main>
  );
}

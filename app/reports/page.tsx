import { ReportsClient } from './ReportsClient';
import { SiteHeader } from '../components/SiteHeader';
import { getSiteContent } from '../lib/site-content/api-site-content';

export const metadata = {
  title: 'Отчёты | МРОМ Соседи',
  description: 'Отчёты о мероприятиях, расходах и документах МРОМ Соседи.',
};

export default async function ReportsPage() {
  const data = await getSiteContent();
  const reports = (data?.reports as any[]) || [];
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#07111f]">
      <SiteHeader />
      <ReportsClient initialReports={reports} />
    </main>
  );
}

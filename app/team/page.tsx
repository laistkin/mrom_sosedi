import { SiteHeader } from '../components/SiteHeader';
import { TeamClient } from './TeamClient';

export const metadata = {
  title: 'Команда — МРОМ Соседи',
  description: 'Люди, которые стоят за проектом местного исламского центра.',
};

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#07111f]">
      <SiteHeader />
      <TeamClient />
    </main>
  );
}

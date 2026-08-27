import { SiteHeader } from '../components/SiteHeader';
import { HowToHelpClient } from './HowToHelpClient';

export const metadata = {
  title: 'Как помочь — МРОМ Соседи',
  description: 'Пошаговое руководство по пожертвованиям для поддержки местного исламского центра.',
};

export default function HowToHelpPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#07111f]">
      <SiteHeader />
      <HowToHelpClient />
    </main>
  );
}

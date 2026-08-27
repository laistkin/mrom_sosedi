import { SiteHeader } from '../components/SiteHeader';
import { FAQClient } from './FAQClient';

export const metadata = {
  title: 'Часто задаваемые вопросы — МРОМ Соседи',
  description: 'Ответы на популярные вопросы о пожертвованиях, безопасности и отчётности.',
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#07111f]">
      <SiteHeader />
      <FAQClient />
    </main>
  );
}

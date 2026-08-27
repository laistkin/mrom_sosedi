import { SiteHeader } from '../components/SiteHeader';
import { GalleryClient } from './GalleryClient';

export const metadata = {
  title: 'Галерея — МРОМ Соседи',
  description: 'Фотографии мероприятий, занятий и жизни местного исламского центра.',
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#07111f]">
      <SiteHeader />
      <GalleryClient />
    </main>
  );
}

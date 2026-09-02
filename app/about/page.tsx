'use client';

import { AboutClient } from './AboutClient';
import { SiteHeader } from '../components/SiteHeader';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#07111f]">
      <SiteHeader />
      <AboutClient />
    </main>
  );
}

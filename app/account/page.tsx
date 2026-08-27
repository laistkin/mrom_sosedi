import { AccountClient } from './AccountClient';
import { SiteHeader } from '../components/SiteHeader';

export const metadata = {
  title: 'Личный кабинет | МРОМ Соседи',
  description: 'Демо-кабинет жертвователя МРОМ Соседи.',
};

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#07111f]">
      <SiteHeader />
      <AccountClient />
    </main>
  );
}

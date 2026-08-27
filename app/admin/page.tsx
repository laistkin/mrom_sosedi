import { AdminClient } from './AdminClient';

export const metadata = {
  title: 'Админ-панель | МРОМ Соседи',
  description: 'Демо-админка для управления сборами МРОМ Соседи.',
};

export default function AdminPage() {
  return <AdminClient />;
}

import type { PaymentMethod } from '../payments/yookassa-demo';

export type DemoDonation = {
  id: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  donorName: string;
  anonymous: boolean;
  method: PaymentMethod;
  createdAt: string;
};

export const donationsStorageKey = 'mrom_sosedi_demo_donations';

export const formatRub = (value: number) =>
  new Intl.NumberFormat('ru-RU').format(value) + ' ₽';

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));

export function readDemoDonations(): DemoDonation[] {
  try {
    return JSON.parse(window.localStorage.getItem(donationsStorageKey) || '[]');
  } catch {
    return [];
  }
}

export function saveDemoDonation(donation: DemoDonation) {
  const previousHistory = readDemoDonations();
  window.localStorage.setItem(
    donationsStorageKey,
    JSON.stringify([donation, ...previousHistory]),
  );
}

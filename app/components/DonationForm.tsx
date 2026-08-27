'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  createDemoYookassaPayment,
  type DemoPayment,
  type PaymentMethod,
} from '../lib/payments/yookassa-demo';
import { saveDemoDonation } from '../lib/donations/demo-donations';

type DonationFormProps = {
  campaignId: string;
  campaignTitle: string;
};

const quickAmounts = [100, 250, 500, 1000];

const formatRub = (value: number) =>
  new Intl.NumberFormat('ru-RU').format(value) + ' ₽';

export function DonationForm({ campaignId, campaignTitle }: DonationFormProps) {
  const [donorName, setDonorName] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState<PaymentMethod>('bank_card');
  const [accepted, setAccepted] = useState(true);
  const [showAcceptError, setShowAcceptError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payment, setPayment] = useState<DemoPayment | null>(null);

  const canSubmit = amount >= 10 && accepted && !isSubmitting;
  const methodLabel = method === 'bank_card' ? 'Картой онлайн' : 'Через СБП';

  const displayName = useMemo(() => {
    if (anonymous) {
      return 'Анонимная помощь';
    }

    return donorName.trim() || 'Гость';
  }, [anonymous, donorName]);

  async function submitDonation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accepted) {
      setShowAcceptError(true);
      return;
    }

    if (amount < 10) {
      return;
    }

    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    const createdPayment = await createDemoYookassaPayment({
      campaignId,
      campaignTitle,
      amount,
      donorName: displayName,
      anonymous,
      method,
    });

    saveDemoDonation({
      id: createdPayment.id,
      campaignId,
      campaignTitle,
      amount,
      donorName: displayName,
      anonymous,
      method,
      createdAt: createdPayment.createdAt,
    });

    setPayment(createdPayment);
    setIsSubmitting(false);
  }

  if (payment) {
    return (
      <section
        className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgb(7_17_31/10%)] md:p-8"
        id="demo-yookassa-success"
      >
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#2f7d5f]">
          Демо ЮKassa
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight">
          Пожертвование принято
        </h2>
        <p className="mt-3 leading-7 text-zinc-600">
          Это прототип: деньги не списываются. В будущей версии здесь будет
          подтверждение от ЮKassa и автоматическое обновление суммы сбора.
        </p>

        <div className="mt-6 grid gap-3 rounded-[24px] bg-[#f4f5f7] p-5 text-sm font-semibold text-zinc-600 sm:grid-cols-2">
          <div>
            <p className="text-zinc-400">Сумма</p>
            <p className="mt-1 text-2xl font-black text-[#07111f]">
              {formatRub(payment.amount)}
            </p>
          </div>
          <div>
            <p className="text-zinc-400">Способ</p>
            <p className="mt-1 text-2xl font-black text-[#07111f]">
              {methodLabel}
            </p>
          </div>
          <div>
            <p className="text-zinc-400">Жертвователь</p>
            <p className="mt-1 text-lg font-black text-[#07111f]">
              {displayName}
            </p>
          </div>
          <div>
            <p className="text-zinc-400">Платеж</p>
            <p className="mt-1 break-all text-lg font-black text-[#07111f]">
              {payment.id}
            </p>
          </div>
        </div>

        <button
          className="mt-6 h-14 w-full rounded-full border border-zinc-200 bg-white text-base font-black text-zinc-900"
          onClick={() => setPayment(null)}
          type="button"
        >
          Сделать еще пожертвование
        </button>
      </section>
    );
  }

  return (
    <form
      className="rounded-[28px] bg-white p-5 shadow-[0_24px_70px_rgb(7_17_31/10%)] md:p-7"
      onSubmit={submitDonation}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#2f7d5f]">
            ЮKassa готовится
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">
            Поддержать проект
          </h2>
        </div>
        <span className="rounded-full bg-[#eef6f2] px-3 py-1 text-xs font-black text-[#356f59]">
          демо
        </span>
      </div>

      <div className="mt-6 flex min-h-16 items-center gap-3 rounded-[22px] border border-zinc-200 bg-white px-4">
        <input
          className="min-w-0 flex-1 bg-transparent py-4 text-lg font-semibold outline-none placeholder:text-zinc-400 disabled:text-zinc-300"
          disabled={anonymous}
          onChange={(event) => setDonorName(event.target.value)}
          placeholder="Ваше имя"
          type="text"
          value={donorName}
        />
        <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm font-semibold leading-4 text-zinc-500">
          <input
            checked={anonymous}
            className="h-6 w-6 accent-[#2f9f6b]"
            onChange={(event) => setAnonymous(event.target.checked)}
            type="checkbox"
          />
          <span>
            Анонимная
            <br />
            помощь
          </span>
        </label>
      </div>

      <div className="mt-4 rounded-[22px] border border-zinc-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <input
            aria-label="Сумма пожертвования"
            className="min-w-0 flex-1 bg-transparent text-4xl font-semibold tracking-tight outline-none"
            min="10"
            onChange={(event) => setAmount(Number(event.target.value))}
            type="number"
            value={amount}
          />
          <span className="text-4xl font-semibold">₽</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickAmounts.map((quickAmount) => (
            <button
              className={`rounded-full px-4 py-1.5 text-sm font-black ${
                amount === quickAmount
                  ? 'bg-[#07111f] text-white'
                  : 'bg-[#f4f5f7] text-[#07111f]'
              }`}
              key={quickAmount}
              onClick={() => setAmount(quickAmount)}
              type="button"
            >
              {formatRub(quickAmount)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          className="h-16 rounded-[22px] bg-[#07111f] text-base font-black text-white"
          type="button"
        >
          Единоразово
        </button>
        <button
          className="h-16 rounded-[22px] border border-zinc-200 bg-white text-base font-black text-zinc-400"
          disabled
          type="button"
        >
          Регулярно · позже
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          className={`flex h-16 items-center gap-3 rounded-[20px] border px-4 text-left text-base font-black ${
            method === 'bank_card'
              ? 'border-[#dceee5] bg-[#eef6f2]'
              : 'border-zinc-200 bg-white'
          }`}
          onClick={() => setMethod('bank_card')}
          type="button"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#20b89a] text-white">
            ▬
          </span>
          Картой онлайн
        </button>
        <button
          className={`flex h-16 items-center gap-3 rounded-[20px] border px-4 text-left text-base font-black ${
            method === 'sbp'
              ? 'border-[#dceee5] bg-[#eef6f2]'
              : 'border-zinc-200 bg-white'
          }`}
          onClick={() => setMethod('sbp')}
          type="button"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-lg">
            △
          </span>
          Через СБП
        </button>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6 text-zinc-500">
        <input
          checked={accepted}
          className="mt-1 h-5 w-5 accent-[#2f9f6b]"
          onChange={(event) => {
            setAccepted(event.target.checked);
            setShowAcceptError(false);
          }}
          type="checkbox"
        />
        <span>
          Принимаю условия обработки персональных данных и понимаю, что сейчас
          используется демонстрационный платеж без списания средств.
        </span>
      </label>
      {showAcceptError ? (
        <p className="mt-2 text-sm font-semibold text-red-600">
          Отметьте чекбокс, чтобы продолжить
        </p>
      ) : null}

      <button
        className="mt-6 h-16 w-full rounded-full bg-[#2f9f6b] text-lg font-black text-white shadow-[0_16px_34px_rgb(47_159_107/18%)] disabled:bg-zinc-300 disabled:shadow-none"
        disabled={!canSubmit}
        type="submit"
      >
        {isSubmitting ? 'Создаем демо-платеж...' : 'Поддержать'}
      </button>
    </form>
  );
}

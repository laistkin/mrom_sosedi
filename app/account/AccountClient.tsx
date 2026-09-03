'use client';


import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { formatRub, type DemoDonation } from '../lib/donations/demo-donations';

type DemoUser = {
  firstName: string;
  lastName: string;
  phone: string;
};

const userStorageKey = 'mrom_sosedi_demo_user';
const demoSmsCode = '1234';

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, '').slice(0, 16);
}

function methodLabel(method: DemoDonation['method']) {
  return method === 'bank_card' ? 'Картой онлайн' : 'Через СБП';
}

export function AccountClient() {
  const [step, setStep] = useState<'phone' | 'code' | 'profile'>('phone');
  const [phone, setPhone] = useState('+7');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [user, setUser] = useState<DemoUser | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    const savedUser = window.localStorage.getItem(userStorageKey);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser) as DemoUser;
      setUser(parsedUser);
      setFirstName(parsedUser.firstName);
      setLastName(parsedUser.lastName);
      setPhone(parsedUser.phone);
      setStep('profile');

      // Fetch real donations from API by phone
      if (parsedUser.phone) {
        const phoneEncoded = parsedUser.phone.replace(/[^\d+]/g, '');
        fetch(`/api/donations/${encodeURIComponent(phoneEncoded)}`)
          .then(r => r.json())
          .then((data: any) => {
            if (!Array.isArray(data.error)) setDonations(data);
          })
          .catch(console.error);
      }
    }
  }, []);

  const totalDonated = useMemo(
    () => donations.reduce((sum, donation) => sum + donation.amount, 0),
    [donations],
  );

  function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCodeError('');
    setStep('code');
  }

  function confirmCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (code.trim() !== demoSmsCode) {
      setCodeError('Код неверный. Попробуйте ещё раз.');
      return;
    }

    const nextUser = {
      firstName: firstName.trim() || 'Гость',
      lastName: lastName.trim(),
      phone,
    };

    window.localStorage.setItem(userStorageKey, JSON.stringify(nextUser));
    setUser(nextUser);
    setStep('profile');
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextUser = {
      firstName: firstName.trim() || 'Гость',
      lastName: lastName.trim(),
      phone,
    };

    window.localStorage.setItem(userStorageKey, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  function signOut() {
    window.localStorage.removeItem(userStorageKey);
    setUser(null);
    setCode('');
    setCodeError('');
    setStep('phone');
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-14">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
          Ваша история помощи
        </h1>

      </div>

      {step !== 'profile' ? (
        <section className="mt-8 grid gap-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_24px_70px_rgb(7_17_31/10%)] md:p-7">
            {step === 'phone' ? (
              <form onSubmit={requestCode}>
                <h2 className="text-2xl font-black">Вход по телефону</h2>
                <p className="mt-3 leading-7 text-zinc-600">
                  Введите номер телефона. На него будет отправлен код подтверждения.
                </p>

                <label className="mt-6 block">
                  <span className="text-sm font-bold text-zinc-500">Телефон</span>
                  <input
                    className="mt-2 h-16 w-full rounded-[22px] border border-zinc-200 px-4 text-xl font-semibold outline-none focus:border-[#04953f]"
                    onChange={(event) => setPhone(normalizePhone(event.target.value))}
                    required
                    type="tel"
                    value={phone}
                  />
                </label>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    className="h-14 rounded-[20px] border border-zinc-200 bg-white text-base font-black text-zinc-400"
                    disabled
                    type="button"
                  >
                    Другой способ · скоро
                  </button>
                </div>

                <button className="mt-6 h-16 w-full rounded-full bg-[#04953f] text-lg font-black text-white shadow-[0_16px_34px_rgb(4_149_63/24%)]">
                  Получить код
                </button>
              </form>
            ) : (
              <form onSubmit={confirmCode}>
                <h2 className="text-2xl font-black">Проверьте телефон</h2>
                <p className="mt-3 leading-7 text-zinc-600">
                  На номер отправлено SMS с кодом подтверждения. Введите его здесь.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-zinc-500">Имя</span>
                    <input
                      className="mt-2 h-14 w-full rounded-[20px] border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                      onChange={(event) => setFirstName(event.target.value)}
                      placeholder="Ваше имя"
                      type="text"
                      value={firstName}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold text-zinc-500">Фамилия</span>
                    <input
                      className="mt-2 h-14 w-full rounded-[20px] border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                      onChange={(event) => setLastName(event.target.value)}
                      placeholder="Ваша фамилия"
                      type="text"
                      value={lastName}
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="text-sm font-bold text-zinc-500">Код</span>
                  <input
                    className="mt-2 h-16 w-full rounded-[22px] border border-zinc-200 px-4 text-2xl font-black tracking-[0.3em] outline-none focus:border-[#04953f]"
                    inputMode="numeric"
                    maxLength={4}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="1234"
                    value={code}
                  />
                </label>

                {codeError ? (
                  <p className="mt-3 font-semibold text-red-600">{codeError}</p>
                ) : null}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    className="h-14 rounded-full border border-zinc-200 bg-white text-base font-black"
                    onClick={() => setStep('phone')}
                    type="button"
                  >
                    Назад
                  </button>
                  <button className="h-14 rounded-full bg-[#04953f] text-base font-black text-white">
                    Войти
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      ) : (
        <section className="mt-8 grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgb(7_17_31/10%)]">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#07111f] text-2xl font-black text-white">
                {(user?.firstName || 'Г').slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="text-xl font-black">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="mt-1 font-semibold text-zinc-500">{user?.phone}</p>
              </div>
            </div>

            <div className="mt-7 rounded-[24px] bg-[#e8f7ef] p-5">
              <p className="text-sm font-bold text-[#006d2f]">Вы помогли на</p>
              <p className="mt-2 text-4xl font-black tracking-tight">
                {formatRub(totalDonated)}
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={saveProfile}>
              <label className="block">
                <span className="text-sm font-bold text-zinc-500">Имя</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) => setFirstName(event.target.value)}
                  value={firstName}
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-zinc-500">Фамилия</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 font-semibold outline-none focus:border-[#04953f]"
                  onChange={(event) => setLastName(event.target.value)}
                  value={lastName}
                />
              </label>
              <button className="h-12 w-full rounded-full bg-[#07111f] font-black text-white">
                Сохранить
              </button>
              <button
                className="h-12 w-full rounded-full border border-zinc-200 bg-white font-black text-zinc-700"
                onClick={signOut}
                type="button"
              >
                Выйти
              </button>
            </form>
          </aside>

          <div className="rounded-[28px] bg-white p-5 shadow-[0_24px_70px_rgb(7_17_31/10%)] md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#05863a]">
                  История
                </p>
                <h2 className="mt-2 text-2xl font-black">Ваши пожертвования</h2>
              </div>
              <a
                className="rounded-full bg-[#2f9f6b] px-5 py-3 text-sm font-black text-white"
                href="/how-to-help"
              >
                Поддержать сборы
              </a>
            </div>

            <div className="mt-6 space-y-3">
              {donations.length > 0 ? (
                donations.map((donation: any) => (
                  <article
                    className="rounded-[22px] border border-zinc-200 p-4"
                    key={donation.id}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-black">{donation.campaign_title}</p>
                        <p className="mt-1 text-sm font-semibold text-zinc-500">
                          {new Date(donation.created_at).toLocaleDateString('ru-RU')} ·{' '}
                          {methodLabel(donation.method)}
                        </p>
                        <p className="mt-2 text-sm text-zinc-500">
                          {donation.anonymous
                            ? 'Анонимное пожертвование'
                            : `${donation.donor_name}`}
                        </p>
                      </div>
                      <p className="shrink-0 text-2xl font-black">
                        {formatRub(donation.amount)}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[24px] bg-[#f4f5f7] p-6">
                  <p className="text-xl font-black">Начните помогать!</p>
                  <p className="mt-3 leading-7 text-zinc-600">
                    Выберите сбор и нажмите «Поддержать» — ваше пожертвование появится здесь.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

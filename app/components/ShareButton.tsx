'use client';

type ShareButtonProps = {
  title: string;
  path: string;
  className?: string;
};

export function ShareButton({ title, path, className }: ShareButtonProps) {
  function shareCampaign() {
    const url = new URL(path, window.location.origin).toString();
    const shareData = {
      title,
      text: `${title} — поддержать сбор МРОМ Соседи`,
      url,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => undefined);
      return;
    }

    navigator.clipboard?.writeText(url);
    alert('Ссылка на сбор скопирована');
  }

  return (
    <button className={className} onClick={shareCampaign} type="button">
      Поделиться
    </button>
  );
}

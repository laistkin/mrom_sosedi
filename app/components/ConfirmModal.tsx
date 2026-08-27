'use client';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Удалить',
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl">
        <h3 className="text-xl font-black">{title}</h3>
        {description ? (
          <p className="mt-2 leading-7 text-zinc-600">{description}</p>
        ) : null}

        <div className="mt-6 flex gap-3">
          <button
            className="flex-1 h-12 rounded-full border border-zinc-200 bg-white font-black"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="flex-1 h-12 rounded-full bg-red-600 text-lg font-black text-white"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

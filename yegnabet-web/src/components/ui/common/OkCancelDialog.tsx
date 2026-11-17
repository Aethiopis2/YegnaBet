import { AlertTriangle } from "lucide-react";

interface OkCancelDialogProps {
  open: boolean;
  title: string;
  message: string;
  okText?: string;
  cancelText?: string;
  busy?: boolean;
  variant?: "primary" | "danger";
  onOk: () => void;
  onCancel: () => void;
}

export function OkCancelDialog({
  open,
  title,
  message,
  okText = "OK",
  cancelText = "Cancel",
  busy = false,
  variant = "primary",
  onOk,
  onCancel,
}: OkCancelDialogProps) {
  if (!open) return null;

  const confirmClass = variant === "danger"
    ? "bg-red-600 hover:bg-red-500 focus-visible:ring-red-500"
    : "bg-yegna-700 hover:bg-yegna-600 focus-visible:ring-yegna-500";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={event => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="ok-cancel-dialog-title"
        aria-describedby="ok-cancel-dialog-message"
        className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#171d19]"
      >
        <div className="flex items-start gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-orange-500/10 text-orange-500">
            <AlertTriangle size={21} />
          </div>
          <div className="min-w-0">
            <h2 id="ok-cancel-dialog-title" className="text-base font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p id="ok-cancel-dialog-message" className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-white/5"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onOk}
            disabled={busy}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-[#171d19] ${confirmClass}`}
          >
            {busy ? "Please wait…" : okText}
          </button>
        </div>
      </section>
    </div>
  );
}

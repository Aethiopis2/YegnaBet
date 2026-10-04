import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void;
  onCancel: () => void;

  busy?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  busy = false,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        p-4
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) {
          onCancel();
        }
      }}
    >
      <div
        className="
          w-full max-w-md
          overflow-hidden
          rounded-2xl
          border border-zinc-700/60
          bg-zinc-900
          shadow-2xl shadow-black/40
          animate-in fade-in zoom-in-95
          duration-200
        "
      >
        {/* Header */}
        <div className="flex items-start gap-4 px-6 pt-6">
          <div
            className="
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-xl
              bg-orange-500/10
              text-orange-400
            "
          >
            <AlertTriangle size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-white">
              {title}
            </h2>

            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="
                absolute
                ml-[calc(100%-3rem)]
                mt-[-2.5rem]
                rounded-lg
                p-1.5
                text-zinc-500
                transition
                hover:bg-zinc-800
                hover:text-zinc-200
                disabled:pointer-events-none
                disabled:opacity-40
              "
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message */}
        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-zinc-400">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div
          className="
            flex items-center justify-end gap-3
            border-t border-zinc-800
            bg-zinc-950/40
            px-6 py-4
          "
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="
              rounded-xl
              px-4 py-2.5
              text-sm font-medium
              text-zinc-400
              transition
              hover:bg-zinc-800
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="
              rounded-xl
              bg-orange-500
              px-5 py-2.5
              text-sm font-semibold
              text-white
              shadow-lg shadow-orange-500/20
              transition
              hover:bg-orange-400
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {busy ? "Working..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
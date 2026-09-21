import { Check } from "lucide-react";
import { useEffect } from "react";

interface OkDialogProps {
  open: boolean;
  message: string;
  onOk: () => void;
}

export function OkDialog({
  open,
  message,
  onOk,
}: OkDialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Escape") {
        event.preventDefault();
        onOk();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOk]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/45 backdrop-blur-[3px]
        p-4
        animate-in fade-in duration-200
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOk();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="
          w-full max-w-sm
          rounded-2xl
          border border-white/10
          bg-white dark:bg-zinc-900
          shadow-2xl shadow-black/30
          px-7 py-8
          text-center
          animate-in
          zoom-in-95
          slide-in-from-bottom-2
          duration-300
          ease-out
        "
      >
        {/* Icon */}
        <div
          className="
            mx-auto mb-5
            flex h-14 w-14 items-center justify-center
            rounded-full
            bg-orange-500/10
            ring-8 ring-orange-500/5
          "
        >
          <Check
            size={27}
            strokeWidth={2.5}
            className="text-yegna-500 dark:text-orange-500"
          />
        </div>

        {/* Message */}
        <div
          className="
            whitespace-pre-line
            text-[15px]
            leading-6
            font-medium
            text-zinc-700
            dark:text-zinc-200
          "
        >
          {message}
        </div>

        {/* OK */}
        <button
          type="button"
          autoFocus
          onClick={onOk}
          className="
            mt-7
            w-full
            rounded-xl
            bg-yegna-500 dark:bg-orange-500
            px-5 py-3
            text-sm font-semibold
            text-white
            shadow-lg shadow-orange-500/20

            transition-all duration-150
            hover:bg-yegna-600 dark:hover:bg-orange-600
            hover:shadow-orange-500/30

            active:scale-[0.97]
            active:shadow-sm

            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-yegna-500
            dark:focus-visible:ring-orange-500
            focus-visible:ring-offset-2
            dark:focus-visible:ring-offset-zinc-900
          "
        >
          OK
        </button>
      </div>
    </div>
  );
}
import { CheckCircle, X } from "lucide-react";

interface ToastProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function Toast({
  open,
  message,
  onClose,
}: ToastProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        bottom-6
        right-4
        z-[60]
        w-[calc(100%-2rem)]
        max-w-sm
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-4
        shadow-xl
        dark:border-gray-700
        dark:bg-[#171a18]
        sm:right-6
      "
    >
      <div className="flex items-start gap-3">
        <CheckCircle
          className="
            mt-0.5
            h-5
            w-5
            shrink-0
            text-green-500
          "
        />

        <div className="min-w-0 flex-1">
          <p
            className="
              text-sm
              font-medium
              text-gray-900
              dark:text-white
            "
          >
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            rounded-lg
            p-1
            text-gray-400
            transition
            hover:bg-gray-100
            hover:text-gray-600
            dark:hover:bg-gray-800
            dark:hover:text-gray-200
          "
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
import {
  CalendarDays,
  MessageCircle,
} from "lucide-react";

interface ListingActionBarProps {
  onMessage: () => void;
  onRequestViewing: () => void;
}

export function ListingActionBar({
  onMessage,
  onRequestViewing,
}: ListingActionBarProps) {
  return (
    <div
      className="
        fixed
        inset-x-0
        bottom-0
        z-40
        border-t
        border-black/[0.06]
        bg-white/90
        p-3
        pb-[calc(0.75rem+env(safe-area-inset-bottom))]
        backdrop-blur-xl
        dark:border-white/[0.07]
        dark:bg-[#111]/90
        sm:static
        sm:mt-8
        sm:border
        sm:rounded-2xl
        sm:p-3
      "
    >
      <div className="mx-auto flex max-w-3xl gap-2">
        <button
          type="button"
          onClick={onMessage}
          className="
            flex
            h-12
            flex-1
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-yegna-200
            bg-yegna-50
            text-xs
            font-bold
            text-yegna-800
            transition-all
            hover:bg-yegna-100
            active:scale-[0.98]
            dark:border-yegna-900
            dark:bg-yegna-900/20
            dark:text-yegna-300
          "
        >
          <MessageCircle className="size-4" />
          Message Broker
        </button>

        <button
          type="button"
          onClick={onRequestViewing}
          className="
            flex
            h-12
            flex-[1.2]
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-yegna-700
            text-xs
            font-bold
            text-white
            shadow-lg
            shadow-yegna-700/15
            transition-all
            hover:bg-yegna-800
            active:scale-[0.98]
          "
        >
          <CalendarDays className="size-4" />
          Request Viewing
        </button>
      </div>

      <div className="mt-7"></div>
    </div>
  );
}
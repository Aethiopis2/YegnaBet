import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface MatchIntroProps {
  onStart: () => void;
}

export function MatchIntro({
  onStart,
}: MatchIntroProps) {
  return (
    <div className="mx-auto max-w-xl px-5 py-10 sm:py-16">
      <div
        className="
          relative
          overflow-hidden
          rounded-[2rem]
          border
          border-yegna-100
          bg-yegna-50/60
          p-6
          dark:border-yegna-900/40
          dark:bg-yegna-900/10
          sm:p-10
        "
      >
        <div
          className="
            absolute
            -right-16
            -top-16
            size-40
            rounded-full
            bg-yegna-500/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            grid
            size-14
            place-items-center
            rounded-2xl
            bg-yegna-700
            text-white
            shadow-lg
            shadow-yegna-700/20
          "
        >
          <Sparkles className="size-6" />
        </div>

        <h1
          className="
            relative
            mt-6
            text-3xl
            font-bold
            tracking-[-0.04em]
            text-gray-900
            dark:text-white
          "
        >
          Find your match.
        </h1>

        <p
          className="
            relative
            mt-3
            text-sm
            leading-6
            text-gray-500
            dark:text-gray-400
          "
        >
          Tell us what you're looking for
          and Yegna Bet will find properties
          that fit your needs.
        </p>

        <div
          className="
            relative
            mt-6
            space-y-3
            text-xs
            text-gray-500
            dark:text-gray-400
          "
        >
          <p>✓ Your preferences stay in one place</p>
          <p>✓ See how well each property matches</p>
          <p>✓ Discover properties you might miss</p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="
            relative
            mt-8
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-yegna-700
            text-sm
            font-bold
            text-white
            shadow-lg
            shadow-yegna-700/15
            transition-all
            hover:bg-yegna-800
            active:scale-[0.98]
          "
        >
          Find My Match

          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
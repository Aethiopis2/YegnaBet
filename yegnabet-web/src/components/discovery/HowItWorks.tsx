import {
  CalendarDays,
  Handshake,
  MessageCircle,
  Search,
} from "lucide-react";

const steps = [
  {
    title: "Search",
    description: "Find what you need easily",
    icon: Search,
  },
  {
    title: "Connect",
    description: "Talk to our experts instantly",
    icon: MessageCircle,
  },
  {
    title: "Visit",
    description: "Schedule a viewing that fits you",
    icon: CalendarDays,
  },
  {
    title: "Own",
    description: "Close the deal with confidence",
    icon: Handshake,
  },
];

export function HowItWorks() {
  return (
    <section className="mt-8">
      <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-gray-900 dark:text-white">
        How Yegna Bet Works
      </h2>

      <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center"
            >
              {index !== steps.length - 1 && (
                <div
                  className="
                    absolute
                    left-[calc(50%+1.6rem)]
                    right-[calc(-50%+1.6rem)]
                    top-6
                    hidden
                    h-px
                    border-t border-dashed
                    border-gray-300
                    sm:block
                    dark:border-white/15
                  "
                />
              )}

              <div
                className="
                  relative z-10
                  grid size-12
                  place-items-center
                  rounded-full
                  bg-yegna-50
                  text-yegna-700
                  dark:bg-yegna-900/30
                  dark:text-yegna-300
                "
              >
                <Icon className="size-5" />
              </div>

              <h3 className="mt-3 text-[11px] font-semibold text-gray-800 dark:text-gray-200 sm:text-xs">
                {step.title}
              </h3>

              <p className="mt-1 hidden max-w-28 text-[10px] leading-4 text-gray-400 sm:block">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
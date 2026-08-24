import {
  ArrowRight,
  Crown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

const advertisements = [
  {
    id: 1,
    title: "Premium Properties",
    description:
      "Exclusive listings from trusted brokers.",
    image: "/images/banners/premium.jpg",
    icon: Crown,
    action: "Explore Premium",
  },
  {
    id: 2,
    title: "Verified Brokers",
    description:
      "Deal with professionals you can trust.",
    image: "/images/banners/verified.jpg",
    icon: ShieldCheck,
    action: "Meet Brokers",
  },
  {
    id: 3,
    title: "Find Your Match",
    description:
      "Tell us what you need and we'll do the searching.",
    image: "/images/banners/match.jpg",
    icon: Sparkles,
    action: "Find My Match",
  },
];

export function AdvertisementCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) =>
        current === advertisements.length - 1
          ? 0
          : current + 1
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const advertisement =
    advertisements[active];

  const Icon = advertisement.icon;

  return (
    <section className="mt-8">
      <div
        className="
          relative min-h-32 overflow-hidden
          rounded-2xl
          bg-yegna-900
          text-white
        "
      >
        <img
          src={advertisement.image}
          alt=""
          className="
            absolute inset-0
            size-full object-cover
            opacity-45
            transition-opacity duration-500
          "
        />

        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-yegna-950
            via-yegna-900/80
            to-transparent
          "
        />

        <div className="relative flex min-h-32 items-center gap-4 px-5 py-5">
          <div
            className="
              grid size-12 shrink-0
              place-items-center
              rounded-full
              border border-white/20
              bg-white/10
              backdrop-blur-sm
            "
          >
            <Icon className="size-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold sm:text-base">
              {advertisement.title}
            </h3>

            <p className="mt-1 max-w-sm text-[11px] leading-4 text-white/65 sm:text-xs">
              {advertisement.description}
            </p>
          </div>

          <button
            type="button"
            className="
              hidden shrink-0
              items-center gap-2
              rounded-full
              bg-white
              px-4 py-2.5
              text-xs font-semibold
              text-yegna-900
              transition-transform
              hover:scale-105
              active:scale-95
              sm:inline-flex
            "
          >
            {advertisement.action}

            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {advertisements.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show advertisement ${index + 1}`}
            onClick={() => setActive(index)}
            className={`
              h-1.5 rounded-full
              transition-all duration-300
              ${
                index === active
                  ? "w-5 bg-yegna-700 dark:bg-yegna-400"
                  : "w-1.5 bg-gray-200 dark:bg-white/15"
              }
            `}
          />
        ))}
      </div>
    </section>
  );
}
import {
  BadgeCheck,
  ChevronRight,
  UserRound,
} from "lucide-react";

import type { ListingBroker as Broker } from "../../types/listings";

interface ListingBrokerProps {
  broker?: Broker;
}

export function ListingBroker({
  broker,
}: ListingBrokerProps) {
  if (!broker) {
    return null;
  }

  return (
    <section className="px-4 pt-7 sm:px-0">
      <h2 className="text-sm font-bold text-gray-900 dark:text-white">
        Listed by
      </h2>

      <button
        type="button"
        className="
          mt-3
          flex
          w-full
          items-center
          gap-3
          rounded-2xl
          border
          border-black/[0.05]
          bg-white
          p-3.5
          text-left
          transition-all
          hover:border-yegna-200
          hover:shadow-sm
          dark:border-white/[0.06]
          dark:bg-white/[0.035]
          dark:hover:border-yegna-900
        "
      >
        {broker.avatar ? (
          <img
            src={broker.avatar}
            alt=""
            className="
              size-12
              rounded-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              grid
              size-12
              place-items-center
              rounded-full
              bg-yegna-50
              text-yegna-700
              dark:bg-yegna-900/20
              dark:text-yegna-300
            "
          >
            <UserRound className="size-5" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {broker.name}
            </p>

            {broker.verified && (
              <BadgeCheck className="size-4 shrink-0 text-yegna-600 dark:text-yegna-400" />
            )}
          </div>

          <p className="mt-0.5 text-[10px] text-gray-400">
            {broker.listingsCount ?? 0} active listings
          </p>
        </div>

        <ChevronRight className="size-4 text-gray-400" />
      </button>
    </section>
  );
}
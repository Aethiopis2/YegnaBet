import {
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

interface ListingVerificationProps {
  verified?: boolean;
}

export function ListingVerification({
  verified,
}: ListingVerificationProps) {
  return (
    <section className="px-4 pt-7 sm:px-0">
      <div
        className="
          flex
          gap-3
          rounded-2xl
          border
          border-yegna-100
          bg-yegna-50/70
          p-4
          dark:border-yegna-900/40
          dark:bg-yegna-900/15
        "
      >
        <div
          className="
            grid
            size-10
            shrink-0
            place-items-center
            rounded-xl
            bg-white
            text-yegna-700
            shadow-sm
            dark:bg-white/[0.06]
            dark:text-yegna-300
          "
        >
          {verified ? (
            <BadgeCheck className="size-5" />
          ) : (
            <ShieldCheck className="size-5" />
          )}
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white">
            {verified
              ? "Verified by Yegna Bet"
              : "Listing information"}
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-gray-500 dark:text-gray-400">
            {verified
              ? "This listing has been reviewed and verified by our team."
              : "Some property information may still be awaiting verification."}
          </p>
        </div>
      </div>
    </section>
  );
}
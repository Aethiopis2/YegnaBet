import {
  Flame,
  Heart,
  Search,
  Verified,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { QuickActionItem } from "./QuickActionItem";

interface QuickActionMenuProps {
  open: boolean;
}

export function QuickActionMenu({
  open,
}: QuickActionMenuProps) {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Search,
      title: "Find my match",
      description:
        "Find properties matching your needs",
      onClick: () =>
        navigate("/find-my-match"),
    },
    {
      icon: Verified,
      title: "Verified Listings",
      description:
        "Browse listings that have been verified by our team",
      onClick: () =>
        navigate("/explore?verified=true"),
    },
    {
      icon: Heart,
      title: "Saved",
      description:
        "Your favorite properties",
      onClick: () =>
        navigate("/requests/alert"),
    },
    {
      icon: Flame,
      title: "Trending",
      description:
        "See what's popular right now",
      onClick: () =>
        navigate("/explore?trending=trending"),
    },
  ];

  return (
    <div
      className={`
        absolute
        bottom-full
        right-0
        mb-4
        w-[min(320px,calc(100vw-2rem))]
        origin-bottom-right
        space-y-2
        transition-all
        duration-300

        ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }
      `}
    >
      <div
        className="
          mb-3
          px-2
          text-right
        "
      >
        <p className="text-xs font-semibold text-gray-900 dark:text-white">
          What can we help you find?
        </p>

        <p className="mt-0.5 text-[10px] text-gray-400">
          Choose an action
        </p>
      </div>

      {actions.map((action, index) => (
        <div
          key={action.title}
          className="transition-all duration-300"
          style={{
            transitionDelay: open
              ? `${index * 45}ms`
              : "0ms",
          }}
        >
          <QuickActionItem {...action} />
        </div>
      ))}
    </div>
  );
}
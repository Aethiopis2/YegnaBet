import { Plus } from "lucide-react";

interface QuickActionButtonProps {
  open: boolean;
  onClick: () => void;
}

export function QuickActionButton({
  open,
  onClick,
}: QuickActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        open
          ? "Close quick actions"
          : "Open quick actions"
      }
      aria-expanded={open}
      className="
        relative
        grid
        size-14
        place-items-center
        rounded-full
        bg-yegna-700
        text-white
        shadow-xl
        shadow-yegna-900/20
        transition-all
        duration-300
        hover:scale-105
        active:scale-95
      "
    >
      <Plus
        className={`
          size-6
          transition-transform
          duration-300
          ${open ? "rotate-45" : ""}
        `}
      />
    </button>
  );
}
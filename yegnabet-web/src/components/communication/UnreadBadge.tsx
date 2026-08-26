interface UnreadBadgeProps {
  count?: number;
}

export function UnreadBadge({
  count = 1,
}: UnreadBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      className="
        inline-flex
        min-w-5
        items-center
        justify-center
        rounded-full
        bg-yegna-700
        px-1.5
        py-0.5
        text-[9px]
        font-bold
        text-white
      "
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
import { UserRound } from "lucide-react";

import { cn } from "../../lib/cn";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({
  src,
  alt = "",
  name,
  size = "md",
  className,
}: AvatarProps) {
  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "";

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        "bg-yegna-100 text-yegna-700",
        "dark:bg-yegna-900/50 dark:text-yegna-200",

        size === "sm" && "size-8",
        size === "md" && "size-10",
        size === "lg" && "size-12",

        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="size-full object-cover"
        />
      ) : initials ? (
        <span className="grid size-full place-items-center text-xs font-semibold">
          {initials}
        </span>
      ) : (
        <UserRound className="absolute inset-0 m-auto size-1/2" />
      )}
    </div>
  );
}
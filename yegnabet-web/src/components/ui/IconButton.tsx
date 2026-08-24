import type { ButtonHTMLAttributes, ReactNode } from "react"
import Button from "./Button";
import { cn } from "../../lib/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  label: string;
  active?: boolean;
}

const IconButton = ({children, label, active=false, className, ...props}: IconButtonProps) => {
  return (
    <Button
      variant="ghost"
      type="button"
      aria-label={label}
      title={label}
      size="sm"
      className={cn(
        "relative grid size-11 place-items-center rounded-full",
        "transition-all duration-200",
        "active:scale-90",
        "focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-yegna-500/40",

        active
          ? "bg-yegna-50 text-yegna-700 dark:bg-yegna-900/40 dark:text-yegna-300"
          : "text-gray-600 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/8",

        className
      )}
      {...props}
      >
      {children}
    </Button>
  );
}

export default IconButton
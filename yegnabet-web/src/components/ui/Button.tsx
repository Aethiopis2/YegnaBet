import { type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn';

type ButtonVariant = | "primary" | "secondary" | "ghost" | "soft";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: "sm" | "md" | "lg";
}

const Button = ({
    variant ="primary", 
    size = "md", 
    className, 
    children, 
    ...props}: ButtonProps) => {
  return (
    <button className={cn(
        "inline-flex items-center justify-center gap-2",
        "rounded-xl font-medium",
        "transition-all duration-200",
        "active:scale-[0.97]",
        "focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-yegna-500/40",

        variant === "primary" &&
          "bg-yegna-700 text-white shadow-sm hover:bg-yegna-800",

        variant === "secondary" &&
          "border border-black/8 bg-white text-gray-800 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:hover:bg-white/10",

        variant === "soft" &&
          "bg-yegna-50 text-yegna-800 hover:bg-yegna-100 dark:bg-yegna-900/30 dark:text-yegna-200 dark:hover:bg-yegna-900/50",

        variant === "ghost" &&
          "text-gray-600 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/8",

        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-sm",
        size === "lg" && "h-12 px-5",
      
        className
    )}
    {...props}
    >
        {children}
    </button>
  )
}

export default Button
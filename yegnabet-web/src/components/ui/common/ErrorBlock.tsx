import { CircleAlert } from "lucide-react";

interface Props {
    message: string;
}

const ErrorBlock = ({message}: Props) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm 
        font-medium animate-in fade-in slide-in-from-top-1 duration-300 bg-red-50 
        text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/60">
        <div className="relative flex h-9 w-9 shrink-0 items-center 
            justify-center rounded-lg bg-red-100 dark:bg-red-900/40">
            <span className="absolute inset-0 rounded-lg bg-red-400/20 animate-ping" />

            <CircleAlert
                size={21}
                strokeWidth={2}
                className="relative z-10 text-red-600 dark:text-red-400"
            />
        </div>

        <span className="leading-5">
            {message}
        </span>
        </div>
  )
}

export default ErrorBlock
import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <main
      className={`mx-auto w-full max-w-7xl px-5 pb-28 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </main>
  );
}
import type { ReactNode } from "react";

import { AppHeader } from "../navigation/AppHeader";
import { BottomNavigation } from "./BottomNavigation";
import { QuickActionSheet } from "../quick-actions/QuickActionSheet";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({
  children,
}: AppShellProps) {
  return (
    <div
      className="
        min-h-screen
        bg-[#f7f8f6]
        text-gray-900
        transition-colors duration-300
        dark:bg-[#101512]
        dark:text-gray-100
      "
    >
      <AppHeader />

      {children}

      <BottomNavigation />
    </div>
  );
}
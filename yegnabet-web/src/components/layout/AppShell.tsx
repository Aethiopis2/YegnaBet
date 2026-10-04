import type { ReactNode } from "react";

import { AppHeader } from "../navigation/AppHeader";
import { BottomNavigation } from "./BottomNavigation";
import type { UserProfile } from "../../types/customer/profile";
import type { ListingMode } from "../../types/customer/listings";

interface AppShellProps {
  currentUser: UserProfile | null;
  mode?: ListingMode;
  children: ReactNode;
}

export function AppShell({ currentUser, mode, children }: AppShellProps) {
  
  return (
    <div className="min-h-screen bg-[#f7f8f6] text-gray-900 
      transition-colors duration-300 dark:bg-[#101512] dark:text-gray-100">
        
      <AppHeader currentUser={currentUser} />

      {children}

      <BottomNavigation currentUser={currentUser} mode={mode} />
    </div>
  );
}
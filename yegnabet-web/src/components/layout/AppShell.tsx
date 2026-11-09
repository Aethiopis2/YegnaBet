import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { AppHeader } from "../navigation/AppHeader";
import { BottomNavigation } from "./BottomNavigation";
import type { ListingMode } from "../../types/customer/listings";
import LogInModal from "../ui/common/LogInModal";
import { useAuth } from "../../types/auth/authContext";
import { getCustomerAuth } from "../../lib/customer/customerApi";
import type { AuthUser } from "../../types/auth/authTypes";
import { useLocation } from "react-router-dom";

interface AppShellProps {
  children: ReactNode;
}

export type AppContextType = {
  user: AuthUser | null;
  listingMode: ListingMode;
  setListingMode: React.Dispatch<React.SetStateAction<ListingMode>>;
  openSigninDlg: boolean;
  setOpenSigninDlg: React.Dispatch<React.SetStateAction<boolean>>;
  token?: string;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() : AppContextType {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext must be used within AppContext.Provider"
    );
  }

  return context;
}

export function AppShell({ children }: AppShellProps) {
  const { accessToken } = useAuth();
  
  const location = useLocation();


  const [token, setToken] = useState("");
  const [openSigninDlg, setOpenSigninDlg] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(
    location.state?.user ?? null
  );
  const [listingMode, setListingMode] = useState<ListingMode>(
    location.state?.listingMode ?? "Buy"
  );

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const loadLoggedUser = async () => {
      try {
        const u = await getCustomerAuth(accessToken);
        setUser(u);
      } catch (err) {
        console.error(err);
      }
    };

    loadLoggedUser();
  }, [accessToken]);
  
  return (
    <AppContext.Provider value={{user, listingMode, setListingMode, 
      openSigninDlg, setOpenSigninDlg, token,
    }}>
      <div className="min-h-screen bg-[#f7f8f6] text-gray-900 
        transition-colors duration-300 dark:bg-[#101512] dark:text-gray-100">
          
        <AppHeader user={user} 
          openSigninDlg={openSigninDlg}
          setOpenSigninDlg={setOpenSigninDlg}
          mode={listingMode} />

        {children}

        <BottomNavigation user={user} mode={listingMode} 
          onLogin={() => setOpenSigninDlg(!openSigninDlg)} />
        <LogInModal 
          open={openSigninDlg}
          setOpen={setOpenSigninDlg}
          setUser={setUser} 
          setToken={setToken}
        />
      </div>
    </AppContext.Provider>
  );
}
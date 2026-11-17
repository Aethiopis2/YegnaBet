import React, { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { AppHeader } from "../navigation/AppHeader";
import { BottomNavigation } from "./BottomNavigation";
import type { ListingMode } from "../../types/customer/listings";
import LogInModal from "../ui/common/LogInModal";
import { useAuth } from "../../types/auth/authStore";
import type { AuthUser } from "../../types/auth/authTypes";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface AppShellProps {
  children: ReactNode;
}

export interface MessageRecipientRequest {
  id: number;
  fullName: string;
  role: "Employee";
  avatar?: string;
}

export interface MessageOpenRequest {
  requestId: number;
  recipient: MessageRecipientRequest;
}

export type AppContextType = {
  user: AuthUser | null;
  listingMode: ListingMode;
  setListingMode: React.Dispatch<React.SetStateAction<ListingMode>>;
  openSigninDlg: boolean;
  setOpenSigninDlg: React.Dispatch<React.SetStateAction<boolean>>;
  token?: string;
  messageOpenRequest: MessageOpenRequest | null;
  requestMessage: (recipient: MessageRecipientRequest) => void;
  onMessageRequestHandled: (requestId: number) => void;
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
  const { accessToken, user: authUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [openSigninDlg, setOpenSigninDlg] = useState(false);
  const [messageOpenRequest, setMessageOpenRequest] = useState<MessageOpenRequest | null>(null);
  const messageRequestSequence = useRef(0);

  const requestMessage = useCallback((recipient: MessageRecipientRequest) => {
    setMessageOpenRequest({
      requestId: ++messageRequestSequence.current,
      recipient,
    });
  }, []);

  const onMessageRequestHandled = useCallback((requestId: number) => {
    setMessageOpenRequest(current => current?.requestId === requestId ? null : current);
  }, []);
  const user = authUser ?? (accessToken ? (location.state?.user as AuthUser | undefined) ?? null : null);
  const [listingMode, setListingMode] = useState<ListingMode>(
    location.state?.listingMode ?? "Buy"
  );

  useEffect(() => {
    const isStaff = authUser?.role === "Employee" || authUser?.role === "Owner";
    if (!isStaff) return;

    const pathname = location.pathname;
    if (pathname === "/") {
      navigate(authUser.role === "Employee" ? "/employee" : "/owner", { replace: true });
      return;
    }
    const isStaffPage = pathname === "/explore" ||
      pathname === "/locations" ||
      /^\/listing\/\d+$/.test(pathname) ||
      pathname === "/owner" || pathname.startsWith("/owner/");
    if (isStaffPage) return;

    void logout();
    navigate("/", { replace: true, state: null });
  }, [authUser?.role, location.pathname, logout, navigate]);
  
  return (
    <AppContext.Provider value={{
      user,
      listingMode,
      setListingMode,
      openSigninDlg,
      setOpenSigninDlg,
      token: accessToken ?? undefined,
      messageOpenRequest,
      requestMessage,
      onMessageRequestHandled,
    }}>
      <div className="min-h-screen bg-[#f7f8f6] text-gray-900 
        transition-colors duration-300 dark:bg-[#101512] dark:text-gray-100">
          
        <AppHeader
          user={user}
          openSigninDlg={openSigninDlg}
          setOpenSigninDlg={setOpenSigninDlg}
          mode={listingMode}
          messageOpenRequest={messageOpenRequest}
          onMessageRequestHandled={onMessageRequestHandled}
        />

        {children}

        {user?.role !== "Employee" && user?.role !== "Owner" && <> <BottomNavigation user={user} mode={listingMode} 
          onLogin={() => setOpenSigninDlg(!openSigninDlg)} />
        <LogInModal 
          open={openSigninDlg}
          setOpen={setOpenSigninDlg}
        /></>}
      </div>
    </AppContext.Provider>
  );
}
import { EmployeeSidebar } from "./EmployeeSidebar";
import { EmployeeHeader } from "./EmployeeHeader";
import { getCustomerAuth } from "../../lib/customer/customerApi";
import { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser } from "../../types/auth/authTypes";
import { useAuth } from "../../types/auth/authContext";

interface EmployeeShellProps {
  children: React.ReactNode;
}

export type AppContextType = {
  user: AuthUser | null;
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

export function EmployeeShell({
  children,
}: EmployeeShellProps) {

  const { accessToken } = useAuth();

  const [user, setUser] = useState<AuthUser | null>(null);

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
    <AppContext.Provider value={{ user, token: String(accessToken) }}>
      <div
        className="
          min-h-screen
          bg-gray-50
          text-gray-900
          transition-colors

          dark:bg-[#0b0f0d]
          dark:text-white
        "
      >
        <EmployeeSidebar />

        <div
          className="
            min-h-screen
            lg:pl-64
          "
        >
          <EmployeeHeader user={user} />

          <main className="px-4 py-5 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
}
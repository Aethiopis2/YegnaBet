import { EmployeeSidebar } from "./EmployeeSidebar";
import { EmployeeHeader } from "./EmployeeHeader";
import { createContext, useContext } from "react";
import type { AuthUser } from "../../types/auth/authTypes";
import { useAuth } from "../../types/auth/authStore";

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

  const { accessToken, user } = useAuth();


  return (
    <AppContext.Provider value={{ user, token: accessToken ?? undefined }}>
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
        <EmployeeSidebar user={user ?? null} />

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

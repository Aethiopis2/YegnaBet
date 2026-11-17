import { useEffect, useState } from "react";

import type {
  AuthUser,
  LoginRequest,
} from "./authTypes";
import { AuthContext, type ReactNode } from "./authStore";
import type { LoginResponse } from "./authTypes";
import { API } from "../api";

interface AuthProviderProps {
  children: ReactNode;
}
const API_URL = "http://localhost:5150";
const CUSTOMER_SESSION_KEY = "yegnabet.customer-session";
const STAFF_SESSION_KEY = "yegnabet.staff-session";

function clearStoredCustomerSession() {
  try {
    sessionStorage.removeItem(CUSTOMER_SESSION_KEY);
    sessionStorage.removeItem(STAFF_SESSION_KEY);
  } catch {
    // In-memory sign-out still works when browser storage is unavailable.
  }
}

interface StoredCustomerSession {
  accessToken: string;
  user: AuthUser;
}

function readCustomerSession(): StoredCustomerSession | null {
  try {
    const value = sessionStorage.getItem(CUSTOMER_SESSION_KEY) ??
      sessionStorage.getItem(STAFF_SESSION_KEY);
    if (!value) return null;
    const session = JSON.parse(value) as StoredCustomerSession;
    return session.accessToken && session.user?.role ? session : null;
  } catch {
    clearStoredCustomerSession();
    return null;
  }
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [initialSession] = useState(readCustomerSession);
  const [user, setUser] = useState<AuthUser | null>(initialSession?.user ?? null);
  const [accessToken, setAccessToken] = useState<string | null>(initialSession?.accessToken ?? null);

  const [isLoading, setIsLoading] =
    useState(false);

  useEffect(() => {
    if (initialSession?.accessToken) {
      API.defaults.headers.common.Authorization = `Bearer ${initialSession.accessToken}`;
    }
  }, [initialSession]);

  const login = async (
    request: LoginRequest
  ): Promise<AuthUser> => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        let message =
          "Invalid phone number or password.";

        try {
          const error = await response.json();

          if (error?.message) {
            message = error.message;
          }
        } catch {
          // Ignore invalid error response.
        }

        throw new Error(message);
      }

      const data: LoginResponse =
        await response.json();

      API.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      setAccessToken(data.accessToken);
      setUser(data.user);
      if (data.user.role === "Customer") {
        try {
          sessionStorage.removeItem(STAFF_SESSION_KEY);
          sessionStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify({
            accessToken: data.accessToken,
            user: data.user,
          } satisfies StoredCustomerSession));
        } catch {
          // Keep the current tab authenticated even if storage is unavailable.
        }
      } else {
        try {
          sessionStorage.removeItem(CUSTOMER_SESSION_KEY);
          sessionStorage.setItem(STAFF_SESSION_KEY, JSON.stringify({
            accessToken: data.accessToken,
            user: data.user,
          } satisfies StoredCustomerSession));
        } catch {
          // Keep the current tab authenticated if storage is unavailable.
        }
      }

      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const tokenToRevoke = accessToken;

    // Clear the customer session immediately; server cleanup is best-effort.
    delete API.defaults.headers.common.Authorization;
    clearStoredCustomerSession();
    setAccessToken(null);
    setUser(null);

    if (tokenToRevoke) {
      void fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${tokenToRevoke}` },
          credentials: "include",
        }).catch(() => {
          // Local sign-out must not depend on the API being available.
        });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,

        isAuthenticated:
          user !== null &&
          accessToken !== null,

        isLoading,

        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

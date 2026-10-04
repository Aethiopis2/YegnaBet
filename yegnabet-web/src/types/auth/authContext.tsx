import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
} from "./authTypes";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  login: (request: LoginRequest) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const API_URL = "http://localhost:5150";

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [accessToken, setAccessToken] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

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

      setAccessToken(data.accessToken);
      setUser(data.user);

      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}
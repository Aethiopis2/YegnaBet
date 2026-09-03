import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AuthUser,
  LoginRequest,
} from "./authTypes";

import {
  login as loginRequest,
  logout as logoutRequest,
  validateSession,
} from "./authService";

interface AuthContextValue {
  user: AuthUser | null;
  sessionId: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    request: LoginRequest
  ) => Promise<AuthUser>;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

const SESSION_KEY = "yegnabet.sessionId";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [sessionId, setSessionId] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const existingSession =
      sessionStorage.getItem(SESSION_KEY);

    if (!existingSession) {
      setIsLoading(false);
      return;
    }

    setSessionId(existingSession);

    validateSession(existingSession)
      .then((result) => {
        setUser(result.user);

        if (result.sessionId) {
          sessionStorage.setItem(
            SESSION_KEY,
            result.sessionId
          );

          setSessionId(result.sessionId);
        }
      })
      .catch(() => {
        sessionStorage.removeItem(
          SESSION_KEY
        );

        setSessionId(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function login(
    request: LoginRequest
  ) {
    const result =
      await loginRequest(request);

    sessionStorage.setItem(
      SESSION_KEY,
      result.sessionId
    );

    setSessionId(result.sessionId);
    setUser(result.user);

    return result.user;
  }

  async function logout() {
    const currentSession = sessionId;

    setUser(null);
    setSessionId(null);

    sessionStorage.removeItem(
      SESSION_KEY
    );

    if (currentSession) {
      await logoutRequest(currentSession);
    }
  }

  const value = useMemo(
    () => ({
      user,
      sessionId,

      isAuthenticated:
        !!user && !!sessionId,

      isLoading,

      login,
      logout,
    }),
    [
      user,
      sessionId,
      isLoading,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../types/auth/authContext";
import type { UserRole } from "../types/auth/authTypes"

interface RequireAuthProps {
  roles?: UserRole[];
}

function getHomeForRole(role: UserRole): string {
  switch (role) {
    case "Provider":
      return "/provider";

    case "Employee":
      return "/employee";

    case "Owner":
      return "/owner";

    case "Customer":
    default:
      return "/";
  }
}

export function RequireAuth({
  roles,
}: RequireAuthProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
  } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    const returnUrl =
      location.pathname +
      location.search +
      location.hash;

    return (
      <Navigate
        to={`/login?returnUrl=${encodeURIComponent(
          returnUrl
        )}`}
        replace
      />
    );
  }

  if (
    roles &&
    !roles.includes(user.role)
  ) {
    return (
      <Navigate
        to={getHomeForRole(user.role)}
        replace
      />
    );
  }

  return <Outlet />;
}
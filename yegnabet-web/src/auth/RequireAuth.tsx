import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { UserRole } from "./authTypes";

interface RequireAuthProps {
    roles?: UserRole[];
}

function getRoleHome(role: UserRole) {
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

export function RequireAuth({ roles }: RequireAuthProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        const returnUrl =
            location.pathname +
            location.search +
            location.hash;

        return (
            <Navigate
                to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
                replace
            />
        );
    }

    if (roles && !roles.includes(user.role)) {
        return (
            <Navigate
                to={getRoleHome(user.role)}
                replace
            />
        );
    }

    return <Outlet />;
}
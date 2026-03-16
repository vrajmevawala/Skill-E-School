import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    allowedRoles?: string[];
    redirectPath?: string;
}

const ProtectedRoute = ({
    allowedRoles,
    redirectPath = "/login"
}: ProtectedRouteProps) => {
    const { user, isLoading, token } = useAuthStore();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!token || !user) {
        return <Navigate to={redirectPath} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Services/Auth/AuthContext";
import { Routes } from "../Routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return (
      <Navigate to={Routes.AUTHENTICATE} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;

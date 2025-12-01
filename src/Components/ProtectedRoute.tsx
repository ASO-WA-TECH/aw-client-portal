import { Navigate } from "react-router-dom";
import { useAuth } from "../Services/Auth/AuthContext";
import { Routes } from "../Routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to={Routes.AUTHENTICATE} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;

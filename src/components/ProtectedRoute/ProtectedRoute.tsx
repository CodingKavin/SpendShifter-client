import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import {type FC, type ReactNode} from "react";
import Typography from "../Typography/Typography";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, isRecovering } = useAuth();

  if (loading) {
    return (
      <div className="loading-text">
        <Typography variant="p2">Loading...</Typography>
      </div>
    );
  }

  if (isRecovering) {
    return <Navigate to="/update-password" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

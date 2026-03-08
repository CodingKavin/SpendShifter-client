import { useAuth } from "../../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import Typography from "../Typography/Typography.jsx";

const PublicOnlyRoute = ({ children }) => {
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

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicOnlyRoute;

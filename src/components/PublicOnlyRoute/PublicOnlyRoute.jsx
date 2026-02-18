import { useAuth } from "../../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import Typography from "../Typography/Typography.jsx";

const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Typography className="loading-text" variant="p2" style={{ padding: "16px" }}>Loading...</Typography>
    }
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default PublicOnlyRoute;
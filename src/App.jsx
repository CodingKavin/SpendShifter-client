import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute/PublicOnlyRoute.jsx";
// import Navigation from "./components/Navigation/Navigation.jsx";
import Footer from "./components/Footer/Footer.jsx";
// import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
// import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
// import ExpensesPage from "./pages/ExpensesPage/ExpensesPage.jsx";
// import ChartsPage from "./pages/ChartsPage/ChartsPage.jsx";
import Typography from "./components/Typography/Typography.jsx";
import "./App.scss"

const App = () => {

    const HomeRedirect = () => {
        const { isAuthenticated, loading } = useAuth();
        if (loading) return <div className="loading-text"><Typography variant="p2">Loading...</Typography></div>;
        return isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />;
    };


    return (
        <AuthProvider>
            <BrowserRouter>
                {/* <Navigation /> */}
                <main>
                    <Routes>
                        <Route path="/" element={<HomeRedirect />} />
                        {/* <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} /> */}
                        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
                        {/* <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
                        <Route path="/charts" element={<ProtectedRoute><ChartsPage /></ProtectedRoute>} /> */}
                    </Routes>
                </main>

                <Footer />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
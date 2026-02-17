import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUpdate } from "./utils/apiRequests.js";
import Navigation from "./components/Navigation/Navigation.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
import ExpensesPage from "./pages/ExpensesPage/ExpensesPage.jsx";
import ChartsPage from "./pages/ChartsPage/ChartsPage.jsx";

const App = () => {

    useEffect(() => {
        const fetchInitialData = async () => {
            try {

            } catch (error) {
                console.log(error)
            }
        }
        fetchInitialData();
    }, []);

    return (
        <BrowserRouter>
            <Navigation />
            <main>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/expenses" element={<ExpensesPage />} />
                    <Route path="/charts" element={<ChartsPage />} />
                </Routes>
            </main>

            <Footer />
        </BrowserRouter>
    );
}

export default App;
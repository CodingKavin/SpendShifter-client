import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const validateUser = async () => {
        try {
            const response = await api.get("/auth/validate");
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            await api.post("/auth/login", credentials);
            await validateUser();
        } catch (error) {
            throw error.response?.data?.message || "Login failed";
        }
    };

    const logout = async () => {
        await api.post("/auth/logout");

        setUser(null);
        setIsAuthenticated(false);
    };

    const signup = async (userData) => {
        try {
            await api.post("/auth/signup", userData)
            await validateUser();
        } catch (error) {
            throw error.response?.data?.message || "Signup failed";
        }
    }

    useEffect(() => {
        validateUser();
    }, []); //keeps user logged in on refresh

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                login,
                logout,
                signup
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
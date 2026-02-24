import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            const currentUser = data.session?.user || null;
            setUser(currentUser);
            setIsAuthenticated(!!currentUser);
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user || null;
            setUser(currentUser);
            setIsAuthenticated(!!currentUser);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const signup = async ({ email, password, options = {} }) => {
        const { data, error } = await supabase.auth.signUp({ email, password, ...options });
        if (error) throw error;
        setUser(data.user);
        return data.user;
    };

    const login = async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
        setIsAuthenticated(!!data.user);
        return data.user;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setIsAuthenticated(false);
    };

    const resetPassword = async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + "/update-password",
        });
        if (error) throw error;
        return data;
    };

    const updatePassword = async (newPassword) => {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;
        setUser(data.user);
        setIsAuthenticated(!!data.user);
        return data.user;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, signup, login, logout, resetPassword, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
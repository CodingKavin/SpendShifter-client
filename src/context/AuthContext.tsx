import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../utils/supabase";
import { type User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isRecovering: boolean;
  signup: (params: {email: string; password: string; options?: any}) => Promise<User | null>;
  login: (params: { email: string; password: string }) => Promise<User | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<object>;
  updatePassword: (newPassword: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRecovering, setIsRecovering] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user || null;
      setUser(currentUser);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser((prevUser) =>
        prevUser?.id !== currentUser?.id ? currentUser : prevUser,
      );

      if (event === "PASSWORD_RECOVERY") {
        setIsRecovering(true);
      }

      if (event === "SIGNED_OUT" || event === "USER_UPDATED" || event === "SIGNED_IN") {
          setIsRecovering(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup: AuthContextType['signup'] = async ({ email, password, options = {} }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: options.data || {},
        emailRedirectTo: options.redirectTo,
      },
    });
    if (error) throw error;
    return data.user;
  };

  const login: AuthContextType['login'] = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  };

  const logout: AuthContextType['logout'] = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword: AuthContextType['resetPassword'] = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/update-password",
    });
    if (error) throw error;
    return data;
  };

  const updatePassword: AuthContextType['updatePassword'] = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        isRecovering,
        signup,
        login,
        logout,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be within an AuthProvider");
  }
  return context;
};

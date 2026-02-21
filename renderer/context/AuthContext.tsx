"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

type Candidate = {
  id: string;
  email: string;
  name: string;
  token?: string;
};

type AuthContextType = {
  user: Candidate | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: Candidate) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    try {
      const stored = localStorage.getItem("axoma_candidate");

      if (stored) {
        const parsed: Candidate = JSON.parse(stored);
        setUser(parsed);
      }
    } catch (err) {
      console.error("Candidate auth hydration error:", err);
      localStorage.removeItem("axoma_candidate");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((data: Candidate) => {
    setUser(data);
    localStorage.setItem("axoma_candidate", JSON.stringify(data));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("axoma_candidate");
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
};

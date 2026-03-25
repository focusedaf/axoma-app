"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { fetchCandidateMe, logoutCandidate } from "@/lib/api";

type Candidate = {
  id: string;
  email: string;
  role: "candidate";
  firstName?: string; 
  lastName?: string; 
};

type AuthContextType = {
  user: Candidate | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: Candidate) => void;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [user, setUser] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

 
  const fetchMe = useCallback(async () => {
    try {
      const res = await fetchCandidateMe();
      setUser(res.data.user);
      localStorage.setItem("axoma_candidate", JSON.stringify(res.data.user));
    } catch {
      setUser(null);
      localStorage.removeItem("axoma_candidate");
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await fetchMe();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [fetchMe]);

  const login = useCallback((data: Candidate) => {
    setUser(data);
    localStorage.setItem("axoma_candidate", JSON.stringify(data));
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem("axoma_candidate");

    try {
      await logoutCandidate();
    } catch {}

    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

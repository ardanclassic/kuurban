"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "panitia";

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const savedRole = localStorage.getItem("kuurban_role") as UserRole | null;
    const savedAuth = localStorage.getItem("kuurban_auth") === "true";

    if (savedAuth && savedRole) {
      setIsAuthenticated(true);
      setRole(savedRole);
    }
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    if (password === "123123") {
      setIsAuthenticated(true);
      setRole("admin");
      localStorage.setItem("kuurban_auth", "true");
      localStorage.setItem("kuurban_role", "admin");
      return true;
    } else if (password === "123456") {
      setIsAuthenticated(true);
      setRole("panitia");
      localStorage.setItem("kuurban_auth", "true");
      localStorage.setItem("kuurban_role", "panitia");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("kuurban_auth");
    localStorage.removeItem("kuurban_role");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

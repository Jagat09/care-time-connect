
import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "patient" | "admin" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isPatient: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Patient User",
    email: "patient@example.com",
    role: "patient",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from localStorage in this mock example)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login functionality
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && password === "password") { // Mock password check
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
    } else {
      throw new Error("Invalid email or password");
    }
    
    setIsLoading(false);
  };

  const register = async (email: string, name: string, password: string, role: UserRole) => {
    // Mock register functionality
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const existingUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      setIsLoading(false);
      throw new Error("User already exists with that email");
    }
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAdmin = () => user?.role === "admin";
  const isPatient = () => user?.role === "patient";

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, isAdmin, isPatient }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

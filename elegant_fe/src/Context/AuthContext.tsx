import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserType = {
  id: number;
  name: string;
  email: string;
  phone?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: UserType | null;
  token: string | null;
  login: (userData: UserType, token: string) => Promise<void>;
  logout: () => Promise<void>;
  signupemail: string | null;
  setSignupemail: (email: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [signupemail, setSignupemail] = useState<string | null>(null);
  // Load stored user on app start
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error loading stored data", error);
      }
    };

    loadStoredData();
  }, []);

  const login = async (userData: UserType, token: string) => {
    try {
      setIsLoggedIn(true);
      setUser(userData);
      setToken(token);
      setSignupemail(null);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", token);
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  const logout = async () => {
    try {
      setIsLoggedIn(false);
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
    } catch (error) {
      console.error("Error removing data", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout,signupemail,
        setSignupemail }}>
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

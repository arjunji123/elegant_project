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
  forgotPasswordMail: string | null;
  setForgotPasswordMail: (email: string | null) => void;
  storePassword: string | null;
  setStorePassword: React.Dispatch<React.SetStateAction<string | null>>;
  categoriesName: string | null;
  setCategoriesName: React.Dispatch<React.SetStateAction<string | null>>;
  categoriesId: string | null;
  setCategoriesId: React.Dispatch<React.SetStateAction<string | null>>;
  productId: string | null;
  setProductId: React.Dispatch<React.SetStateAction<string | null>>;
  query: string | null;
  setQuery: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [signupemail, setSignupemail] = useState<string | null>(null);
  const [forgotPasswordMail, setForgotPasswordMail] = useState<string | null>(null);
  const [storePassword, setStorePassword] = useState<string | null>(null);
  const [categoriesName, setCategoriesName] = useState<string | null>(null);
  const [categoriesId, setCategoriesId] = useState<string | null>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);

  // Load stored user on app start
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");
        const storedExpiry = await AsyncStorage.getItem("tokenExpiry");

        if (storedUser && storedToken && storedExpiry) {
          const expiry = new Date(storedExpiry);

          if (new Date() < expiry) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setIsLoggedIn(true);
          } else {
            
            await logout();
          }
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

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // ⏰ expire in 7 days

      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("tokenExpiry", expiryDate.toISOString());
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  const logout = async () => {
    try {
      setIsLoggedIn(false);
      setUser(null);
      setToken(null);
      await AsyncStorage.multiRemove(["user", "token", "tokenExpiry"]);
    } catch (error) {
      console.error("Error removing data", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        categoriesId,
        setCategoriesId,
        user,
        token,
        login,
        logout,
        signupemail,
        setSignupemail,
        forgotPasswordMail,
        setForgotPasswordMail,
        storePassword,
        setStorePassword,
        categoriesName,
        setCategoriesName,
        productId,
        setProductId,
        query,
        setQuery,
      }}
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

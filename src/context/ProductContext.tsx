import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface ProductContextType {
  ordertId: string | null;
  setOrdertId: (id: string) => void;
  signIn: boolean;
  setSignIn: (status: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (status: boolean) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  adminName: string | null;
  setAdminName: (name: string | null) => void;
}

// Create context with correct type
const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
const [ordertId, setOrdertId] = useState<string | null>(() => {
  return localStorage.getItem('ordertId');
}); 
const [signIn, setSignIn] = useState<boolean>(!!localStorage.getItem("authToken"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [adminName, setAdminName] = useState<string | null>(() => localStorage.getItem('adminName'));

  // Persist token to localStorage
useEffect(() => {
  if (ordertId) localStorage.setItem('ordertId', ordertId);
  else localStorage.removeItem('ordertId');
}, [ordertId]);
useEffect(() => {
  if (token) localStorage.setItem("authToken", token);
  else localStorage.removeItem("authToken");
}, [token]);

useEffect(() => {
  if (adminName) localStorage.setItem("adminName", adminName);
  else localStorage.removeItem("adminName");
}, [adminName]);
  return (
    <ProductContext.Provider
      value={{ ordertId, setOrdertId, signIn, setSignIn, mobileOpen, setMobileOpen, token, setToken, adminName, setAdminName }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook
export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

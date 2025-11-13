import { createContext, useContext, useState, ReactNode } from "react";

interface ProductContextType {
  productId: string | null;
  setProductId: (id: string) => void;
  signIn: boolean ;
  setSignIn: (status: boolean) => void;
  mobileOpen: boolean ;
  setMobileOpen: (status: boolean) => void;
  token?: string | null;
  setToken?: (token: string | null) => void;
  adminName?: string | null;
  setAdminName?: (name: string | null) => void;
}

// Create context with correct type
const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [productId, setProductId] = useState<string | null>(null);
  const [signIn, setSignIn] = useState<boolean>(true); // <-- boolean initial
    const [mobileOpen, setMobileOpen] = useState(false)
    const [token, setToken] = useState<string | null>(null);
    const [adminName, setAdminName] = useState<string | null>(null);

  return (
    <ProductContext.Provider value={{ productId, setProductId, signIn, setSignIn,mobileOpen, setMobileOpen, token, setToken, adminName, setAdminName }}>
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

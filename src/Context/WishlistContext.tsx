import React, { createContext, useContext, useState } from "react";

interface WishlistContextType {
  wishlist: Record<string, number>; // productId → 1 or 0
  toggleWishlist: (id: string, status: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Record<string, number>>({});

  const toggleWishlist = (id: string, status: number) => {
    setWishlist((prev) => ({ ...prev, [id]: status }));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};

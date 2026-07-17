"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("runr_wishlist");
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("runr_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, loaded]);

  const addToWishlist = useCallback((property) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === property.id)) return prev;
      return [...prev, property];
    });
  }, []);

  const removeFromWishlist = useCallback((propertyId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== propertyId));
  }, []);

  const isInWishlist = useCallback(
    (propertyId) => wishlist.some((item) => item.id === propertyId),
    [wishlist]
  );

  const toggleWishlist = useCallback((property) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === property.id)) {
        return prev.filter((item) => item.id !== property.id);
      }
      return [...prev, property];
    });
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

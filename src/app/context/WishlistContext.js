"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { showWishlistToast } from "../components/WishlistToast";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loaded, setLoaded] = useState(false);

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
    setTimeout(() => showWishlistToast("Added to Wishlist", "added"), 0);
  }, []);

  const removeFromWishlist = useCallback((propertyId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== propertyId));
    setTimeout(() => showWishlistToast("Removed from Wishlist", "removed"), 0);
  }, []);

  const isInWishlist = useCallback(
    (propertyId) => wishlist.some((item) => item.id === propertyId),
    [wishlist]
  );

  const toggleWishlist = useCallback((property) => {
    let action = "added";
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === property.id);
      if (exists) {
        action = "removed";
        return prev.filter((item) => item.id !== property.id);
      }
      return [...prev, property];
    });
    setTimeout(() => {
      if (action === "added") {
        showWishlistToast("Added to Wishlist", "added");
      } else {
        showWishlistToast("Removed from Wishlist", "removed");
      }
    }, 0);
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    setTimeout(() => showWishlistToast("Wishlist cleared", "removed"), 0);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
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

import React, { createContext, useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const [initialized, setInitialized] = useState(false);
    
  // ── Fetch cart ──────────────────────────────────────────────────────────────
  const fetchCart = async () => {
      if (!token) {
        setCartItems([]);
      setLoading(false);
      return;
      }
       setLoading(true); 
    try {
      const res = await fetch("http://localhost:5000/api/v1/cart", {
        headers: { Authorization: token },
      });
      const data = await res.json();
      setCartItems(data?.data?.cart?.products || []);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load cart.",
        confirmButtonColor: "#D84040",
      });
    } finally {
        setLoading(false);
        setInitialized(true);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // ── Add / increase quantity ─────────────────────────────────────────────────
  const addToCart = async (productId) => {
    if (!token) return;
    try {
      await fetch("http://localhost:5000/api/v1/cart", {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      await fetchCart();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add to cart.",
        confirmButtonColor: "#D84040",
      });
    }
  };

  // ── Decrease quantity ───────────────────────────────────────────────────────
  const decreaseQty = async (productId) => {
    if (!token) return;
    try {
      await fetch(`http://localhost:5000/api/v1/cart/items/${productId}`, {
        method: "PATCH",
        headers: { Authorization: token },
      });
      await fetchCart();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update cart.",
        confirmButtonColor: "#D84040",
      });
    }
  };

  // ── Remove item ─────────────────────────────────────────────────────────────
  const removeItem = async (productId) => {
    if (!token) return;
    try {
      await fetch(`http://localhost:5000/api/v1/cart/items/${productId}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      await fetchCart();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to remove item.",
        confirmButtonColor: "#D84040",
      });
    }
  };

  // ── Clear cart ──────────────────────────────────────────────────────────────
  const clearCart = async () => {
    if (!token) return;
    try {
      await fetch("http://localhost:5000/api/v1/cart", {
        method: "DELETE",
        headers: { Authorization: token },
      });
      setCartItems([]);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to clear cart.",
        confirmButtonColor: "#D84040",
      });
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.finalPrice || 0) * (item.quantity || 1),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        total,
        addToCart,
        decreaseQty,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

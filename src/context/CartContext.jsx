import React, { createContext, useContext, useEffect, useState } from "react";

const CartCtx = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product){
    setCartItems(prev => {
      const found = prev.find(p => p.id === product.id);
      if(found) return prev.map(p => p.id === product.id ? {...p, quantity: p.quantity + 1} : p);
      return [...prev, {...product, quantity: 1}];
    });
  }

  function removeFromCart(id){
    setCartItems(prev => prev.filter(p => p.id !== id));
  }

  function clearCart(){ setCartItems([]); }

  return (
    <CartCtx.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart(){ return useContext(CartCtx); }

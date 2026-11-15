"use client";
import { createContext, useContext, useEffect, useState } from "react";

// העגלה שומרת רק מזהה וכמות. המחירים תמיד נלקחים מ-data/products.js,
// ובשרת מחשבים אותם מחדש - כך אי אפשר לשנות מחיר מהדפדפן.
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem("cart", JSON.stringify(items));
      } catch {}
    }
  }, [items, loaded]);

  const add = (id, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.id === id);
      return found
        ? prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { id, qty }];
    });

  const setQty = (id, qty) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );

  const clear = () => setItems([]);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, setQty, clear, count, loaded }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

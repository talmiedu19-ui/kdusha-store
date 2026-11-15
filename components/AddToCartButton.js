"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToCartButton({ id }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);

  return (
    <button
      className="btn"
      onClick={() => {
        add(id);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? "נוסף לעגלה ✓" : "הוסף לעגלה"}
    </button>
  );
}

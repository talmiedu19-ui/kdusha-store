"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function Header() {
  const { count } = useCart();
  const [theme, setTheme] = useState(null); // null עד שהדפדפן נטען, כדי למנוע אי-התאמה בטעינה

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const label = theme === "light" ? "מעבר לעיצוב כהה" : "מעבר לעיצוב לבן-זהב";

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">חנות יודאיקה</Link>
        <nav aria-label="ניווט ראשי">
          <Link href="/products">הקולקציה</Link>
          <Link href="/cart" className="cart-link" aria-label={`עגלה, ${count} פריטים`}>
            <span aria-hidden="true">🛒 </span>עגלה
            {count > 0 && <span className="badge" aria-hidden="true">{count}</span>}
          </Link>
          <button type="button" className="theme-btn" onClick={toggleTheme} aria-label={label} title={label}>
            <span aria-hidden="true">{theme === "light" ? "☾" : theme === "dark" ? "☀" : "◐"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function Header() {
  const { count } = useCart();
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
        </nav>
      </div>
    </header>
  );
}

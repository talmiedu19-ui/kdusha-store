"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductBrowser from "./ProductBrowser";
import { products, categories, activeCategories } from "@/data/products";

// קורא את הקטגוריה מהכתובת בצד הלקוח, כדי שהדף יעבוד גם באתר סטטי (GitHub Pages)
export default function ProductsView() {
  const params = useSearchParams();
  const active = params.get("category");
  const list = active ? products.filter((p) => p.category === active) : products;

  return (
    <>
      <h1>{active && categories[active] ? categories[active] : "הקולקציה"}</h1>
      {Object.keys(activeCategories).length > 1 && (
        <nav className="chips" aria-label="קטגוריות">
          <Link href="/products" className={`chip ${!active ? "active" : ""}`}>הכול</Link>
          {Object.entries(activeCategories).map(([key, label]) => (
            <Link
              key={key}
              href={`/products?category=${key}`}
              className={`chip ${active === key ? "active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
      <ProductBrowser key={active || "all"} products={list} />
    </>
  );
}

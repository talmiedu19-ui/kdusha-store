"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";

const PRICE_OPTIONS = [
  { v: "", l: "הכול" },
  { v: "50", l: "עד ₪50" },
  { v: "100", l: "עד ₪100" },
  { v: "150", l: "עד ₪150" },
];

const SORTS = [
  { v: "default", l: "מומלצים" },
  { v: "price-asc", l: "מחיר: מהנמוך לגבוה" },
  { v: "price-desc", l: "מחיר: מהגבוה לנמוך" },
  { v: "name", l: "שם: א-ת" },
];

export default function ProductBrowser({ products }) {
  const [open, setOpen] = useState(false); // פתיחת פאנל הסינון בנייד
  const [maxPrice, setMaxPrice] = useState("");
  const [saleOnly, setSaleOnly] = useState(false);
  const [sort, setSort] = useState("default");

  let list = products.filter(
    (p) =>
      (!maxPrice || p.price <= Number(maxPrice)) &&
      (!saleOnly || p.comparePrice > p.price)
  );
  list = [...list];
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "he"));

  const reset = () => {
    setMaxPrice("");
    setSaleOnly(false);
    setSort("default");
  };

  return (
    <div className="shop">
      <aside className="filters" aria-label="סינון מוצרים">
        <button
          type="button"
          className="btn btn-ghost filters-toggle"
          aria-expanded={open}
          aria-controls="filters-panel"
          onClick={() => setOpen(!open)}
        >
          סינון
        </button>
        <div id="filters-panel" className={`filters-panel ${open ? "open" : ""}`}>
          <div className="field">
            <label htmlFor="f-price">מחיר</label>
            <select id="f-price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
              {PRICE_OPTIONS.map((o) => (
                <option key={o.v} value={o.v}>{o.l}</option>
              ))}
            </select>
          </div>
          <label className="check">
            <input type="checkbox" checked={saleOnly} onChange={(e) => setSaleOnly(e.target.checked)} />
            מבצעים בלבד
          </label>
          <button type="button" className="link-btn" onClick={reset}>
            איפוס סינון
          </button>
        </div>
      </aside>

      <section aria-label="תוצאות">
        <div className="shop-bar">
          <p aria-live="polite">{list.length} מוצרים</p>
          <div className="field-inline">
            <label htmlFor="f-sort">מיון</label>
            <select id="f-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((o) => (
                <option key={o.v} value={o.v}>{o.l}</option>
              ))}
            </select>
          </div>
        </div>

        {list.length === 0 ? (
          <p>לא נמצאו מוצרים התואמים לסינון.</p>
        ) : (
          <div className="grid">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

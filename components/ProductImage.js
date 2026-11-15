// מציג תמונת מוצר, או תחליף אלגנטי עם אמוג'י אם אין תמונה.
// ב-GitHub Pages האתר יושב בתת-נתיב (/שם-הריפו), ולכן מוסיפים אותו לנתיב התמונה.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function ProductImage({ product, priority = false }) {
  if (product.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`${BASE}${product.image}`} alt={product.name} loading={priority ? "eager" : "lazy"} />
    );
  }
  return (
    <span className="ph" aria-hidden="true">
      {product.emoji}
    </span>
  );
}

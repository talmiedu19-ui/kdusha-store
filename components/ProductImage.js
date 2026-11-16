// מציג תמונת מוצר, או תחליף אלגנטי עם אמוג'י אם אין תמונה
export default function ProductImage({ product, priority = false }) {
  if (product.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={product.image} alt={product.name} loading={priority ? "eager" : "lazy"} />
    );
  }
  return (
    <span className="ph" aria-hidden="true">
      {product.emoji}
    </span>
  );
}

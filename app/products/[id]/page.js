import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImage from "@/components/ProductImage";
import { getProduct, categories, formatPrice, products } from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }) {
  const p = getProduct(params.id);
  return { title: p ? `${p.name} - חנות יודאיקה` : "מוצר לא נמצא" };
}

export default function ProductPage({ params }) {
  const p = getProduct(params.id);
  if (!p) notFound();

  return (
    <div className="product">
      <div className="card-img">
        <ProductImage product={p} priority />
      </div>
      <div className="product-info">
        <small>{categories[p.category]}</small>
        <h1>{p.name}</h1>
        <div className="price">
          {p.comparePrice > p.price && (
            <>
              <span className="sr-only">מחיר מקורי </span>
              <s className="price-old">{formatPrice(p.comparePrice)}</s>
              <span className="sr-only"> מחיר מבצע </span>
            </>
          )}
          {formatPrice(p.price)}
        </div>
        <p>{p.description}</p>
        {p.details?.length > 0 && (
          <ul className="details">
            {p.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
        {p.note && <div className="note">{p.note}</div>}
        <AddToCartButton id={p.id} />
      </div>
    </div>
  );
}

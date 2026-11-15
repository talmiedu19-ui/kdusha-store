import Link from "next/link";
import ProductImage from "./ProductImage";
import { categories, formatPrice } from "@/data/products";

export default function ProductCard({ product }) {
  const hasSale = product.comparePrice > product.price;
  return (
    <Link href={`/products/${product.id}`} className="card">
      <div className="card-img">
        <ProductImage product={product} />
        {product.demo && <span className="demo-tag">מוצר דוגמה</span>}
        {hasSale && <span className="sale-tag">מבצע</span>}
      </div>
      <div className="card-body">
        <small>{categories[product.category]}</small>
        <h3>{product.name}</h3>
        <strong>
          {hasSale && (
            <>
              <span className="sr-only">מחיר מקורי </span>
              <s className="price-old">{formatPrice(product.comparePrice)}</s>
              <span className="sr-only"> מחיר מבצע </span>
            </>
          )}
          {formatPrice(product.price)}
        </strong>
      </div>
    </Link>
  );
}

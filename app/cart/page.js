"use client";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import ProductImage from "@/components/ProductImage";
import { getProduct, formatPrice, shippingFor, FREE_SHIPPING_FROM } from "@/data/products";

export default function CartPage() {
  const { items, setQty, loaded } = useCart();
  if (!loaded) return <p>טוען...</p>;

  const lines = items
    .map((i) => ({ ...i, product: getProduct(i.id) }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const shipping = shippingFor(subtotal);

  if (lines.length === 0) {
    return (
      <>
        <h1>העגלה ריקה</h1>
        <Link href="/products" className="btn">לקולקציה</Link>
      </>
    );
  }

  return (
    <>
      <h1>העגלה שלי</h1>
      <table className="table">
        <thead>
          <tr><th>מוצר</th><th>מחיר</th><th>כמות</th><th>סה״כ</th></tr>
        </thead>
        <tbody>
          {lines.map(({ id, qty, product }) => (
            <tr key={id}>
              <td className="cell-product">
                <div className="cart-item">
                  <div className="thumb"><ProductImage product={product} /></div>
                  <Link href={`/products/${id}`}>{product.name}</Link>
                </div>
              </td>
              <td data-label="מחיר">{formatPrice(product.price)}</td>
              <td data-label="כמות">
                <span>
                  <span className="qty">
                    <button aria-label={`הפחת כמות: ${product.name}`} onClick={() => setQty(id, qty - 1)}>−</button>
                    <span aria-live="polite">{qty}</span>
                    <button aria-label={`הוסף כמות: ${product.name}`} onClick={() => setQty(id, qty + 1)}>+</button>
                  </span>
                  <button className="link-btn" aria-label={`הסר מהעגלה: ${product.name}`} onClick={() => setQty(id, 0)}>
                    הסרה
                  </button>
                </span>
              </td>
              <td data-label="סה״כ">{formatPrice(product.price * qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary">
        <div><span>סכום ביניים</span><span>{formatPrice(subtotal)}</span></div>
        <div><span>משלוח</span><span>{shipping === 0 ? "חינם" : formatPrice(shipping)}</span></div>
        {shipping > 0 && <small>משלוח חינם בקנייה מעל {formatPrice(FREE_SHIPPING_FROM)}</small>}
        <div><strong>סה״כ לתשלום</strong><strong>{formatPrice(subtotal + shipping)}</strong></div>
        <Link href="/checkout" className="btn btn-block" style={{ marginTop: 12 }}>
          לתשלום
        </Link>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/data/products";

function SuccessBody() {
  const params = useSearchParams();
  const orderId = params.get("order") || "";
  const { clear } = useCart();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    let stop = false;
    (async () => {
      try {
        const res = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "לא הצלחנו לאמת את התשלום");
        if (stop) return;
        setOrder(data.order);
        if (data.order?.status === "paid") clear();
      } catch (err) {
        if (!stop) setError(err.message);
      }
    })();
    return () => {
      stop = true;
    };
  }, [orderId, clear]);

  return (
    <>
      <p className="eyebrow">תשלום</p>
      <h1>תודה על ההזמנה</h1>
      {!orderId && <p>לא התקבל מספר הזמנה.</p>}
      {error && <div className="error" role="alert">{error}</div>}
      {orderId && !order && !error && <p>מאמתים את התשלום...</p>}
      {order && (
        <>
          <p>מספר הזמנה: <strong>{order.orderId}</strong></p>
          <p>סכום: {formatPrice(order.total)}</p>
          <div className="notice">
            {order.status === "paid"
              ? "התשלום התקבל. נתחיל לטפל במשלוח."
              : "ההזמנה נשמרה, והתשלום עדיין לא אושר. אם חויבת, הסטטוס יתעדכן בדקות הקרובות."}
          </div>
        </>
      )}
      <p><Link href="/" className="btn">חזרה לחנות</Link></p>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p>טוען...</p>}>
      <SuccessBody />
    </Suspense>
  );
}

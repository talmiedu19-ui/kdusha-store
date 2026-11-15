"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CancelBody() {
  const order = useSearchParams().get("order");
  return (
    <>
      <p className="eyebrow">תשלום</p>
      <h1>התשלום לא הושלם</h1>
      <p>ההזמנה נשמרה{order ? ` (${order})` : ""}, אבל לא בוצע חיוב. אפשר לחזור לעגלה ולנסות שוב.</p>
      <p>
        <Link href="/checkout" className="btn">חזרה לתשלום</Link>
      </p>
    </>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<p>טוען...</p>}>
      <CancelBody />
    </Suspense>
  );
}

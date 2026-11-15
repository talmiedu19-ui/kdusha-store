"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { getProduct, formatPrice, shippingFor } from "@/data/products";

// שדות המשלוח. מפוצלים (עיר/רחוב/מספר/מיקוד) כי כך נדרש גם בהזמנה אצל ספק בחו"ל.
const FIELDS = [
  { k: "name", label: "שם מלא", autoComplete: "name" },
  { k: "phone", label: "טלפון נייד", type: "tel", autoComplete: "tel" },
  { k: "email", label: "אימייל", type: "email", autoComplete: "email" },
  { k: "city", label: "עיר / יישוב", autoComplete: "address-level2" },
  { k: "street", label: "רחוב", autoComplete: "address-line1" },
  { k: "houseNumber", label: "מספר בית", autoComplete: "off" },
  { k: "apartment", label: "דירה / כניסה (אם יש)", optional: true, autoComplete: "address-line2" },
  { k: "zip", label: "מיקוד (7 ספרות)", inputMode: "numeric", pattern: "\\d{7}", autoComplete: "postal-code" },
];

const EMPTY = {
  name: "", phone: "", email: "", city: "", street: "",
  houseNumber: "", apartment: "", zip: "", notes: "",
};

// באתר סטטי (GitHub Pages) אין שרת, ולכן הצ'קאאוט עובד במצב הדגמה בלבד
const STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC === "1";

export default function CheckoutPage() {
  const { items, clear, loaded } = useCart();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  if (!loaded) return <p>טוען...</p>;

  if (result) {
    return (
      <>
        <h1>תודה על ההזמנה! 🎉</h1>
        <p>מספר הזמנה: <strong>{result.orderId}</strong></p>
        <p>סכום: {formatPrice(result.total)}</p>
        <div className="notice">
          {result.demo
            ? "זו גרסת תצוגה: ההזמנה לא נשלחה ולא נשמרה, ולא בוצע חיוב."
            : "מצב פיתוח: ההזמנה נשמרה, אך עדיין לא מחובר שירות סליקה. ראה את README לחיבור תשלום אמיתי."}
        </div>
        <p><Link href="/" className="btn">חזרה לחנות</Link></p>
      </>
    );
  }

  const lines = items.map((i) => ({ ...i, product: getProduct(i.id) })).filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const total = subtotal + shippingFor(subtotal);

  if (lines.length === 0) {
    return (
      <>
        <h1>העגלה ריקה</h1>
        <Link href="/products" className="btn">לכל המוצרים</Link>
      </>
    );
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (STATIC_DEMO) {
      setResult({ orderId: "תצוגה", total, demo: true });
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map(({ id, qty }) => ({ id, qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "אירעה שגיאה");
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl; // מעבר לדף התשלום של חברת הסליקה
        return;
      }
      clear();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1>פרטי משלוח ותשלום</h1>
      {STATIC_DEMO && (
        <div className="notice">גרסת תצוגה: אין שליחת הזמנה ואין חיוב. אל תזין פרטים אמיתיים.</div>
      )}
      <p>סה״כ לתשלום: <strong>{formatPrice(total)}</strong></p>
      <form className="form" onSubmit={submit}>
        {FIELDS.map((f) => (
          <div className="field" key={f.k}>
            <label htmlFor={`f-${f.k}`}>
              {f.label}{!f.optional && <span aria-hidden="true"> *</span>}
            </label>
            <input
              id={`f-${f.k}`}
              name={f.k}
              type={f.type || "text"}
              required={!f.optional}
              aria-required={!f.optional}
              inputMode={f.inputMode}
              pattern={f.pattern}
              autoComplete={f.autoComplete}
              value={form[f.k]}
              onChange={set(f.k)}
            />
          </div>
        ))}
        <div className="field">
          <label htmlFor="f-notes">הערות להזמנה (לא חובה)</label>
          <textarea id="f-notes" rows={3} value={form.notes} onChange={set("notes")} />
        </div>
        {error && <div className="error" role="alert">{error}</div>}
        <button className="btn" disabled={busy}>{busy ? "שולח..." : "המשך לתשלום"}</button>
      </form>
    </>
  );
}

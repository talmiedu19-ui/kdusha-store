import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getProduct, shippingFor } from "@/data/products";

// שרת: מחשב מחדש את המחירים (לא סומכים על הדפדפן), שומר הזמנה לקובץ,
// ובהמשך יוצר דף תשלום בחברת הסליקה.
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  const { customer, items } = body || {};
  const required = ["name", "phone", "email", "city", "street", "houseNumber", "zip"];
  if (!customer || required.some((k) => !String(customer[k] || "").trim())) {
    return NextResponse.json({ error: "חסרים פרטי משלוח" }, { status: 400 });
  }
  if (!/^\d{7}$/.test(String(customer.zip).trim())) {
    return NextResponse.json({ error: "מיקוד חייב להכיל 7 ספרות" }, { status: 400 });
  }
  if (!/^[\d+\-\s]{9,15}$/.test(String(customer.phone).trim())) {
    return NextResponse.json({ error: "מספר טלפון לא תקין" }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(String(customer.email).trim())) {
    return NextResponse.json({ error: "כתובת אימייל לא תקינה" }, { status: 400 });
  }

  const lines = [];
  let subtotal = 0;
  for (const { id, qty } of Array.isArray(items) ? items : []) {
    const product = getProduct(id);
    const q = Number.parseInt(qty, 10);
    if (!product || !(q > 0) || q > 50) continue;
    lines.push({ id, name: product.name, qty: q, price: product.price });
    subtotal += product.price * q;
  }
  if (lines.length === 0) {
    return NextResponse.json({ error: "העגלה ריקה" }, { status: 400 });
  }

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  const orderId = `ORD-${Date.now()}`;

  const order = {
    orderId,
    createdAt: new Date().toISOString(),
    status: "pending_payment",
    customer: {
      name: String(customer.name).trim(),
      phone: String(customer.phone).trim(),
      email: String(customer.email).trim(),
      country: "IL",
      city: String(customer.city).trim(),
      street: String(customer.street).trim(),
      houseNumber: String(customer.houseNumber).trim(),
      apartment: String(customer.apartment || "").trim(),
      zip: String(customer.zip).trim(),
      notes: String(customer.notes || "").trim(),
    },
    lines,
    subtotal,
    shipping,
    total,
  };

  // שלב זמני: שמירה לקובץ מקומי. בפריסה ל-Vercel יש להחליף במסד נתונים (ראה README).
  try {
    const file = path.join(process.cwd(), "orders.json");
    let all = [];
    try {
      all = JSON.parse(await fs.readFile(file, "utf8"));
    } catch {}
    all.push(order);
    await fs.writeFile(file, JSON.stringify(all, null, 2));
  } catch (err) {
    console.error("Could not save order", err);
  }

  // TODO (שלב התשלום): ליצור כאן דף תשלום בחברת הסליקה שבחרת
  // ולהחזיר את הכתובת שלו ב-paymentUrl. ראה README, שלב 7.
  const paymentUrl = null;

  return NextResponse.json({ ok: true, orderId, total, paymentUrl });
}

import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { listOrders, publicOrder, updateOrder } from "@/lib/orders";

const MANUAL = new Set(["paid", "fulfilling", "shipped", "cancelled"]);

export async function GET() {
  if (!isAdminRequest()) return NextResponse.json({ error: "נדרשת כניסה" }, { status: 401 });
  try {
    const orders = (await listOrders()).map(publicOrder);
    return NextResponse.json({ orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "לא הצלחנו לטעון הזמנות" }, { status: 500 });
  }
}

export async function PATCH(req) {
  if (!isAdminRequest()) return NextResponse.json({ error: "נדרשת כניסה" }, { status: 401 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }
  const orderId = String(body?.orderId || "");
  const status = String(body?.status || "");
  if (!orderId || !MANUAL.has(status)) {
    return NextResponse.json({ error: "סטטוס לא נתמך" }, { status: 400 });
  }
  const patch = { status };
  if (status === "paid") patch.paidAt = new Date().toISOString();
  try {
    const order = await updateOrder(orderId, patch);
    if (!order) return NextResponse.json({ error: "ההזמנה לא נמצאה" }, { status: 404 });
    return NextResponse.json({ order: publicOrder(order) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "לא הצלחנו לעדכן את ההזמנה" }, { status: 500 });
  }
}

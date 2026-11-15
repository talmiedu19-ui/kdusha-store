import { NextResponse } from "next/server";
import { getOrder, publicOrder, updateOrder } from "@/lib/orders";
import { approveGrowPayment, growConfigured } from "@/lib/grow";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  const orderId = String(body?.orderId || "");
  if (!/^ORD-\d+$/.test(orderId)) {
    return NextResponse.json({ error: "מספר הזמנה לא תקין" }, { status: 400 });
  }

  const order = await getOrder(orderId);
  if (!order) return NextResponse.json({ error: "ההזמנה לא נמצאה" }, { status: 404 });
  if (order.status === "paid" || order.status === "fulfilling" || order.status === "shipped") {
    return NextResponse.json({ ok: true, order: publicOrder(order) });
  }
  if (!growConfigured() || !order.paymentProcessId || !order.paymentProcessToken) {
    return NextResponse.json({ ok: true, order: publicOrder(order) });
  }

  const approval = await approveGrowPayment({
    processId: order.paymentProcessId,
    processToken: order.paymentProcessToken,
  });
  if (!approval.paid) {
    return NextResponse.json({ ok: true, order: publicOrder(order) });
  }

  const updated = await updateOrder(orderId, {
    status: "paid",
    paymentRef: approval.ref,
    paidAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, order: publicOrder(updated) });
}

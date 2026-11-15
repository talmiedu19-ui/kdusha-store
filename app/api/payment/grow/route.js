import { NextResponse } from "next/server";
import { approveGrowPayment } from "@/lib/grow";
import { getOrder, getOrderByProcessId, updateOrder } from "@/lib/orders";

function findField(payload, name) {
  const direct = payload[name];
  if (direct) return String(direct);
  const key = Object.keys(payload).find((k) => k === name || k.endsWith(`[${name}]`) || k.endsWith(`.${name}`));
  return key ? String(payload[key]) : "";
}

async function readPayload(req) {
  const type = req.headers.get("content-type") || "";
  if (type.includes("application/json")) return await req.json();
  const form = await req.formData();
  const payload = {};
  for (const [key, value] of form.entries()) payload[key] = String(value);
  return payload;
}

async function handle(req) {
  let payload = {};
  try {
    payload = await readPayload(req);
  } catch {
    return new NextResponse("0", { status: 400 });
  }

  const orderId = findField(payload, "cField1");
  const processId = findField(payload, "processId");
  const order = (orderId && (await getOrder(orderId))) || (await getOrderByProcessId(processId));
  if (!order || !order.paymentProcessId || !order.paymentProcessToken) {
    return new NextResponse("0", { status: 404 });
  }
  if (processId && processId !== order.paymentProcessId) {
    return new NextResponse("0", { status: 400 });
  }
  if (order.status === "paid" || order.status === "fulfilling" || order.status === "shipped") {
    return new NextResponse("1");
  }

  const approval = await approveGrowPayment({
    processId: order.paymentProcessId,
    processToken: order.paymentProcessToken,
  });
  if (!approval.paid) return new NextResponse("0", { status: 402 });

  await updateOrder(order.orderId, {
    status: "paid",
    paymentProvider: "grow",
    paymentRef: approval.ref,
    paidAt: new Date().toISOString(),
  });
  return new NextResponse("1");
}

export async function POST(req) {
  return handle(req);
}

export async function GET(req) {
  return handle(req);
}

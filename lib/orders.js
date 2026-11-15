import { promises as fs } from "fs";
import path from "path";
import { supabaseAdmin } from "./supabase";

const FILE = path.join(process.cwd(), "orders.json");

function toRow(order) {
  return {
    order_id: order.orderId,
    created_at: order.createdAt,
    status: order.status,
    customer: order.customer,
    lines: order.lines,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    payment_provider: order.paymentProvider || null,
    payment_process_id: order.paymentProcessId || null,
    payment_process_token: order.paymentProcessToken || null,
    payment_ref: order.paymentRef || null,
    paid_at: order.paidAt || null,
  };
}

function fromRow(row) {
  if (!row) return null;
  return {
    orderId: row.order_id,
    createdAt: row.created_at,
    status: row.status,
    customer: row.customer,
    lines: row.lines,
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
    paymentProvider: row.payment_provider,
    paymentProcessId: row.payment_process_id,
    paymentProcessToken: row.payment_process_token,
    paymentRef: row.payment_ref,
    paidAt: row.paid_at,
  };
}

export function publicOrder(order) {
  if (!order) return null;
  const { paymentProcessToken, ...safe } = order;
  return safe;
}

async function readFileOrders() {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const all = JSON.parse(raw);
    return Array.isArray(all) ? all : [];
  } catch {
    return [];
  }
}

async function writeFileOrders(all) {
  await fs.writeFile(FILE, JSON.stringify(all, null, 2));
}

export async function saveOrder(order) {
  const sb = supabaseAdmin();
  if (sb) {
    const { error } = await sb.from("orders").insert(toRow(order));
    if (error) throw new Error(error.message);
    return;
  }
  if (process.env.VERCEL) {
    throw new Error("חסר חיבור ל-Supabase. ההזמנה לא נשמרה.");
  }
  const all = await readFileOrders();
  all.push(order);
  await writeFileOrders(all);
}

export async function updateOrder(orderId, patch) {
  const sb = supabaseAdmin();
  if (sb) {
    const row = {};
    if (patch.status) row.status = patch.status;
    if (patch.paymentProvider) row.payment_provider = patch.paymentProvider;
    if (patch.paymentProcessId) row.payment_process_id = patch.paymentProcessId;
    if (patch.paymentProcessToken) row.payment_process_token = patch.paymentProcessToken;
    if ("paymentRef" in patch) row.payment_ref = patch.paymentRef;
    if ("paidAt" in patch) row.paid_at = patch.paidAt;
    row.updated_at = new Date().toISOString();
    const { data, error } = await sb
      .from("orders")
      .update(row)
      .eq("order_id", orderId)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return fromRow(data);
  }

  const all = await readFileOrders();
  const index = all.findIndex((o) => o.orderId === orderId);
  if (index < 0) return null;
  all[index] = { ...all[index], ...patch };
  await writeFileOrders(all);
  return all[index];
}

export async function getOrder(orderId) {
  const sb = supabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from("orders").select("*").eq("order_id", orderId).maybeSingle();
    if (error) throw new Error(error.message);
    return fromRow(data);
  }
  const all = await readFileOrders();
  return all.find((o) => o.orderId === orderId) || null;
}

export async function getOrderByProcessId(processId) {
  if (!processId) return null;
  const sb = supabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .eq("payment_process_id", processId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return fromRow(data);
  }
  const all = await readFileOrders();
  return all.find((o) => o.paymentProcessId === processId) || null;
}

export async function listOrders() {
  const sb = supabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data || []).map(fromRow);
  }
  const all = await readFileOrders();
  return all.slice().reverse();
}

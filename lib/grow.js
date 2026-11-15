function baseUrl() {
  return (process.env.GROW_API_BASE || "https://sandbox.meshulam.co.il/api/light/server/1.0").replace(/\/$/, "");
}

export function growConfigured() {
  return Boolean(process.env.GROW_USER_ID && process.env.GROW_PAGE_CODE && process.env.GROW_API_KEY);
}

function authParams() {
  const params = new URLSearchParams();
  params.set("pageCode", process.env.GROW_PAGE_CODE);
  params.set("userId", process.env.GROW_USER_ID);
  params.set("apiKey", process.env.GROW_API_KEY);
  return params;
}

async function post(method, params) {
  const res = await fetch(`${baseUrl()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function createGrowPayment({ order, successUrl, cancelUrl, notifyUrl }) {
  const params = authParams();
  params.set("sum", Number(order.total).toFixed(2));
  params.set("successUrl", successUrl);
  params.set("cancelUrl", cancelUrl);
  params.set("notifyUrl", notifyUrl);
  params.set("description", `הזמנה ${order.orderId}`);
  params.set("pageField[fullName]", order.customer.name);
  params.set("pageField[phone]", String(order.customer.phone).replace(/[^\d]/g, ""));
  params.set("pageField[email]", order.customer.email);
  params.set("cField1", order.orderId);

  const { ok, data } = await post("createPaymentProcess", params);
  const url = data?.data?.url;
  if (!ok || Number(data?.status) !== 1 || !url) {
    const message = data?.err?.message || data?.err || data?.message || "לא הצלחנו לפתוח דף תשלום ב-Grow";
    throw new Error(typeof message === "string" ? message : "לא הצלחנו לפתוח דף תשלום ב-Grow");
  }
  return {
    url,
    processId: String(data.data.processId || ""),
    processToken: String(data.data.processToken || ""),
  };
}

export async function approveGrowPayment({ processId, processToken }) {
  const params = authParams();
  params.set("processId", processId);
  params.set("processToken", processToken);
  const { ok, data } = await post("approveTransaction", params);
  const paid = ok && Number(data?.status) === 1;
  const ref = String(data?.data?.asmachta || data?.data?.transactionId || data?.data?.transactionCode || "");
  return { paid, ref };
}

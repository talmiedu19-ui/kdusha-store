"use client";

import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/data/products";

const LABELS = {
  pending_payment: "ממתין לתשלום",
  paid: "שולם",
  fulfilling: "בטיפול",
  shipped: "נשלח",
  cancelled: "בוטל",
};

const FILTERS = [
  { id: "all", label: "הכל" },
  { id: "pending_payment", label: "ממתין לתשלום" },
  { id: "paid", label: "שולם" },
  { id: "fulfilling", label: "בטיפול" },
  { id: "shipped", label: "נשלח" },
];

function address(customer) {
  const apt = customer.apartment ? `, דירה ${customer.apartment}` : "";
  return `${customer.street} ${customer.houseNumber}${apt}, ${customer.city} ${customer.zip}`;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/orders");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "טעינה נכשלה");
    setOrders(data.orders || []);
    setAuthed(true);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  const visible = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "כניסה נכשלה");
      setPassword("");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setOrders([]);
  }

  async function setStatus(orderId, status) {
    setError("");
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "עדכון נכשל");
      return;
    }
    setOrders((current) => current.map((o) => (o.orderId === orderId ? data.order : o)));
  }

  if (!authed) {
    return (
      <section className="admin-login">
        <p className="eyebrow">ניהול החנות</p>
        <h1>הזמנות</h1>
        <p>המסך הזה פרטי. הכניסה היא בסיסמה שהגדרת ב-ADMIN_PASSWORD.</p>
        <form className="form" onSubmit={login}>
          <div className="field">
            <label htmlFor="admin-password">סיסמה</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error" role="alert">{error}</div>}
          <button className="btn" disabled={busy}>{busy ? "נכנס..." : "כניסה"}</button>
        </form>
      </section>
    );
  }

  return (
    <section>
      <div className="admin-head">
        <div>
          <p className="eyebrow">ניהול החנות</p>
          <h1>הזמנות</h1>
        </div>
        <button type="button" className="btn btn-ghost" onClick={logout}>יציאה</button>
      </div>
      <div className="chips" role="tablist" aria-label="סינון הזמנות">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={filter === item.id ? "chip active" : "chip"}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {error && <div className="error" role="alert">{error}</div>}
      {visible.length === 0 ? (
        <p>אין הזמנות להצגה.</p>
      ) : (
        <div className="admin-list">
          {visible.map((order) => {
            const open = openId === order.orderId;
            return (
              <article key={order.orderId} className="admin-card">
                <button type="button" className="admin-card-main" onClick={() => setOpenId(open ? "" : order.orderId)}>
                  <span>
                    <strong>{order.orderId}</strong>
                    <small>{new Date(order.createdAt).toLocaleString("he-IL")}</small>
                  </span>
                  <span>{order.customer.name}</span>
                  <span>{formatPrice(order.total)}</span>
                  <span className={`status status-${order.status}`}>{LABELS[order.status] || order.status}</span>
                </button>
                {open && (
                  <div className="admin-detail">
                    <p>{address(order.customer)}</p>
                    <p>{order.customer.phone} · {order.customer.email}</p>
                    {order.customer.notes && <p>הערות: {order.customer.notes}</p>}
                    <ul>
                      {order.lines.map((line) => (
                        <li key={line.id}>{line.name} × {line.qty} · {formatPrice(line.price * line.qty)}</li>
                      ))}
                    </ul>
                    {order.paymentRef && <p>אסמכתא: {order.paymentRef}</p>}
                    <div className="admin-actions">
                      {order.status === "pending_payment" && (
                        <button type="button" className="btn" onClick={() => setStatus(order.orderId, "paid")}>סמן כשולם</button>
                      )}
                      {order.status === "paid" && (
                        <button type="button" className="btn" onClick={() => setStatus(order.orderId, "fulfilling")}>בטיפול</button>
                      )}
                      {(order.status === "paid" || order.status === "fulfilling") && (
                        <button type="button" className="btn" onClick={() => setStatus(order.orderId, "shipped")}>נשלח</button>
                      )}
                      {order.status !== "cancelled" && order.status !== "shipped" && (
                        <button type="button" className="btn btn-ghost" onClick={() => setStatus(order.orderId, "cancelled")}>ביטול</button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

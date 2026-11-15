import { NextResponse } from "next/server";
import { adminConfigured, adminCookie, passwordsMatch } from "@/lib/admin-auth";

export async function POST(req) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "צריך להגדיר ADMIN_PASSWORD באורך 8 תווים לפחות." },
      { status: 503 }
    );
  }
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }
  if (!passwordsMatch(String(body?.password || ""))) {
    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
  }
  const cookie = adminCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}

import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "kdusha_admin";
const MAX_AGE = 60 * 60 * 12;

function password() {
  const value = process.env.ADMIN_PASSWORD || "";
  return value.length >= 8 ? value : "";
}

export function adminConfigured() {
  return Boolean(password());
}

function digest(value) {
  return createHash("sha256").update(value).digest();
}

export function passwordsMatch(input) {
  const secret = password();
  if (!secret || typeof input !== "string") return false;
  return timingSafeEqual(digest(input), digest(secret));
}

export function makeAdminToken() {
  const exp = String(Date.now() + MAX_AGE * 1000);
  const sig = createHmac("sha256", password()).update(exp).digest("hex");
  return `${exp}.${sig}`;
}

export function adminTokenValid(token) {
  const secret = password();
  if (!secret || !token || !token.includes(".")) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const expected = createHmac("sha256", secret).update(exp).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isAdminRequest() {
  return adminTokenValid(cookies().get(COOKIE)?.value);
}

export function adminCookie() {
  return {
    name: COOKIE,
    value: makeAdminToken(),
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: MAX_AGE,
    },
  };
}

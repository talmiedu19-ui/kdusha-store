// בניית "תצוגה" סטטית ל-GitHub Pages מופעלת רק כש-GITHUB_PAGES=true (ה-workflow מגדיר זאת).
// בהרצה רגילה (npm run dev / Netlify / Vercel) האתר נשאר אתר Next.js מלא עם שרת.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? `/${process.env.REPO_NAME || "kdusha-store"}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isPages
    ? { output: "export", basePath, images: { unoptimized: true }, trailingSlash: true }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC: isPages ? "1" : "",
  },
};
module.exports = nextConfig;

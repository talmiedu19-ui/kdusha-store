import "./globals.css";
import Link from "next/link";
import { Heebo, Frank_Ruhl_Libre } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import { FREE_SHIPPING_FROM, formatPrice } from "@/data/products";
import AccessibilityWidget from "@/components/AccessibilityWidget";

const sans = Heebo({ subsets: ["hebrew", "latin"], variable: "--font-sans" });
const serif = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-serif",
});

export const metadata = {
  title: "חנות יודאיקה - מוצרי קדושה",
  description: "בתי מזוזה ומוצרי קדושה נבחרים בעיצוב מוקפד",
};

export const viewport = { themeColor: "#0b0b0c" };

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${sans.variable} ${serif.variable}`}>
        <a href="#main" className="skip-link">דלג לתוכן הראשי</a>
        <div className="announce">משלוח חינם בקנייה מעל {formatPrice(FREE_SHIPPING_FROM)}</div>
        <CartProvider>
          <Header />
          <main id="main" className="container" tabIndex={-1}>{children}</main>
          <footer className="footer">
            <div className="container">
              <p>© חנות יודאיקה · עוסק זעיר · כל הזכויות שמורות</p>
              <p><Link href="/accessibility">הצהרת נגישות</Link></p>
            </div>
          </footer>
          <AccessibilityWidget />
        </CartProvider>
      </body>
    </html>
  );
}

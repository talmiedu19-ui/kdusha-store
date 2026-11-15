import { Suspense } from "react";
import ProductsView from "@/components/ProductsView";

export const metadata = { title: "הקולקציה - חנות יודאיקה" };

export default function ProductsPage() {
  return (
    <Suspense fallback={<h1>הקולקציה</h1>}>
      <ProductsView />
    </Suspense>
  );
}

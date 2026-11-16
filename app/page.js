import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { products, activeCategories } from "@/data/products";

export default function Home() {
  const hero = products.find((p) => p.image) || products[0];

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">מוצרי קדושה נבחרים</p>
          <h1>קדושה בעיצוב מוקפד</h1>
          <p>
            מוצרי קדושה אלגנטיים לבית שלך, ומתנה מושלמת לחנוכת בית, לחתונה ולכל אירוע.
          </p>
          <div className="hero-actions">
            <Link href="/products" className="btn">לקולקציה</Link>
            {hero && (
              <Link href={`/products/${hero.id}`} className="btn btn-ghost">
                {hero.name}
              </Link>
            )}
          </div>
        </div>
        {hero && (
          <Link href={`/products/${hero.id}`} className="hero-media">
            <ProductImage product={hero} priority />
          </Link>
        )}
      </section>

      <div className="perks">
        <div><strong>אריזה מהודרת</strong>מוכנה למתנה</div>
        <div><strong>משלוח עד הבית</strong>לכל רחבי הארץ</div>
        <div><strong>שירות אישי</strong>אנחנו כאן לכל שאלה</div>
      </div>

      <div className="section-title"><h2>הקולקציה</h2></div>
      {Object.keys(activeCategories).length > 1 && (
        <div className="chips">
          {Object.entries(activeCategories).map(([key, label]) => (
            <Link key={key} href={`/products?category=${key}`} className="chip">
              {label}
            </Link>
          ))}
        </div>
      )}
      <div className="grid">
        {products.slice(0, 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}

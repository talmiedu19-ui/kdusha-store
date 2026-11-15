// כל המוצרים של החנות נמצאים כאן. כדי להוסיף מוצר - מוסיפים אובייקט למערך allProducts.
//
// שדות:
//  id          - מזהה ייחודי באנגלית (משמש בכתובת: /products/<id>)
//  name        - שם המוצר
//  category    - אחד מהמפתחות ב-categories
//  price       - מחיר מכירה בש"ח
//  description - תיאור קצר
//  details     - רשימת נקודות (אופציונלי)
//  note        - הערה בולטת בדף המוצר (אופציונלי)
//  emoji       - תחליף זמני כשאין תמונה
//  image       - נתיב לתמונה בתיקיית public (למשל "/images/kippa1.jpg")
//  supplierUrl - לינק למוצר אצל הספק (לשימושך בלבד, לא מוצג ללקוח)
//  published   - false = המוצר מוסתר מהאתר (טיוטה). ברירת מחדל: מוצג.
//  comparePrice - מחיר מקורי לפני הנחה (אופציונלי). אם גבוה מ-price: מוצג מחיר מחוק ותג "מבצע".
//  demo        - true = מוצר דוגמה פיקטיבי (מוצג עם תג "מוצר דוגמה").
//
// ⚠️ לפני עלייה לאוויר: למחוק את כל המוצרים עם demo:true, או לשנות אותם למוצרים אמיתיים.

export const categories = {
  mezuzot: "בתי מזוזה",
  kippot: "כיפות",
  candles: "הדלקת נרות",
  other: "מוצרי קדושה נוספים",
};

export const allProducts = [
  // ================= מוצר אמיתי =================
  {
    id: "mezuza-black-silver-gift",
    name: "בית מזוזה יוקרתי - שחור וכסף",
    category: "mezuzot",
    // ⚠️ מחיר זמני - יש לעדכן לפי העלויות והרווח שלך
    price: 119,
    description:
      "בית מזוזה בעיצוב מודרני וחלק בגוון שחור, עם עיטור כסוף. מגיע באריזת מתנה מהודרת, ומתאים לחנוכת בית, לחתונה ולמתנה אישית.",
    details: [
      "גוון שחור עם עיטור כסוף",
      "אריזת מתנה מהודרת",
      "מתאים כמתנה לחנוכת בית ולאירועים",
    ],
    note: "הבית נמכר ללא קלף. הקלף נרכש בנפרד מסופר סת״ם מוסמך.",
    emoji: "🚪",
    image: "/images/mezuzah-black-silver.png",
    supplierUrl: "",
  },

  // ================= מוצרי דוגמה פיקטיביים =================
  {
    id: "demo-mezuza-gold",
    name: "בית מזוזה זהב מוברש",
    category: "mezuzot",
    price: 99,
    comparePrice: 129,
    description: "בית מזוזה בגוון זהב מוברש בקו נקי ומינימליסטי, מתאים לכל סוגי הדלתות.",
    details: ["גוון זהב מוברש", "הדבקה קלה לדלת"],
    note: "הבית נמכר ללא קלף. הקלף נרכש בנפרד מסופר סת״ם מוסמך.",
    emoji: "🚪",
    image: "",
    supplierUrl: "",
    demo: true,
  },
  {
    id: "demo-mezuza-glass",
    name: "בית מזוזה זכוכית ונירוסטה",
    category: "mezuzot",
    price: 139,
    description: "בית מזוזה בשילוב זכוכית ונירוסטה, בעיצוב מודרני לבית ולמשרד.",
    details: ["שילוב זכוכית ונירוסטה", "עיצוב מודרני"],
    note: "הבית נמכר ללא קלף. הקלף נרכש בנפרד מסופר סת״ם מוסמך.",
    emoji: "🚪",
    image: "",
    supplierUrl: "",
    demo: true,
  },
  {
    id: "demo-kippa-knitted-white",
    name: "כיפה סרוגה לבנה",
    category: "kippot",
    price: 25,
    description: "כיפה סרוגה בעבודת יד, גודל בינוני.",
    emoji: "🧢",
    image: "",
    supplierUrl: "",
    demo: true,
  },
  {
    id: "demo-kippa-velvet-black",
    name: "כיפת קטיפה שחורה",
    category: "kippot",
    price: 39,
    comparePrice: 49,
    description: "כיפת קטיפה שחורה עם בטנה רכה, נוחה לשימוש יומיומי ולשבת.",
    details: ["קטיפה רכה", "מתאימה לשבת וחג"],
    emoji: "🧢",
    image: "",
    supplierUrl: "",
    demo: true,
  },
  {
    id: "demo-kippa-embroidered",
    name: "כיפה רקומה לאירועים",
    category: "kippot",
    price: 49,
    description: "כיפה עם רקמה עדינה בגוון זהב, מושלמת לחתונות ולאירועים.",
    emoji: "🧢",
    image: "",
    supplierUrl: "",
    demo: true,
  },
  {
    id: "demo-candlesticks-brass",
    name: "זוג פמוטים להדלקת נרות שבת",
    category: "candles",
    price: 89,
    comparePrice: 109,
    description: "זוג פמוטים בגימור פליז, גובה 20 ס״מ.",
    emoji: "🕯️",
    image: "",
    supplierUrl: "",
    demo: true,
  },
  {
    id: "demo-menorah-hanukkah",
    name: "חנוכייה מתכת",
    category: "candles",
    price: 79,
    description: "חנוכייה ל-9 נרות, מתאימה לנרות חנוכה רגילים.",
    emoji: "🕎",
    image: "",
    supplierUrl: "",
    demo: true,
  },
  {
    id: "demo-candle-tray",
    name: "מגש להדלקת נרות",
    category: "candles",
    price: 69,
    description: "מגש מעוצב שמגן על השולחן ומשלים את פמוטי השבת.",
    emoji: "🕯️",
    image: "",
    supplierUrl: "",
    demo: true,
  },
  {
    id: "demo-kiddush-cup",
    name: "גביע קידוש מעוצב",
    category: "other",
    price: 79,
    description: "גביע קידוש בגימור מט עם רגל גבוהה, מתנה אלגנטית לבית חדש.",
    emoji: "🍷",
    image: "",
    supplierUrl: "",
    demo: true,
  },
  {
    id: "demo-netilat-yadayim",
    name: "כוס נטילת ידיים",
    category: "other",
    price: 59,
    description: "כוס נטילת ידיים דו-צדדית עם ידיות נוחות.",
    emoji: "🥛",
    image: "",
    supplierUrl: "",
    demo: true,
  },
  {
    id: "demo-tallit-bag",
    name: "תיק טלית ותפילין",
    category: "other",
    price: 109,
    description: "תיק מרווח עם ריפוד פנימי, מתאים לטלית ולתפילין.",
    emoji: "🎒",
    image: "",
    supplierUrl: "",
    demo: true,
  },
];

// רק מוצרים מפורסמים מוצגים באתר ומתקבלים בהזמנות
export const products = allProducts.filter((p) => p.published !== false);

// קטגוריות שיש בהן לפחות מוצר אחד
export const activeCategories = Object.fromEntries(
  Object.entries(categories).filter(([key]) =>
    products.some((p) => p.category === key)
  )
);

export function getProduct(id) {
  return products.find((p) => p.id === id);
}

// הגדרות משלוח - לשינוי לפי העלויות שלך
export const FREE_SHIPPING_FROM = 200;
export const SHIPPING_PRICE = 25;

export function shippingFor(subtotal) {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_PRICE;
}

export const formatPrice = (n) => `₪${n.toLocaleString("he-IL")}`;

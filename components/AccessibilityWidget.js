"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "a11y-settings";
const DEFAULTS = {
  size: 0, // 0..4, כל שלב מוסיף 10% לגודל הטקסט
  contrast: false,
  grayscale: false,
  links: false,
  readable: false,
  nomotion: false,
};

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState(DEFAULTS);

  // טעינת הגדרות שמורות
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved) setS({ ...DEFAULTS, ...saved });
    } catch {}
  }, []);

  // החלת ההגדרות על כל האתר
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${100 + s.size * 10}%`;
    root.classList.toggle("a11y-contrast", s.contrast);
    root.classList.toggle("a11y-gray", s.grayscale);
    root.classList.toggle("a11y-links", s.links);
    root.classList.toggle("a11y-readable", s.readable);
    root.classList.toggle("a11y-nomotion", s.nomotion);
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {}
  }, [s]);

  // סגירה ב-Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = (k) => setS((p) => ({ ...p, [k]: !p[k] }));
  const bump = (d) => setS((p) => ({ ...p, size: Math.max(0, Math.min(4, p.size + d)) }));

  const Toggle = ({ k, label }) => (
    <button type="button" className="a11y-opt" aria-pressed={s[k]} onClick={() => toggle(k)}>
      {label}
    </button>
  );

  return (
    <div className="a11y-root">
      <button
        type="button"
        className="a11y-fab"
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen(!open)}
      >
        <span aria-hidden="true">♿</span>
        <span className="sr-only">תפריט נגישות</span>
      </button>

      {open && (
        <div id="a11y-panel" role="dialog" aria-label="תפריט נגישות" className="a11y-panel">
          <div className="a11y-head">
            <strong>נגישות</strong>
            <button type="button" className="a11y-opt" onClick={() => setOpen(false)}>
              סגירה
            </button>
          </div>
          <div className="a11y-grid">
            <button type="button" className="a11y-opt" onClick={() => bump(1)} disabled={s.size >= 4}>
              הגדלת טקסט
            </button>
            <button type="button" className="a11y-opt" onClick={() => bump(-1)} disabled={s.size <= 0}>
              הקטנת טקסט
            </button>
            <Toggle k="contrast" label="ניגודיות גבוהה" />
            <Toggle k="grayscale" label="גווני אפור" />
            <Toggle k="links" label="הדגשת קישורים" />
            <Toggle k="readable" label="פונט קריא" />
            <Toggle k="nomotion" label="עצירת אנימציות" />
            <button type="button" className="a11y-opt" onClick={() => setS(DEFAULTS)}>
              איפוס הגדרות
            </button>
          </div>
          <Link href="/accessibility" onClick={() => setOpen(false)}>
            הצהרת נגישות
          </Link>
        </div>
      )}
    </div>
  );
}

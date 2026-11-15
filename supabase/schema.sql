-- מריצים פעם אחת ב-Supabase: SQL Editor → New query → Run.
-- אין מדיניות קריאה ציבורית. רק מפתח service role בשרת נוגע בטבלה.

create table if not exists public.orders (
  order_id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending_payment',
  customer jsonb not null,
  lines jsonb not null,
  subtotal integer not null,
  shipping integer not null,
  total integer not null,
  payment_provider text,
  payment_process_id text,
  payment_process_token text,
  payment_ref text,
  paid_at timestamptz
);

alter table public.orders enable row level security;

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_process_idx on public.orders (payment_process_id);

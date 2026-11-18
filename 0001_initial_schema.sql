-- Nexora initial schema. Review and test in a non-production Supabase project first.
create extension if not exists pgcrypto;

create type public.account_status as enum ('active', 'suspended', 'pending');
create type public.publish_status as enum ('draft', 'published', 'archived');
create type public.product_kind as enum ('template', 'bundle', 'digital_tool', 'other');
create type public.order_status as enum ('pending', 'paid', 'cancelled', 'refunded', 'failed');
create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'cancelled', 'expired');
create type public.access_source as enum ('purchase', 'subscription', 'grant');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_path text,
  country_code char(2),
  preferred_locale text not null default 'en' check (preferred_locale in ('en','ar','hi','bn','es','pt')),
  preferred_currency char(3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.languages (
  code text primary key check (code in ('en','ar','hi','bn','es','pt')),
  name text not null,
  native_name text not null,
  direction text not null check (direction in ('ltr','rtl')),
  enabled boolean not null default true
);
insert into public.languages(code,name,native_name,direction) values
 ('en','English','English','ltr'), ('ar','Arabic','العربية','rtl'),
 ('hi','Hindi','हिन्दी','ltr'), ('bn','Bengali','বাংলা','ltr'),
 ('es','Spanish','Español','ltr'), ('pt','Portuguese','Português','ltr');

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  role_key text unique not null,
  description text
);
create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  primary key(user_id, role_id)
);
insert into public.roles(role_key,description) values
 ('customer','Standard customer'), ('content_manager','Manage catalog content'),
 ('support','Customer support'), ('administrator','Full platform administration');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  category_type text not null check (category_type in ('calculator','template','tool','blog')),
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now()
);
create table public.category_translations (
  category_id uuid not null references public.categories(id) on delete cascade,
  locale text not null references public.languages(code),
  name text not null,
  slug text not null,
  description text,
  primary key(category_id, locale),
  unique(locale, slug, category_id)
);

create table public.calculators (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  calculator_key text unique not null,
  engine_key text not null,
  is_premium boolean not null default false,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.calculator_translations (
  calculator_id uuid not null references public.calculators(id) on delete cascade,
  locale text not null references public.languages(code),
  title text not null,
  slug text not null,
  description text,
  instructions text,
  seo_title text,
  seo_description text,
  primary key(calculator_id, locale),
  unique(locale, slug)
);
create table public.calculator_versions (
  id uuid primary key default gen_random_uuid(),
  calculator_id uuid not null references public.calculators(id) on delete cascade,
  version integer not null,
  formula_config jsonb not null default '{}'::jsonb,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  unique(calculator_id, version)
);
create table public.calculator_fields (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.calculator_versions(id) on delete cascade,
  field_key text not null,
  field_type text not null,
  validation jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  unique(version_id, field_key)
);
create table public.calculator_field_translations (
  field_id uuid not null references public.calculator_fields(id) on delete cascade,
  locale text not null references public.languages(code),
  label text not null,
  help_text text,
  placeholder text,
  primary key(field_id, locale)
);
create table public.saved_calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  calculator_id uuid not null references public.calculators(id) on delete cascade,
  input_data jsonb not null,
  result_data jsonb not null,
  created_at timestamptz not null default now()
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  format text not null,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.template_translations (
  template_id uuid not null references public.templates(id) on delete cascade,
  locale text not null references public.languages(code),
  title text not null,
  slug text not null,
  description text,
  seo_title text,
  seo_description text,
  primary key(template_id, locale),
  unique(locale, slug)
);
create table public.template_files (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  version integer not null default 1,
  is_paid_asset boolean not null default true,
  created_at timestamptz not null default now(),
  unique(template_id, version, file_name)
);
create table public.template_previews (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  product_kind public.product_kind not null,
  template_id uuid unique references public.templates(id) on delete set null,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.product_translations (
  product_id uuid not null references public.products(id) on delete cascade,
  locale text not null references public.languages(code),
  title text not null,
  slug text not null,
  description text,
  primary key(product_id, locale),
  unique(locale, slug)
);
create table public.product_prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  currency char(3) not null,
  amount_minor bigint not null check (amount_minor >= 0),
  active boolean not null default true,
  unique(product_id, currency)
);
create table public.product_licenses (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  license_key text not null,
  terms text,
  unique(product_id, license_key)
);
create table public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  review text,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  unique(product_id, user_id)
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  plan_key text unique not null,
  status public.publish_status not null default 'draft'
);
create table public.plan_translations (
  plan_id uuid not null references public.plans(id) on delete cascade,
  locale text not null references public.languages(code),
  name text not null,
  description text,
  primary key(plan_id, locale)
);
create table public.plan_prices (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  billing_period text not null check (billing_period in ('monthly','yearly')),
  currency char(3) not null,
  amount_minor bigint not null check (amount_minor >= 0),
  unique(plan_id, billing_period, currency)
);
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  provider text,
  provider_subscription_id text unique,
  status public.subscription_status not null default 'trialing',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  order_number text unique not null,
  currency char(3) not null,
  subtotal_minor bigint not null check (subtotal_minor >= 0),
  discount_minor bigint not null default 0 check (discount_minor >= 0),
  tax_minor bigint not null default 0 check (tax_minor >= 0),
  total_minor bigint not null check (total_minor >= 0),
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null default 1 check (quantity > 0),
  unit_amount_minor bigint not null check (unit_amount_minor >= 0),
  product_title_snapshot text not null
);
create table public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  provider_reference text unique,
  amount_minor bigint not null check (amount_minor >= 0),
  currency char(3) not null,
  status text not null,
  raw_event_reference text,
  created_at timestamptz not null default now()
);
create table public.crypto_payment_details (
  transaction_id uuid primary key references public.payment_transactions(id) on delete cascade,
  payment_id text not null unique,
  pay_address text not null,
  pay_amount text not null,
  pay_currency text not null,
  expires_at timestamptz,
  provider_purchase_id text,
  actually_paid text,
  last_status text not null default 'waiting',
  created_at timestamptz not null default now()
);
create index idx_crypto_payment_details_status on public.crypto_payment_details(last_status);
create table public.refunds (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.payment_transactions(id),
  amount_minor bigint not null check (amount_minor > 0),
  status text not null,
  created_at timestamptz not null default now()
);
create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete cascade,
  source public.access_source not null,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  check (product_id is not null or plan_id is not null)
);

create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null check (entity_type in ('calculator','template','product')),
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  primary key(user_id, entity_type, entity_id)
);
create table public.download_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  template_file_id uuid not null references public.template_files(id),
  created_at timestamptz not null default now()
);
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.blog_translations (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  locale text not null references public.languages(code),
  slug text not null,
  title text not null,
  excerpt text,
  content jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  primary key(post_id, locale),
  unique(locale, slug)
);
create table public.site_settings (
  setting_key text primary key,
  setting_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_calculators_status_category on public.calculators(status, category_id);
create index idx_templates_status_category on public.templates(status, category_id);
create index idx_products_status on public.products(status);
create index idx_orders_user_created on public.orders(user_id, created_at desc);
create index idx_subscriptions_user_status on public.subscriptions(user_id, status);
create index idx_entitlements_user_expiry on public.entitlements(user_id, expires_at);
create index idx_download_events_user_created on public.download_events(user_id, created_at desc);

-- RLS is enabled for user-owned data. Add reviewed admin policies and server-only
-- catalog write policies before enabling production workflows.
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.saved_calculations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.orders enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.crypto_payment_details enable row level security;
alter table public.order_items enable row level security;
alter table public.favorites enable row level security;
alter table public.download_events enable row level security;
alter table public.entitlements enable row level security;

create policy "Users can read own profile" on public.profiles
for select to authenticated using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can read own saved calculations" on public.saved_calculations
for select to authenticated using (auth.uid() = user_id);
create policy "Users can manage own saved calculations" on public.saved_calculations
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can read own favorites" on public.favorites
for select to authenticated using (auth.uid() = user_id);
create policy "Users can manage own favorites" on public.favorites
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can read own subscriptions" on public.subscriptions
for select to authenticated using (auth.uid() = user_id);
create policy "Users can read own orders" on public.orders
for select to authenticated using (auth.uid() = user_id);
create policy "Users can read own payment transactions" on public.payment_transactions
for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "Users can read own crypto payment details" on public.crypto_payment_details
for select to authenticated using (exists (select 1 from public.payment_transactions pt join public.orders o on o.id = pt.order_id where pt.id = transaction_id and o.user_id = auth.uid()));
create policy "Users can read own order items" on public.order_items
for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "Users can read own entitlements" on public.entitlements
for select to authenticated using (auth.uid() = user_id);
create policy "Users can read own download events" on public.download_events
for select to authenticated using (auth.uid() = user_id);

-- Profile creation trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

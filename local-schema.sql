PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS local_users (id text primary key, email text unique, created_at text not null default (datetime('now')));
-- Nexora initial schema. Review and test in a non-production Supabase project first.
create table profiles (
  id text primary key references local_users(id) on delete cascade,
  display_name text,
  avatar_path text,
  country_code text,
  preferred_locale text not null default 'en' check (preferred_locale in ('en','ar','hi','bn','es','pt')),
  preferred_currency text,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);

create table languages (
  code text primary key check (code in ('en','ar','hi','bn','es','pt')),
  name text not null,
  native_name text not null,
  direction text not null check (direction in ('ltr','rtl')),
  enabled boolean not null default true
);
insert into languages(code,name,native_name,direction) values
 ('en','English','English','ltr'), ('ar','Arabic','العربية','rtl'),
 ('hi','Hindi','हिन्दी','ltr'), ('bn','Bengali','বাংলা','ltr'),
 ('es','Spanish','Español','ltr'), ('pt','Portuguese','Português','ltr');

create table roles (
  id text primary key default (lower(hex(randomblob(16)))),
  role_key text unique not null,
  description text
);
create table user_roles (
  user_id text not null references local_users(id) on delete cascade,
  role_id text not null references roles(id) on delete cascade,
  primary key(user_id, role_id)
);
insert into roles(role_key,description) values
 ('customer','Standard customer'), ('content_manager','Manage catalog content'),
 ('support','Customer support'), ('administrator','Full platform administration');

create table categories (
  id text primary key default (lower(hex(randomblob(16)))),
  parent_id text references categories(id) on delete set null,
  category_type text not null check (category_type in ('calculator','template','tool','blog')),
  sort_order integer not null default 0,
  status publish_status not null default 'draft',
  created_at text not null default (datetime('now'))
);
create table category_translations (
  category_id text not null references categories(id) on delete cascade,
  locale text not null references languages(code),
  name text not null,
  slug text not null,
  description text,
  primary key(category_id, locale),
  unique(locale, slug, category_id)
);

create table calculators (
  id text primary key default (lower(hex(randomblob(16)))),
  category_id text references categories(id) on delete set null,
  calculator_key text unique not null,
  engine_key text not null,
  is_premium boolean not null default false,
  status publish_status not null default 'draft',
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);
create table calculator_translations (
  calculator_id text not null references calculators(id) on delete cascade,
  locale text not null references languages(code),
  title text not null,
  slug text not null,
  description text,
  instructions text,
  seo_title text,
  seo_description text,
  primary key(calculator_id, locale),
  unique(locale, slug)
);
create table calculator_versions (
  id text primary key default (lower(hex(randomblob(16)))),
  calculator_id text not null references calculators(id) on delete cascade,
  version integer not null,
  formula_config text not null default '{}',
  is_active boolean not null default false,
  created_at text not null default (datetime('now')),
  unique(calculator_id, version)
);
create table calculator_fields (
  id text primary key default (lower(hex(randomblob(16)))),
  version_id text not null references calculator_versions(id) on delete cascade,
  field_key text not null,
  field_type text not null,
  validation text not null default '{}',
  sort_order integer not null default 0,
  unique(version_id, field_key)
);
create table calculator_field_translations (
  field_id text not null references calculator_fields(id) on delete cascade,
  locale text not null references languages(code),
  label text not null,
  help_text text,
  placeholder text,
  primary key(field_id, locale)
);
create table saved_calculations (
  id text primary key default (lower(hex(randomblob(16)))),
  user_id text not null references local_users(id) on delete cascade,
  calculator_id text not null references calculators(id) on delete cascade,
  input_data text not null,
  result_data text not null,
  created_at text not null default (datetime('now'))
);

create table templates (
  id text primary key default (lower(hex(randomblob(16)))),
  category_id text references categories(id) on delete set null,
  format text not null,
  status publish_status not null default 'draft',
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);
create table template_translations (
  template_id text not null references templates(id) on delete cascade,
  locale text not null references languages(code),
  title text not null,
  slug text not null,
  description text,
  seo_title text,
  seo_description text,
  primary key(template_id, locale),
  unique(locale, slug)
);
create table template_files (
  id text primary key default (lower(hex(randomblob(16)))),
  template_id text not null references templates(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  version integer not null default 1,
  is_paid_asset boolean not null default true,
  created_at text not null default (datetime('now')),
  unique(template_id, version, file_name)
);
create table template_previews (
  id text primary key default (lower(hex(randomblob(16)))),
  template_id text not null references templates(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0
);

create table products (
  id text primary key default (lower(hex(randomblob(16)))),
  product_kind product_kind not null,
  template_id text unique references templates(id) on delete set null,
  status publish_status not null default 'draft',
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);
create table product_translations (
  product_id text not null references products(id) on delete cascade,
  locale text not null references languages(code),
  title text not null,
  slug text not null,
  description text,
  primary key(product_id, locale),
  unique(locale, slug)
);
create table product_prices (
  id text primary key default (lower(hex(randomblob(16)))),
  product_id text not null references products(id) on delete cascade,
  currency text not null,
  amount_minor integer not null check (amount_minor >= 0),
  active boolean not null default true,
  unique(product_id, currency)
);
create table product_licenses (
  id text primary key default (lower(hex(randomblob(16)))),
  product_id text not null references products(id) on delete cascade,
  license_key text not null,
  terms text,
  unique(product_id, license_key)
);
create table product_reviews (
  id text primary key default (lower(hex(randomblob(16)))),
  product_id text not null references products(id) on delete cascade,
  user_id text not null references local_users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  review text,
  status publish_status not null default 'draft',
  created_at text not null default (datetime('now')),
  unique(product_id, user_id)
);

create table plans (
  id text primary key default (lower(hex(randomblob(16)))),
  plan_key text unique not null,
  status publish_status not null default 'draft'
);
create table plan_translations (
  plan_id text not null references plans(id) on delete cascade,
  locale text not null references languages(code),
  name text not null,
  description text,
  primary key(plan_id, locale)
);
create table plan_prices (
  id text primary key default (lower(hex(randomblob(16)))),
  plan_id text not null references plans(id) on delete cascade,
  billing_period text not null check (billing_period in ('monthly','yearly')),
  currency text not null,
  amount_minor integer not null check (amount_minor >= 0),
  unique(plan_id, billing_period, currency)
);
create table subscriptions (
  id text primary key default (lower(hex(randomblob(16)))),
  user_id text not null references local_users(id) on delete cascade,
  plan_id text not null references plans(id),
  provider text,
  provider_subscription_id text unique,
  status subscription_status not null default 'trialing',
  current_period_start text,
  current_period_end text,
  cancel_at_period_end boolean not null default false,
  created_at text not null default (datetime('now'))
);

create table orders (
  id text primary key default (lower(hex(randomblob(16)))),
  user_id text references local_users(id) on delete set null,
  order_number text unique not null,
  currency text not null,
  subtotal_minor integer not null check (subtotal_minor >= 0),
  discount_minor integer not null default 0 check (discount_minor >= 0),
  tax_minor integer not null default 0 check (tax_minor >= 0),
  total_minor integer not null check (total_minor >= 0),
  status order_status not null default 'pending',
  created_at text not null default (datetime('now'))
);
create table order_items (
  id text primary key default (lower(hex(randomblob(16)))),
  order_id text not null references orders(id) on delete cascade,
  product_id text not null references products(id),
  quantity integer not null default 1 check (quantity > 0),
  unit_amount_minor integer not null check (unit_amount_minor >= 0),
  product_title_snapshot text not null
);
create table payment_transactions (
  id text primary key default (lower(hex(randomblob(16)))),
  order_id text not null references orders(id) on delete cascade,
  provider text not null,
  provider_reference text unique,
  amount_minor integer not null check (amount_minor >= 0),
  currency text not null,
  status text not null,
  raw_event_reference text,
  created_at text not null default (datetime('now'))
);
create table crypto_payment_details (
  transaction_id text primary key references payment_transactions(id) on delete cascade,
  payment_id text not null unique,
  pay_address text not null,
  pay_amount text not null,
  pay_currency text not null,
  expires_at text,
  provider_purchase_id text,
  actually_paid text,
  last_status text not null default 'waiting',
  created_at text not null default (datetime('now'))
);
create index idx_crypto_payment_details_status on crypto_payment_details(last_status);
create table refunds (
  id text primary key default (lower(hex(randomblob(16)))),
  transaction_id text not null references payment_transactions(id),
  amount_minor integer not null check (amount_minor > 0),
  status text not null,
  created_at text not null default (datetime('now'))
);
create table entitlements (
  id text primary key default (lower(hex(randomblob(16)))),
  user_id text not null references local_users(id) on delete cascade,
  product_id text references products(id) on delete cascade,
  plan_id text references plans(id) on delete cascade,
  source access_source not null,
  starts_at text not null default (datetime('now')),
  expires_at text,
  check (product_id is not null or plan_id is not null)
);

create table favorites (
  user_id text not null references local_users(id) on delete cascade,
  entity_type text not null check (entity_type in ('calculator','template','product')),
  entity_id text not null,
  created_at text not null default (datetime('now')),
  primary key(user_id, entity_type, entity_id)
);
create table download_events (
  id text primary key default (lower(hex(randomblob(16)))),
  user_id text references local_users(id) on delete set null,
  template_file_id text not null references template_files(id),
  created_at text not null default (datetime('now'))
);
create table blog_posts (
  id text primary key default (lower(hex(randomblob(16)))),
  status publish_status not null default 'draft',
  published_at text,
  created_at text not null default (datetime('now'))
);
create table blog_translations (
  post_id text not null references blog_posts(id) on delete cascade,
  locale text not null references languages(code),
  slug text not null,
  title text not null,
  excerpt text,
  content text not null default '{}',
  seo_title text,
  seo_description text,
  primary key(post_id, locale),
  unique(locale, slug)
);
create table site_settings (
  setting_key text primary key,
  setting_value text not null default '{}',
  updated_at text not null default (datetime('now'))
);
create table audit_logs (
  id text primary key default (lower(hex(randomblob(16)))),
  actor_user_id text references local_users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  metadata text not null default '{}',
  created_at text not null default (datetime('now'))
);

create index idx_calculators_status_category on calculators(status, category_id);
create index idx_templates_status_category on templates(status, category_id);
create index idx_products_status on products(status);
create index idx_orders_user_created on orders(user_id, created_at desc);
create index idx_subscriptions_user_status on subscriptions(user_id, status);
create index idx_entitlements_user_expiry on entitlements(user_id, expires_at);
create index idx_download_events_user_created on download_events(user_id, created_at desc);


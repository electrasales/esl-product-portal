-- ESL Product Portal database schema.
-- Safe to re-run any time in your Supabase project's SQL editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run) -- every policy is
-- dropped and recreated, so re-running just picks up the latest version.

-- 1. Profiles: one row per signed-up user, holds their role.
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('customer', 'owner', 'staff'));

alter table profiles add column if not exists email text not null default '';

-- Backfill email for any profiles created before the email column existed.
update profiles
set email = auth.users.email
from auth.users
where profiles.id = auth.users.id and profiles.email = '';

-- Auto-create a profile row whenever someone signs up.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- 2. Products: the catalog, managed by owners and staff.
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  sku text not null default '',
  price numeric(12, 2) not null default 0,
  category text not null default '',
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Requests: a customer's submitted quote/order request.
create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles (id) on delete cascade,
  status text not null default 'new' check (status in ('new', 'reviewed', 'fulfilled')),
  notes text not null default '',
  created_at timestamptz not null default now()
);

-- 4. Request items: line items on a request, with price/name snapshotted
--    at submission time so past quotes stay accurate if prices change later.
create table if not exists request_items (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  product_name_snapshot text not null,
  unit_price_snapshot numeric(12, 2) not null,
  quantity integer not null check (quantity > 0)
);

-- Row Level Security -------------------------------------------------------

alter table profiles enable row level security;
alter table products enable row level security;
alter table requests enable row level security;
alter table request_items enable row level security;

-- Helper: is the current user an owner?
create or replace function is_owner()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'owner'
  );
$$;

-- Helper: is the current user an owner or staff member?
create or replace function is_staff_or_owner()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role in ('owner', 'staff')
  );
$$;

-- profiles: everyone can read their own profile; owners/staff can read all
-- (staff needs this to see customer names on the requests page). Only
-- owners can update someone else's row (e.g. change their role).
drop policy if exists "profiles_select_own_or_owner" on profiles;
create policy "profiles_select_own_or_staff" on profiles
  for select using (id = auth.uid() or is_staff_or_owner());

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());

drop policy if exists "profiles_update_owner_any" on profiles;
create policy "profiles_update_owner_any" on profiles
  for update using (is_owner());

-- products: any signed-in user can read; owners/staff can write.
drop policy if exists "products_select_authenticated" on products;
create policy "products_select_authenticated" on products
  for select using (auth.uid() is not null);

drop policy if exists "products_insert_owner" on products;
create policy "products_insert_staff" on products
  for insert with check (is_staff_or_owner());

drop policy if exists "products_update_owner" on products;
create policy "products_update_staff" on products
  for update using (is_staff_or_owner());

drop policy if exists "products_delete_owner" on products;
create policy "products_delete_staff" on products
  for delete using (is_staff_or_owner());

-- requests: customers see/create their own; owners/staff see/update all.
drop policy if exists "requests_select_own_or_owner" on requests;
create policy "requests_select_own_or_staff" on requests
  for select using (customer_id = auth.uid() or is_staff_or_owner());

drop policy if exists "requests_insert_own" on requests;
create policy "requests_insert_own" on requests
  for insert with check (customer_id = auth.uid());

drop policy if exists "requests_update_owner" on requests;
create policy "requests_update_staff" on requests
  for update using (is_staff_or_owner());

-- request_items: visible/insertable if you can see/own the parent request.
drop policy if exists "request_items_select" on request_items;
create policy "request_items_select" on request_items
  for select using (
    exists (
      select 1 from requests
      where requests.id = request_items.request_id
        and (requests.customer_id = auth.uid() or is_staff_or_owner())
    )
  );

drop policy if exists "request_items_insert" on request_items;
create policy "request_items_insert" on request_items
  for insert with check (
    exists (
      select 1 from requests
      where requests.id = request_items.request_id
        and requests.customer_id = auth.uid()
    )
  );

-- Storage: a public bucket for product images, owner/staff-only uploads.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product_images_owner_write" on storage.objects;
create policy "product_images_staff_write" on storage.objects
  for insert with check (bucket_id = 'product-images' and is_staff_or_owner());

drop policy if exists "product_images_owner_update" on storage.objects;
create policy "product_images_staff_update" on storage.objects
  for update using (bucket_id = 'product-images' and is_staff_or_owner());

drop policy if exists "product_images_owner_delete" on storage.objects;
create policy "product_images_staff_delete" on storage.objects
  for delete using (bucket_id = 'product-images' and is_staff_or_owner());

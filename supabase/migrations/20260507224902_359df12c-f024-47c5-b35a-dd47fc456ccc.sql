
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users see own roles" on public.user_roles for select using (auth.uid() = user_id);
create policy "Admins manage roles" on public.user_roles for all using (public.has_role(auth.uid(), 'admin'));

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  email text,
  avatar_url text,
  wallet_balance numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Profiles viewable by owner" on public.profiles for select using (auth.uid() = id or public.has_role(auth.uid(),'admin'));
create policy "Profiles updatable by owner" on public.profiles for update using (auth.uid() = id or public.has_role(auth.uid(),'admin'));
create policy "Profiles insertable by owner" on public.profiles for insert with check (auth.uid() = id);

-- auto-create profile + default role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, username, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  price_per_unit numeric not null,
  min_quantity int not null default 100,
  max_quantity int not null default 100000,
  platform text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.services enable row level security;
create policy "Active services public" on public.services for select using (is_active or public.has_role(auth.uid(),'admin'));
create policy "Admins manage services" on public.services for all using (public.has_role(auth.uid(),'admin'));

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid not null references public.services(id),
  quantity int not null,
  total_price numeric not null,
  status text not null default 'pending',
  link text not null,
  notes text,
  provider_order_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "Orders viewable by owner" on public.orders for select using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "Orders insertable by owner" on public.orders for insert with check (auth.uid() = user_id);
create policy "Orders updatable by admin" on public.orders for update using (public.has_role(auth.uid(),'admin'));

-- Transactions
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  amount numeric not null,
  reference text,
  status text not null default 'pending',
  metadata jsonb,
  created_at timestamptz not null default now()
);
alter table public.transactions enable row level security;
create policy "Tx viewable by owner" on public.transactions for select using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "Tx insertable by owner" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Tx admin manage" on public.transactions for all using (public.has_role(auth.uid(),'admin'));

-- Blog
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  category text not null default 'SMM Tips',
  author_id uuid references public.profiles(id),
  thumbnail_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.blog_posts enable row level security;
create policy "Published blogs public" on public.blog_posts for select using (published or public.has_role(auth.uid(),'admin'));
create policy "Admin manage blog" on public.blog_posts for all using (public.has_role(auth.uid(),'admin'));

-- Realtime for orders
alter publication supabase_realtime add table public.orders;

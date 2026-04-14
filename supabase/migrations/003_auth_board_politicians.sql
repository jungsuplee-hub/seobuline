alter table if exists public.politicians
  add column if not exists office_type text,
  add column if not exists region_tags text[] default '{}',
  add column if not exists stance_or_relevance text,
  add column if not exists official_website text,
  add column if not exists x_url text,
  add column if not exists blog_url text,
  add column if not exists office_phone text;

alter table if exists public.politicians
  alter column is_visible set default true;

create policy if not exists "profiles self readable" on public.profiles for select using (auth.uid() = user_id);
create policy if not exists "profiles self upsert" on public.profiles for insert with check (auth.uid() = user_id);
create policy if not exists "profiles self update" on public.profiles for update using (auth.uid() = user_id);

create policy if not exists "users insert posts" on public.posts for insert with check (
  exists (select 1 from public.profiles p where p.id = author_id and p.user_id = auth.uid())
);

create policy if not exists "users update own posts" on public.posts for update using (
  exists (select 1 from public.profiles p where p.id = author_id and p.user_id = auth.uid())
  or exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('moderator','admin'))
);

create policy if not exists "users delete own posts" on public.posts for delete using (
  exists (select 1 from public.profiles p where p.id = author_id and p.user_id = auth.uid())
  or exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('moderator','admin'))
);

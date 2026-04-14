alter table if exists public.timeline_items
  add column if not exists source_url text,
  add column if not exists source_name text,
  add column if not exists reference_date date;

alter table if exists public.politicians
  add column if not exists source_name text,
  add column if not exists reference_date date;

alter table if exists public.resources
  add column if not exists source_url text,
  add column if not exists published_date date;

alter table if exists public.faq_items
  add column if not exists source_url text,
  add column if not exists source_name text,
  add column if not exists reference_date date;

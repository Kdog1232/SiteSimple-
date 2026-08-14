-- Run this entire file once in the Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  business_name text not null,
  email text not null,
  phone text,
  business_type text not null,
  current_website text,
  package_interest text not null,
  owns_domain text not null,
  description text not null,
  goal text not null,
  notes text,
  status text not null default 'new',
  source text not null default 'website',
  submission_id uuid not null unique,
  owner_email_status text not null default 'pending',
  owner_email_id text,
  customer_email_status text not null default 'pending',
  customer_email_id text,
  email_last_error text
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_created_at_idx on public.inquiries (status, created_at desc);
alter table public.inquiries enable row level security;

-- This table contains only salted SHA-256 request fingerprints, never raw IP addresses.
create table if not exists public.inquiry_rate_limits (
  fingerprint_hash text not null,
  window_started_at timestamptz not null,
  request_count integer not null default 1,
  primary key (fingerprint_hash, window_started_at)
);
alter table public.inquiry_rate_limits enable row level security;
create index if not exists inquiry_rate_limits_window_idx on public.inquiry_rate_limits (window_started_at);

-- Atomically count a request in the current window. This function is callable only
-- by the server's service role; no browser policies are created for either table.
create or replace function public.check_inquiry_rate_limit(
  p_fingerprint_hash text,
  p_maximum_requests integer default 5,
  p_window_seconds integer default 3600
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_window timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  new_count integer;
begin
  insert into public.inquiry_rate_limits as limits (fingerprint_hash, window_started_at, request_count)
  values (p_fingerprint_hash, current_window, 1)
  on conflict (fingerprint_hash, window_started_at)
  do update set request_count = limits.request_count + 1
  returning request_count into new_count;
  return new_count <= p_maximum_requests;
end;
$$;

revoke all on function public.check_inquiry_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_inquiry_rate_limit(text, integer, integer) to service_role;

-- Optional maintenance command (run periodically if desired):
-- delete from public.inquiry_rate_limits where window_started_at < now() - interval '2 days';

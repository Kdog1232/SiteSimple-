-- Run only in the Supabase project matching Vercel Production's SUPABASE_URL.
-- Use this setup if the inquiry table or its rate-limit function is missing.
begin;

create table if not exists public.sitesimple_inquiries (
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
  source text not null default 'sitesimple_web',
  submission_id uuid not null unique,
  owner_email_status text not null default 'pending',
  owner_email_id text,
  customer_email_status text not null default 'pending',
  customer_email_id text,
  email_last_error text
);

alter table public.sitesimple_inquiries enable row level security;
revoke all on table public.sitesimple_inquiries from public, anon, authenticated;
grant select, insert, update on table public.sitesimple_inquiries to service_role;

do $setup$
begin
  if to_regprocedure('public.sitesimple_check_inquiry_rate_limit(text,integer,integer)') is null then
    create table if not exists public.sitesimple_inquiry_request_windows (
      fingerprint text primary key,
      window_started_at timestamptz not null,
      request_count integer not null
    );

    alter table public.sitesimple_inquiry_request_windows enable row level security;
    revoke all on table public.sitesimple_inquiry_request_windows from public, anon, authenticated;
    grant select, insert, update on table public.sitesimple_inquiry_request_windows to service_role;

    execute $ddl$
      create function public.sitesimple_check_inquiry_rate_limit(
        p_fingerprint text,
        p_max_requests integer,
        p_window_minutes integer
      ) returns boolean
      language sql
      set search_path = ''
      as $function$
        insert into public.sitesimple_inquiry_request_windows as windows
          (fingerprint, window_started_at, request_count)
        values (p_fingerprint, statement_timestamp(), 1)
        on conflict (fingerprint) do update set
          request_count = case
            when windows.window_started_at <= excluded.window_started_at - make_interval(mins => p_window_minutes)
              then 1
            else least(windows.request_count + 1, p_max_requests + 1)
          end,
          window_started_at = case
            when windows.window_started_at <= excluded.window_started_at - make_interval(mins => p_window_minutes)
              then excluded.window_started_at
            else windows.window_started_at
          end
        returning windows.request_count <= p_max_requests
      $function$
    $ddl$;

    revoke all on function public.sitesimple_check_inquiry_rate_limit(text, integer, integer) from public, anon, authenticated;
    grant execute on function public.sitesimple_check_inquiry_rate_limit(text, integer, integer) to service_role;
  end if;
end;
$setup$;

notify pgrst, 'reload schema';
commit;

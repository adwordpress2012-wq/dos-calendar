create extension if not exists pgcrypto;

create type public.dos_calendar_booking_status as enum (
  'requested',
  'confirmed',
  'reschedule-requested',
  'cancelled',
  'completed',
  'no-show'
);

create type public.dos_calendar_source_system as enum (
  'micah',
  'dos-website',
  'doslead',
  'guestmate',
  'quoteos',
  'agentmate',
  'manual'
);

create type public.dos_calendar_notification_channel as enum (
  'email',
  'sms',
  'internal'
);

create type public.dos_calendar_notification_status as enum (
  'pending',
  'sent',
  'failed',
  'skipped'
);

create table public.dos_calendar_tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dos_calendar_tenant_members (
  tenant_id uuid not null references public.dos_calendar_tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'operator',
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

create table public.dos_calendar_booking_types (
  id text primary key,
  label text not null,
  default_duration_minutes integer not null,
  next_action_label text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.dos_calendar_contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.dos_calendar_tenants(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  source_system public.dos_calendar_source_system not null,
  organization text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dos_calendar_contact_lookup unique nulls not distinct (tenant_id, email, phone)
);

create table public.dos_calendar_bookings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.dos_calendar_tenants(id) on delete cascade,
  contact_id uuid not null references public.dos_calendar_contacts(id) on delete restrict,
  booking_type_id text not null references public.dos_calendar_booking_types(id) on delete restrict,
  source_system public.dos_calendar_source_system not null,
  status public.dos_calendar_booking_status not null default 'requested',
  title text not null,
  service_type text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  timezone text not null default 'Australia/Sydney',
  notes text,
  next_action_label text not null,
  next_action_due_at timestamptz not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dos_calendar_booking_time_order check (end_at > start_at)
);

create table public.dos_calendar_notification_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.dos_calendar_tenants(id) on delete cascade,
  booking_id uuid not null references public.dos_calendar_bookings(id) on delete cascade,
  channel public.dos_calendar_notification_channel not null,
  stage text not null,
  status public.dos_calendar_notification_status not null default 'pending',
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default now()
);

create table public.dos_calendar_availability_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.dos_calendar_tenants(id) on delete cascade,
  booking_type_id text references public.dos_calendar_booking_types(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  timezone text not null default 'Australia/Sydney',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint dos_calendar_availability_time_order check (end_time > start_time)
);

create table public.dos_calendar_audit_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.dos_calendar_tenants(id) on delete cascade,
  booking_id uuid references public.dos_calendar_bookings(id) on delete set null,
  actor text not null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into public.dos_calendar_booking_types (id, label, default_duration_minutes, next_action_label)
values
  ('discovery-call', 'Discovery Call', 30, 'Prepare discovery notes'),
  ('dos-website-demo', 'DOS Website Demo', 45, 'Prepare demo path'),
  ('micah-created-booking', 'Micah-Created Booking', 60, 'Review Micah intake'),
  ('service-booking', 'Service Booking', 60, 'Confirm service details'),
  ('quote-site-visit', 'Quote / Site Visit', 60, 'Prepare quote follow-up'),
  ('follow-up-reminder', 'Follow-Up Reminder', 15, 'Complete follow-up')
on conflict (id) do update
set
  label = excluded.label,
  default_duration_minutes = excluded.default_duration_minutes,
  next_action_label = excluded.next_action_label;

insert into public.dos_calendar_tenants (id, name)
values ('00000000-0000-0000-0000-000000000001', 'DOS Default Tenant')
on conflict (id) do nothing;

create index dos_calendar_contacts_tenant_idx on public.dos_calendar_contacts (tenant_id);
create index dos_calendar_bookings_tenant_start_idx on public.dos_calendar_bookings (tenant_id, start_at);
create index dos_calendar_bookings_contact_idx on public.dos_calendar_bookings (contact_id);
create index dos_calendar_notification_booking_idx on public.dos_calendar_notification_events (booking_id);
create index dos_calendar_notification_due_idx on public.dos_calendar_notification_events (status, scheduled_for);

alter table public.dos_calendar_tenants enable row level security;
alter table public.dos_calendar_tenant_members enable row level security;
alter table public.dos_calendar_booking_types enable row level security;
alter table public.dos_calendar_contacts enable row level security;
alter table public.dos_calendar_bookings enable row level security;
alter table public.dos_calendar_notification_events enable row level security;
alter table public.dos_calendar_availability_rules enable row level security;
alter table public.dos_calendar_audit_events enable row level security;

create policy "Tenant members can read tenants"
on public.dos_calendar_tenants for select
to authenticated
using (
  exists (
    select 1 from public.dos_calendar_tenant_members member
    where member.tenant_id = dos_calendar_tenants.id
      and member.user_id = auth.uid()
  )
);

create policy "Tenant members can read memberships"
on public.dos_calendar_tenant_members for select
to authenticated
using (user_id = auth.uid());

create policy "Authenticated users can read booking types"
on public.dos_calendar_booking_types for select
to authenticated
using (active = true);

create policy "Tenant members can read contacts"
on public.dos_calendar_contacts for select
to authenticated
using (
  exists (
    select 1 from public.dos_calendar_tenant_members member
    where member.tenant_id = dos_calendar_contacts.tenant_id
      and member.user_id = auth.uid()
  )
);

create policy "Tenant members can read bookings"
on public.dos_calendar_bookings for select
to authenticated
using (
  exists (
    select 1 from public.dos_calendar_tenant_members member
    where member.tenant_id = dos_calendar_bookings.tenant_id
      and member.user_id = auth.uid()
  )
);

create policy "Tenant members can read notification events"
on public.dos_calendar_notification_events for select
to authenticated
using (
  exists (
    select 1 from public.dos_calendar_tenant_members member
    where member.tenant_id = dos_calendar_notification_events.tenant_id
      and member.user_id = auth.uid()
  )
);

create policy "Tenant members can read availability"
on public.dos_calendar_availability_rules for select
to authenticated
using (
  exists (
    select 1 from public.dos_calendar_tenant_members member
    where member.tenant_id = dos_calendar_availability_rules.tenant_id
      and member.user_id = auth.uid()
  )
);

create policy "Tenant members can read audit events"
on public.dos_calendar_audit_events for select
to authenticated
using (
  exists (
    select 1 from public.dos_calendar_tenant_members member
    where member.tenant_id = dos_calendar_audit_events.tenant_id
      and member.user_id = auth.uid()
  )
);

grant usage on schema public to authenticated, service_role;
grant select on public.dos_calendar_booking_types to authenticated, service_role;
grant select on public.dos_calendar_tenants to authenticated, service_role;
grant select on public.dos_calendar_tenant_members to authenticated, service_role;
grant select on public.dos_calendar_contacts to authenticated, service_role;
grant select on public.dos_calendar_bookings to authenticated, service_role;
grant select on public.dos_calendar_notification_events to authenticated, service_role;
grant select on public.dos_calendar_availability_rules to authenticated, service_role;
grant select on public.dos_calendar_audit_events to authenticated, service_role;
grant insert, update, delete on
  public.dos_calendar_tenants,
  public.dos_calendar_tenant_members,
  public.dos_calendar_contacts,
  public.dos_calendar_bookings,
  public.dos_calendar_notification_events,
  public.dos_calendar_availability_rules,
  public.dos_calendar_audit_events
to service_role;

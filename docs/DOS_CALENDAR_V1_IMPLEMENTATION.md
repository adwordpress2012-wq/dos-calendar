# DOS Calendar V1 Implementation

DOS Calendar is implemented as operational booking infrastructure for DOS. It is not a Google Calendar, Calendly, Acuity, Outlook, Square, CRM, marketplace, payroll, or rostering replacement.

## V1 Core

- Booking types: Discovery Call, DOS Website Demo, Micah-Created Booking, Service Booking, Quote / Site Visit, Follow-Up Reminder.
- Statuses: Requested, Confirmed, Reschedule Requested, Cancelled, Completed, No Show.
- Source systems: Micah, DOS Website, DOSLead, GuestMate, QuoteOS, AgentMate, Manual.
- Contact records: name, phone, email, organization, source, notes.
- Notifications: confirmation email, internal new booking notification, SMS reminder 24 hours before, SMS reminder 2 hours before.
- Next action: each booking carries the immediate operational next step.

## Implemented Boundaries

- Shared V1 contract lives in `src/lib/dosCalendarCore.ts`.
- Server persistence adapter lives in `src/lib/dosCalendarRepository.ts`.
- Booking API lives at `POST /api/bookings`.
- Micah structured intake lives at `POST /api/micah/booking`.
- Supabase schema lives in `supabase/migrations/202606050001_dos_calendar_v1.sql`.

## Supabase Notes

The migration enables RLS on every public table and includes explicit grants for `authenticated` and `service_role`, matching Supabase's 2026 shift away from automatic Data API exposure for new tables. The application writes through server routes using `SUPABASE_SERVICE_ROLE_KEY`; do not expose this key through `NEXT_PUBLIC_` variables.

Required environment variables for persistence:

```txt
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DOS_CALENDAR_DEFAULT_TENANT_ID=00000000-0000-0000-0000-000000000001
```

If Supabase is not configured, the demo still creates local bookings and reports sync pending.

## Do Not Build In V1

Do not add marketplace, payroll, staff rostering, advanced recurring scheduling, POS, deposits, loyalty, gift certificates, CRM replacement features, meeting polls, round-robin routing, enterprise analytics, multi-location operations, or Google Calendar competitor behavior.

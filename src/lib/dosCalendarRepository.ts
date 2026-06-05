import type { OperationalBooking } from "@/lib/dosCalendarCore";

type SupabaseConfig = {
  url: string;
  serviceKey: string;
};

type PersistResult = {
  persisted: boolean;
  reason?: string;
};

function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceKey,
  };
}

async function supabaseRequest<T>(path: string, init: RequestInit): Promise<T> {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error("Supabase persistence is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  let response: Response;
  try {
    response = await fetch(`${config.url}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: config.serviceKey,
        authorization: `Bearer ${config.serviceKey}`,
        "content-type": "application/json",
        prefer: "return=representation",
        ...(init.headers ?? {}),
      },
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${body}`);
  }

  return (await response.json()) as T;
}

function toContactRow(booking: OperationalBooking) {
  return {
    id: booking.contactId,
    tenant_id: process.env.DOS_CALENDAR_DEFAULT_TENANT_ID ?? "00000000-0000-0000-0000-000000000001",
    name: booking.customerName,
    phone: booking.phone || null,
    email: booking.email || null,
    source_system: booking.source,
    organization: booking.organization || null,
    notes: booking.notes || null,
  };
}

function toBookingRow(booking: OperationalBooking) {
  return {
    id: booking.id,
    tenant_id: process.env.DOS_CALENDAR_DEFAULT_TENANT_ID ?? "00000000-0000-0000-0000-000000000001",
    contact_id: booking.contactId,
    booking_type_id: booking.bookingType,
    source_system: booking.source,
    status: booking.status,
    title: booking.title,
    service_type: booking.serviceType,
    start_at: `${booking.date}T${booking.time}:00`,
    end_at: `${booking.endDate}T${booking.endTime}:00`,
    timezone: booking.timezone,
    notes: booking.notes || null,
    next_action_label: booking.nextAction.label,
    next_action_due_at: booking.nextAction.dueAt,
    metadata: booking.metadata,
  };
}

function toNotificationRows(booking: OperationalBooking) {
  return booking.notificationEvents.map((event) => ({
    id: event.id,
    tenant_id: process.env.DOS_CALENDAR_DEFAULT_TENANT_ID ?? "00000000-0000-0000-0000-000000000001",
    booking_id: booking.id,
    channel: event.channel,
    stage: event.stage,
    status: event.status,
    scheduled_for: event.scheduledFor,
    failure_reason: event.failureReason ?? null,
  }));
}

export async function persistOperationalBooking(booking: OperationalBooking): Promise<PersistResult> {
  if (!getSupabaseConfig()) {
    return {
      persisted: false,
      reason: "Supabase env vars are not configured; booking returned without database write.",
    };
  }

  await supabaseRequest("dos_calendar_contacts", {
    method: "POST",
    body: JSON.stringify(toContactRow(booking)),
    headers: {
      prefer: "resolution=merge-duplicates,return=representation",
    },
  });

  await supabaseRequest("dos_calendar_bookings", {
    method: "POST",
    body: JSON.stringify(toBookingRow(booking)),
  });

  await supabaseRequest("dos_calendar_notification_events", {
    method: "POST",
    body: JSON.stringify(toNotificationRows(booking)),
  });

  return { persisted: true };
}

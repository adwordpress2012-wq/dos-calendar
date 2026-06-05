import type { CalendarEvent, DemoState, DemoTheme, Reminder } from "@/components/calendarTypes";
import { STORAGE_KEY, THEME_STORAGE_KEY } from "@/components/calendarTypes";
import {
  buildNextAction,
  buildNotificationEvents,
  inferBookingType,
  type BookingStatus,
  type OperationalBooking,
  type SourceSystem,
} from "@/lib/dosCalendarCore";

function normalizeSource(source: unknown): SourceSystem {
  if (source === "micah-scw") {
    return "micah";
  }
  if (
    source === "micah" ||
    source === "dos-website" ||
    source === "doslead" ||
    source === "guestmate" ||
    source === "quoteos" ||
    source === "agentmate" ||
    source === "manual"
  ) {
    return source;
  }
  return "manual";
}

function normalizeStatus(status: unknown): BookingStatus {
  if (status === "pending") {
    return "requested";
  }
  if (
    status === "requested" ||
    status === "confirmed" ||
    status === "reschedule-requested" ||
    status === "cancelled" ||
    status === "completed" ||
    status === "no-show"
  ) {
    return status;
  }
  return "confirmed";
}

function normalizeEvent(event: CalendarEvent): CalendarEvent {
  const source = normalizeSource(event.source);
  const status = normalizeStatus(event.status);
  const bookingType = event.bookingType ?? inferBookingType({ source, serviceType: event.serviceType });
  const contactId = event.contactId ?? crypto.randomUUID();
  const date = event.date;
  const time = event.time;

  return {
    ...event,
    email: event.email ?? "",
    organization: event.organization ?? "",
    endTime: event.endTime || "15:00",
    source,
    bookingType,
    contactId,
    timezone: event.timezone ?? "Australia/Sydney",
    status,
    nextAction: event.nextAction ?? buildNextAction(bookingType, date, time, source),
    notificationEvents:
      event.notificationEvents ??
      buildNotificationEvents(event.id, date, time, Boolean(event.email), Boolean(event.phone)),
    metadata: event.metadata ?? {},
    createdAt: event.createdAt ?? new Date().toISOString(),
    updatedAt: event.updatedAt ?? new Date().toISOString(),
  };
}

export function toCalendarEvent(booking: OperationalBooking, category: CalendarEvent["category"] = "cyan"): CalendarEvent {
  return {
    id: booking.id,
    title: booking.title,
    customerName: booking.customerName,
    phone: booking.phone,
    email: booking.email,
    organization: booking.organization,
    serviceType: booking.serviceType,
    date: booking.date,
    time: booking.time,
    endTime: booking.endTime,
    notes: booking.notes,
    category,
    source: booking.source,
    status: booking.status,
    bookingType: booking.bookingType,
    contactId: booking.contactId,
    timezone: booking.timezone,
    nextAction: booking.nextAction,
    notificationEvents: booking.notificationEvents,
    metadata: booking.metadata,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

function normalizeReminder(reminder: Reminder): Reminder {
  return {
    ...reminder,
    completed: reminder.completed ?? false,
  };
}

export function loadDemoState(fallbackEvents: CalendarEvent[], fallbackReminders: Reminder[]): DemoState {
  if (typeof window === "undefined") {
    return {
      businessName: "",
      events: fallbackEvents,
      reminders: fallbackReminders,
      theme: "day",
    };
  }

  const theme = (window.localStorage.getItem(THEME_STORAGE_KEY) as DemoTheme | null) ?? "day";
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return {
      businessName: "",
      events: fallbackEvents,
      reminders: fallbackReminders,
      theme,
    };
  }

  try {
    const parsed = JSON.parse(stored) as Partial<DemoState>;
    return {
      businessName: typeof parsed.businessName === "string" ? parsed.businessName : "",
      events: parsed.events?.length ? parsed.events.map(normalizeEvent) : fallbackEvents,
      reminders: parsed.reminders?.length ? parsed.reminders.map(normalizeReminder) : fallbackReminders,
      theme,
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return {
      businessName: "",
      events: fallbackEvents,
      reminders: fallbackReminders,
      theme,
    };
  }
}

export function saveDemoState(state: Pick<DemoState, "businessName" | "events" | "reminders">) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function saveTheme(theme: DemoTheme) {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

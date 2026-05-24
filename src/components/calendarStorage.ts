import type { CalendarEvent, DemoState, DemoTheme, Reminder } from "@/components/calendarTypes";
import { STORAGE_KEY, THEME_STORAGE_KEY } from "@/components/calendarTypes";

function normalizeEvent(event: CalendarEvent): CalendarEvent {
  return {
    ...event,
    endTime: event.endTime || "15:00",
    source: event.source ?? "manual",
    status: event.status ?? "confirmed",
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

import type {
  BookingStatus,
  BookingTypeId,
  NextAction,
  NotificationEvent,
  SourceSystem,
} from "@/lib/dosCalendarCore";
import {
  bookingTypeDefinitions,
  sourceLabels as operationalSourceLabels,
  statusLabels,
} from "@/lib/dosCalendarCore";

export type CalendarView = "day" | "week" | "month";

export type CategoryColor = "blue" | "cyan" | "purple" | "green" | "orange" | "red" | "grey";

export type EventSource = SourceSystem;

export type EventStatus = BookingStatus;

export type CalendarEvent = {
  id: string;
  title: string;
  customerName: string;
  phone: string;
  email: string;
  organization: string;
  serviceType: string;
  date: string;
  time: string;
  endDate: string;
  endTime: string;
  notes: string;
  category: CategoryColor;
  source: EventSource;
  status: EventStatus;
  bookingType: BookingTypeId;
  contactId: string;
  timezone: string;
  nextAction: NextAction;
  notificationEvents: NotificationEvent[];
  metadata: Record<string, string | number | boolean | null>;
  createdAt: string;
  updatedAt: string;
};

export type Reminder = {
  id: string;
  title: string;
  contact: string;
  dueDate: string;
  dueTime: string;
  notes: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
};

export type DemoTheme = "day" | "night";

export type DemoState = {
  businessName: string;
  events: CalendarEvent[];
  reminders: Reminder[];
  theme: DemoTheme;
};

export const DEFAULT_BUSINESS_NAME = "Your Business";

export const STORAGE_KEY = "dos-calendar-demo-state";
export const THEME_STORAGE_KEY = "dos-calendar-demo-theme";

export const categoryStyles: Record<CategoryColor, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/40 dark:bg-blue-500/15 dark:text-blue-100",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-400/40 dark:bg-cyan-400/15 dark:text-cyan-100",
  purple: "border-purple-200 bg-purple-50 text-purple-900 dark:border-purple-400/40 dark:bg-purple-400/15 dark:text-purple-100",
  green: "border-green-200 bg-green-50 text-green-900 dark:border-green-400/40 dark:bg-green-400/15 dark:text-green-100",
  orange: "border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-400/40 dark:bg-orange-400/15 dark:text-orange-100",
  red: "border-red-200 bg-red-50 text-red-900 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-100",
  grey: "border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-500/40 dark:bg-slate-500/15 dark:text-slate-100",
};

export const categoryDots: Record<CategoryColor, string> = {
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  purple: "bg-purple-500",
  green: "bg-green-500",
  orange: "bg-orange-400",
  red: "bg-red-500",
  grey: "bg-slate-500",
};

export const bookingTypeLabels = Object.fromEntries(
  Object.entries(bookingTypeDefinitions).map(([id, definition]) => [id, definition.label]),
) as Record<BookingTypeId, string>;

export const sourceLabels: Record<EventSource, string> = operationalSourceLabels;

export const eventStatusLabels: Record<EventStatus, string> = statusLabels;

export const statusCategoryColors: Record<EventStatus, CategoryColor> = {
  confirmed: "green",
  requested: "orange",
  "reschedule-requested": "purple",
  cancelled: "red",
  "no-show": "grey",
  completed: "blue",
};

export const statusCardStyles: Record<EventStatus, string> = {
  confirmed: categoryStyles.green,
  requested: categoryStyles.orange,
  "reschedule-requested": categoryStyles.purple,
  cancelled: categoryStyles.red,
  "no-show": categoryStyles.grey,
  completed: categoryStyles.blue,
};

export const statusDotStyles: Record<EventStatus, string> = {
  confirmed: categoryDots.green,
  requested: categoryDots.orange,
  "reschedule-requested": categoryDots.purple,
  cancelled: categoryDots.red,
  "no-show": categoryDots.grey,
  completed: categoryDots.blue,
};

export const statusBarStyles: Record<EventStatus, string> = {
  confirmed: "bg-green-600 text-white shadow-green-950/20 hover:bg-green-700",
  requested: "bg-orange-500 text-orange-950 shadow-orange-950/10 hover:bg-orange-400",
  "reschedule-requested": "bg-purple-600 text-white shadow-purple-950/20 hover:bg-purple-700",
  cancelled: "bg-red-600 text-white shadow-red-950/20 hover:bg-red-700",
  "no-show": "bg-slate-500 text-white shadow-slate-950/10 hover:bg-slate-600",
  completed: "bg-blue-600 text-white shadow-blue-950/20 hover:bg-blue-700",
};

export const statusBadgeStyles: Record<EventStatus, string> = {
  confirmed: "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200",
  requested: "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200",
  "reschedule-requested": "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200",
  "no-show": "bg-slate-200 text-slate-800 dark:bg-slate-500/20 dark:text-slate-200",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
};

export const leadSourceOptions = [
  { label: "Website", source: "dos-website" },
  { label: "Micah", source: "micah" },
  { label: "Google", source: "manual" },
  { label: "Facebook", source: "manual" },
  { label: "Instagram", source: "manual" },
  { label: "Referral", source: "manual" },
  { label: "Hipcamp", source: "manual" },
  { label: "Phone Call", source: "manual" },
  { label: "Email", source: "manual" },
  { label: "Walk In", source: "manual" },
  { label: "Manual", source: "manual" },
  { label: "Other", source: "manual" },
] as const satisfies ReadonlyArray<{ label: string; source: EventSource }>;

export type LeadSourceLabel = (typeof leadSourceOptions)[number]["label"];

export function categoryForStatus(status: EventStatus): CategoryColor {
  return statusCategoryColors[status];
}

export function sourceForLeadSource(label: string): EventSource {
  return leadSourceOptions.find((option) => option.label === label)?.source ?? "manual";
}

export function getLeadSourceLabel(event: Pick<CalendarEvent, "source" | "metadata">): string {
  const leadSource = event.metadata?.leadSource;
  if (typeof leadSource === "string" && leadSource.trim()) {
    return leadSource;
  }
  if (event.source === "micah") {
    return "Micah";
  }
  if (event.source === "dos-website") {
    return "Website";
  }
  if (event.source === "manual") {
    return "Manual";
  }
  return "Other";
}

export function getBookingDisplayName(event: Pick<CalendarEvent, "customerName" | "organization">): string {
  return event.organization?.trim() || event.customerName?.trim() || "Guest";
}

export function getEventIcon(event: Pick<CalendarEvent, "title" | "serviceType" | "bookingType" | "metadata">): string {
  const customIcon = event.metadata?.eventIcon;
  if (typeof customIcon === "string" && customIcon.trim()) {
    return customIcon.trim();
  }

  const text = `${event.title} ${event.serviceType} ${bookingTypeLabels[event.bookingType]}`.toLowerCase();
  const iconRules = [
    { icon: "🌸", terms: ["mother"] },
    { icon: "❤️", terms: ["valentine"] },
    { icon: "🎅", terms: ["christmas", "xmas"] },
    { icon: "🎃", terms: ["halloween"] },
    { icon: "🎂", terms: ["birthday"] },
    { icon: "🏕️", terms: ["camp", "camping", "hipcamp"] },
    { icon: "🛏️", terms: ["guest", "stay", "accommodation"] },
    { icon: "📞", terms: ["phone", "call"] },
    { icon: "🧾", terms: ["quote"] },
    { icon: "💬", terms: ["discovery"] },
    { icon: "🔔", terms: ["reminder", "follow-up"] },
  ];

  return iconRules.find((rule) => rule.terms.some((term) => text.includes(term)))?.icon ?? "";
}

export function getEventLabel(event: Pick<CalendarEvent, "title" | "serviceType" | "bookingType" | "metadata">): string {
  const label = event.title?.trim() || event.serviceType?.trim() || bookingTypeLabels[event.bookingType];
  const icon = getEventIcon(event);
  return icon ? `${icon} ${label}` : label;
}

export function formatDateAU(date: string): string {
  if (!date) {
    return "";
  }
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTimeAU(time: string): string {
  if (!time) {
    return "";
  }
  const [hour = "0", minute = "0"] = time.split(":");
  const date = new Date();
  date.setHours(Number(hour), Number(minute), 0, 0);
  return date
    .toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true })
    .replace(/\s?(am|pm)$/i, (_, period: string) => ` ${period.toUpperCase()}`);
}

export function formatBookingRangeAU(
  date: string,
  time: string,
  endDate?: string,
  endTime?: string,
): string {
  const start = `${formatDateAU(date)} at ${formatTimeAU(time)}`;
  if (!endTime) {
    return start;
  }
  const finalEndDate = endDate || date;
  if (finalEndDate !== date) {
    return `${start} to ${formatDateAU(finalEndDate)} at ${formatTimeAU(endTime)}`;
  }
  return `${start} - ${formatTimeAU(endTime)}`;
}

export function formatIsoDateTimeAU(value: string): string {
  if (!value) {
    return "";
  }
  const [date = "", time = ""] = value.split("T");
  return `${formatDateAU(date)} at ${formatTimeAU(time.slice(0, 5))}`;
}

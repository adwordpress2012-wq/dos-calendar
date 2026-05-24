export type CalendarView = "day" | "week" | "month";

export type CategoryColor = "blue" | "cyan" | "purple" | "green" | "orange";

export type EventSource = "manual" | "micah-scw" | "reminder";

export type EventStatus = "confirmed" | "pending" | "completed";

export type CalendarEvent = {
  id: string;
  title: string;
  customerName: string;
  phone: string;
  serviceType: string;
  date: string;
  time: string;
  endTime: string;
  notes: string;
  category: CategoryColor;
  source: EventSource;
  status: EventStatus;
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

export const DEFAULT_BUSINESS_NAME = "Micah your Booking Assistant";

export const STORAGE_KEY = "dos-calendar-demo-state";
export const THEME_STORAGE_KEY = "dos-calendar-demo-theme";

export const categoryStyles: Record<CategoryColor, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/40 dark:bg-blue-500/15 dark:text-blue-100",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-400/40 dark:bg-cyan-400/15 dark:text-cyan-100",
  purple: "border-purple-200 bg-purple-50 text-purple-900 dark:border-purple-400/40 dark:bg-purple-400/15 dark:text-purple-100",
  green: "border-green-200 bg-green-50 text-green-900 dark:border-green-400/40 dark:bg-green-400/15 dark:text-green-100",
  orange: "border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-400/40 dark:bg-orange-400/15 dark:text-orange-100",
};

export const categoryDots: Record<CategoryColor, string> = {
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  purple: "bg-purple-500",
  green: "bg-green-500",
  orange: "bg-orange-400",
};

export const sourceLabels: Record<EventSource, string> = {
  manual: "Manual",
  "micah-scw": "Micah SCW",
  reminder: "Reminder",
};

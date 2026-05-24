export type CalendarView = "day" | "week" | "month";

export type CategoryColor = "blue" | "cyan" | "purple" | "green" | "orange";

export type CalendarEvent = {
  id: string;
  title: string;
  customerName: string;
  phone: string;
  serviceType: string;
  date: string;
  time: string;
  notes: string;
  category: CategoryColor;
};

export type Reminder = {
  id: string;
  title: string;
  contact: string;
  dueDate: string;
  dueTime: string;
  notes: string;
  priority: "Low" | "Medium" | "High";
};

export const categoryStyles: Record<CategoryColor, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-900",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-900",
  purple: "border-purple-200 bg-purple-50 text-purple-900",
  green: "border-green-200 bg-green-50 text-green-900",
  orange: "border-orange-200 bg-orange-50 text-orange-900",
};

export const categoryDots: Record<CategoryColor, string> = {
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  purple: "bg-purple-500",
  green: "bg-green-500",
  orange: "bg-orange-400",
};

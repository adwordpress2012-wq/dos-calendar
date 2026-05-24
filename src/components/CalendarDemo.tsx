"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BellPlus,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  LayoutGrid,
  ListChecks,
  Phone,
  Plus,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import { EventDetailsPanel } from "@/components/EventDetailsPanel";
import { EventModal } from "@/components/EventModal";
import { MicahBookingSimulation } from "@/components/MicahBookingSimulation";
import { MicahChatWidget, type MicahBookingDraft } from "@/components/MicahChatWidget";
import { ReminderModal } from "@/components/ReminderModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDemoStore } from "@/components/useDemoStore";
import type { CalendarEvent, CalendarView, Reminder } from "@/components/calendarTypes";
import { categoryDots, categoryStyles, DEFAULT_BUSINESS_NAME } from "@/components/calendarTypes";

function toDateInput(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function formatDayLabel(dateStr: string) {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("en-AU", { weekday: "short", day: "numeric" });
}

function nextAfternoonSlot() {
  for (let offset = 0; offset <= 7; offset += 1) {
    const date = toDateInput(offset);
    const day = new Date(`${date}T12:00:00`).getDay();
    if (day !== 0 && day !== 6) {
      return { date, time: "14:30", endTime: "15:30" };
    }
  }
  return { date: toDateInput(1), time: "14:30", endTime: "15:30" };
}

function addMinutesToTime(time: string, minutesToAdd: number) {
  const [hours = "0", minutes = "0"] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  date.setMinutes(date.getMinutes() + minutesToAdd);
  return date.toTimeString().slice(0, 5);
}

function micahEventTitle(service: string) {
  const cleaned = service.trim();
  const guestMatch = cleaned.match(/(\d+)\s+guests?/i);
  if (/table/i.test(cleaned) && guestMatch) {
    return `Table booking — ${guestMatch[1]} guests`;
  }
  return cleaned || "Micah SCW booking";
}

const sampleEvents: CalendarEvent[] = [
  {
    id: "plumbing-quote",
    title: "Plumbing quote inspection",
    customerName: "Ava Bennett",
    phone: "0400 111 222",
    serviceType: "Plumbing quote",
    date: toDateInput(1),
    time: "14:30",
    endTime: "15:30",
    notes: "Leaking outdoor tap and bathroom pressure check.",
    category: "blue",
    source: "manual",
    status: "confirmed",
  },
  {
    id: "restaurant-booking",
    title: "Restaurant booking for 4",
    customerName: "Noah Clarke",
    phone: "0400 222 333",
    serviceType: "Dinner booking",
    date: toDateInput(0),
    time: "18:30",
    endTime: "20:00",
    notes: "Window table if available.",
    category: "orange",
    source: "manual",
    status: "confirmed",
  },
  {
    id: "buyer-inspection",
    title: "Real estate buyer inspection",
    customerName: "Mia Tran",
    phone: "0400 333 444",
    serviceType: "Property inspection",
    date: toDateInput(2),
    time: "11:00",
    endTime: "12:00",
    notes: "Buyer wants school catchment details.",
    category: "green",
    source: "micah-scw",
    status: "confirmed",
  },
  {
    id: "salon-appointment",
    title: "Salon appointment",
    customerName: "Sophie Martin",
    phone: "0400 444 555",
    serviceType: "Cut and colour",
    date: toDateInput(3),
    time: "10:15",
    endTime: "11:45",
    notes: "Prefers senior stylist.",
    category: "purple",
    source: "manual",
    status: "pending",
  },
];

const sampleReminders: Reminder[] = [
  {
    id: "follow-up-reminder",
    title: "Follow-up reminder",
    contact: "Liam Roberts",
    dueDate: toDateInput(1),
    dueTime: "09:00",
    notes: "Confirm quote approval and next available job slot.",
    priority: "High",
    completed: false,
  },
];

const viewLabels: CalendarView[] = ["day", "week", "month"];

export function CalendarDemo() {
  const { businessName, events, reminders, theme, setBusinessName, setEvents, setReminders, setTheme } =
    useDemoStore(sampleEvents, sampleReminders);
  const [view, setView] = useState<CalendarView>("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [toast, setToast] = useState("");
  const [simulating, setSimulating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const displayBusinessName = businessName.trim() || DEFAULT_BUSINESS_NAME;

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const today = toDateInput(0);

  const weekDates = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() + weekOffset * 7);
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + mondayOffset);
    return Array.from({ length: 7 }, (_, index) => {
      const d = new Date(start);
      d.setDate(start.getDate() + index);
      return d.toISOString().slice(0, 10);
    });
  }, [weekOffset]);

  const monthDates = useMemo(() => {
    const now = new Date();
    now.setMonth(now.getMonth() + weekOffset);
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const dates: string[] = [];
    for (let i = startPad; i > 0; i -= 1) {
      const d = new Date(year, month, 1 - i);
      dates.push(d.toISOString().slice(0, 10));
    }
    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      dates.push(new Date(year, month, day).toISOString().slice(0, 10));
    }
    while (dates.length % 7 !== 0) {
      const d = new Date(year, month + 1, dates.length - lastDay.getDate() - startPad + 1);
      dates.push(d.toISOString().slice(0, 10));
    }
    return dates;
  }, [weekOffset]);

  const visibleEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    if (view === "day") {
      return sorted.filter((event) => event.date === today);
    }
    if (view === "week") {
      const weekSet = new Set(weekDates);
      return sorted.filter((event) => weekSet.has(event.date));
    }
    const monthSet = new Set(monthDates.filter((d) => d.slice(0, 7) === monthDates[15]?.slice(0, 7)));
    return sorted.filter((event) => monthSet.has(event.date));
  }, [events, view, today, weekDates, monthDates]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of visibleEvents) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    return map;
  }, [visibleEvents]);

  const stats = useMemo(
    () => ({
      totalBookings: events.length,
      todayBookings: events.filter((e) => e.date === today).length,
      micahBookings: events.filter((e) => e.source === "micah-scw").length,
      pendingReminders: reminders.filter((r) => !r.completed).length,
    }),
    [events, reminders, today],
  );

  function handleAddEvent(event: CalendarEvent) {
    setEvents((current) => {
      const exists = current.some((e) => e.id === event.id);
      if (exists) {
        return current.map((e) => (e.id === event.id ? event : e));
      }
      return [event, ...current];
    });
    if (!editingEvent) {
      setToast("Booking added — business notified");
    } else {
      setToast("Booking updated");
      setSelectedEvent(event);
    }
    setEditingEvent(null);
  }

  function handleAddReminder(reminder: Reminder) {
    setReminders((current) => [reminder, ...current]);
    setToast("Reminder created");
  }

  function handleMicahBooking(draft: MicahBookingDraft, toastMessage = "Micah booked it — added to DOS Calendar") {
    const service = draft.service.trim() || "Table for 5 guests";
    const noteLines = ["Captured through Micah SCW demo."];
    if (draft.notes.trim()) {
      noteLines.push(draft.notes.trim());
    }
    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      title: micahEventTitle(service),
      customerName: draft.name.trim() || "Demo Customer",
      phone: draft.phone.trim(),
      serviceType: service,
      date: draft.date || today,
      time: draft.time || "19:00",
      endTime: addMinutesToTime(draft.time || "19:00", 90),
      notes: noteLines.join(" "),
      category: "cyan",
      source: "micah-scw",
      status: "confirmed",
    };
    setEvents((current) => [event, ...current]);
    setToast(toastMessage);
  }

  function toggleReminder(id: string) {
    setReminders((current) =>
      current.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
    );
  }

  function handleSimulateBooking() {
    if (simulating) {
      return;
    }
    setSimulating(true);
    setAnimationStep(0);

    const steps = [1, 2, 3, 4];
    steps.forEach((step, index) => {
      window.setTimeout(() => setAnimationStep(step), (index + 1) * 600);
    });

    window.setTimeout(() => {
      const slot = nextAfternoonSlot();
      handleMicahBooking(
        {
          name: "Sarah Johnson",
          phone: "0412 345 678",
          service: "Quote request / Booking enquiry",
          date: slot.date,
          time: slot.time,
          notes: `Preferred finish time ${slot.endTime}.`,
        },
        "Micah SCW booking added to calendar",
      );
      setSimulating(false);
      setAnimationStep(0);
    }, 2800);
  }

  function openNewEvent() {
    setEditingEvent(null);
    setEventModalOpen(true);
  }

  function openEditEvent(event: CalendarEvent) {
    setEditingEvent(event);
    setSelectedEvent(null);
    setEventModalOpen(true);
  }

  function renderEventCard(event: CalendarEvent, compact = false) {
    return (
      <button
        key={event.id}
        type="button"
        onClick={() => setSelectedEvent(event)}
        className={`w-full rounded-xl border p-3 text-left transition hover:scale-[1.01] hover:shadow-md ${categoryStyles[event.category]} ${compact ? "text-xs" : ""}`}
      >
        <div className="flex items-start gap-2">
          <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${categoryDots[event.category]}`} />
          <div className="min-w-0 flex-1">
            <p className={`font-black leading-snug ${compact ? "text-xs" : "text-sm"}`}>{event.title}</p>
            <p className="mt-0.5 truncate font-bold opacity-80">{event.time}{event.endTime ? ` – ${event.endTime}` : ""}</p>
            {!compact ? (
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold opacity-75">
                <UserRound size={12} aria-hidden="true" />
                {event.customerName}
              </p>
            ) : null}
          </div>
        </div>
      </button>
    );
  }

  const calendarTitle =
    view === "month"
      ? new Date(`${monthDates[15] ?? today}T12:00:00`).toLocaleDateString("en-AU", { month: "long", year: "numeric" })
      : view === "week"
        ? `Week of ${formatDayLabel(weekDates[0])}`
        : "Today";

  return (
    <div className="theme-transition flex min-h-[calc(100svh-76px)] flex-col bg-slate-50 dark:bg-slate-950 lg:flex-row">
      {/* Mobile sidebar overlay */}
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      ) : null}

      {/* Left sidebar */}
      <aside
        className={`theme-transition fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 text-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg">
              <CalendarDays size={24} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-black leading-tight">{displayBusinessName}</p>
              <p className="text-xs font-semibold text-cyan-200">DOS Calendar demo</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {[
            { label: "Calendar", icon: LayoutGrid, active: true },
            { label: "Bookings", icon: CalendarPlus, active: false },
            { label: "Reminders", icon: ListChecks, active: false },
            { label: "Customers", icon: Users, active: false },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className={`touch-target flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-black ${
                item.active ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/8"
              }`}
            >
              <item.icon size={20} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="space-y-3 border-t border-white/10 p-4">
          <MicahChatWidget onBook={handleMicahBooking} />
          <div className="rounded-xl bg-gradient-to-br from-blue-600/40 to-purple-600/40 p-4 ring-1 ring-white/10">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-200">This week</p>
            <p className="mt-1 text-2xl font-black">{stats.totalBookings} bookings</p>
            <p className="text-sm font-semibold text-blue-100">{stats.micahBookings} from Micah SCW</p>
          </div>
          <div className="rounded-xl bg-white/8 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Powered by</p>
            <p className="mt-1 font-black text-white">Directive OS · Micah SCW</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Sales pitch banner */}
        <div className="border-b border-cyan-200 bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 px-4 py-3 dark:border-cyan-500/20 dark:from-cyan-950/50 dark:via-blue-950/50 dark:to-purple-950/50">
          <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 text-center text-sm font-bold text-slate-800 dark:text-cyan-100 sm:text-base">
            <Sparkles size={18} className="shrink-0 text-purple-600 dark:text-purple-300" aria-hidden="true" />
            Customer chats or calls → Micah captures details → DOS Calendar books it → business gets notified.
          </p>
        </div>

        {/* Top toolbar */}
        <header className="theme-transition sticky top-[76px] z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="touch-target grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-700 lg:hidden dark:bg-slate-800 dark:text-slate-200"
                aria-label="Open sidebar"
              >
                <LayoutGrid size={22} aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-black text-slate-950 dark:text-white sm:text-2xl">{displayBusinessName}</h1>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{calendarTitle} · {visibleEvents.length} bookings</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <label className="flex min-w-[180px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 sm:min-w-[220px] sm:flex-none">
                <span className="shrink-0 text-xs font-black uppercase text-slate-500 dark:text-slate-400">Business</span>
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-900 outline-none dark:text-white"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter business name"
                  aria-label="Business name"
                />
              </label>
              <ThemeToggle theme={theme} onChange={setTheme} />
              <button
                type="button"
                onClick={openNewEvent}
                className="touch-target inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-md hover:bg-blue-700"
              >
                <CalendarPlus size={18} aria-hidden="true" />
                <span className="hidden sm:inline">New Booking</span>
                <span className="sm:hidden">Add</span>
              </button>
              <button
                type="button"
                onClick={() => setReminderModalOpen(true)}
                className="touch-target inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-black text-white shadow-md hover:bg-green-600"
              >
                <BellPlus size={18} aria-hidden="true" />
                <span className="hidden sm:inline">Add Reminder</span>
              </button>
            </div>
          </div>

          {/* View switcher + navigation */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="grid grid-cols-3 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              {viewLabels.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setView(label)}
                  className={`touch-target rounded-lg px-4 py-2.5 text-sm font-black capitalize ${
                    view === label
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {view !== "day" ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWeekOffset((o) => o - 1)}
                  className="touch-target grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setWeekOffset(0)}
                  className="touch-target rounded-xl px-4 py-2.5 text-sm font-black text-blue-600 dark:text-cyan-400"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setWeekOffset((o) => o + 1)}
                  className="touch-target grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                  aria-label="Next"
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-5 p-4 sm:p-6 xl:flex-row">
          {/* Calendar grid area */}
          <section className="theme-transition min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {view === "week" ? (
              <div className="overflow-x-auto">
                <div className="grid min-w-[720px] grid-cols-7 gap-2">
                  {weekDates.map((date) => (
                    <div key={date} className="min-h-[280px]">
                      <div
                        className={`mb-2 rounded-xl px-2 py-2 text-center ${
                          date === today
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <p className="text-xs font-black uppercase">{formatDayLabel(date)}</p>
                      </div>
                      <div className="space-y-2">
                        {(eventsByDate.get(date) ?? []).map((event) => renderEventCard(event, true))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {view === "day" ? (
              <div className="space-y-3">
                <div className="rounded-xl bg-blue-600 px-4 py-3 text-white">
                  <p className="text-sm font-black uppercase">Today</p>
                  <p className="text-xl font-black">{new Date(`${today}T12:00:00`).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}</p>
                </div>
                {(eventsByDate.get(today) ?? []).length > 0 ? (
                  (eventsByDate.get(today) ?? []).map((event) => renderEventCard(event))
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-600">
                    <Clock className="mx-auto text-slate-400" size={36} aria-hidden="true" />
                    <p className="mt-3 text-lg font-black text-slate-700 dark:text-slate-300">No bookings today</p>
                    <button type="button" onClick={openNewEvent} className="touch-target mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-black text-white">
                      <Plus size={18} aria-hidden="true" />
                      Add booking
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {view === "month" ? (
              <div>
                <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <div key={d} className="py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {monthDates.map((date) => {
                    const dayEvents = eventsByDate.get(date) ?? [];
                    const inMonth = date.slice(0, 7) === (monthDates[15] ?? today).slice(0, 7);
                    return (
                      <div
                        key={date}
                        className={`min-h-[90px] rounded-xl border p-1.5 sm:min-h-[110px] ${
                          date === today
                            ? "border-blue-400 bg-blue-50 dark:border-cyan-500/50 dark:bg-cyan-950/30"
                            : inMonth
                              ? "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50"
                              : "border-transparent bg-slate-50 opacity-50 dark:bg-slate-900/30"
                        }`}
                      >
                        <p className="text-xs font-black text-slate-600 dark:text-slate-400">{parseInt(date.slice(8), 10)}</p>
                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <button
                              key={event.id}
                              type="button"
                              onClick={() => setSelectedEvent(event)}
                              className={`block w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-black sm:text-xs ${categoryDots[event.category]} text-white`}
                            >
                              {event.time} {event.title}
                            </button>
                          ))}
                          {dayEvents.length > 2 ? (
                            <p className="text-[10px] font-bold text-slate-500">+{dayEvents.length - 2} more</p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {visibleEvents.length === 0 && view !== "day" ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-600">
                <LayoutGrid className="mx-auto text-slate-400" size={36} aria-hidden="true" />
                <p className="mt-3 text-lg font-black text-slate-800 dark:text-slate-200">No bookings in this view</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">Add a booking or simulate a Micah SCW customer request.</p>
                <button type="button" onClick={openNewEvent} className="touch-target mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-black text-white">
                  <Plus size={18} aria-hidden="true" />
                  New Booking
                </button>
              </div>
            ) : null}
          </section>

          {/* Right panel */}
          <div className="grid w-full shrink-0 content-start gap-5 xl:w-[380px]">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total bookings", value: stats.totalBookings, icon: CalendarDays, color: "from-blue-500 to-cyan-500" },
                { label: "Today", value: stats.todayBookings, icon: Clock, color: "from-green-500 to-emerald-500" },
                { label: "Micah SCW", value: stats.micahBookings, icon: TrendingUp, color: "from-purple-500 to-violet-500" },
                { label: "Reminders", value: stats.pendingReminders, icon: ListChecks, color: "from-orange-500 to-amber-500" },
              ].map((card) => (
                <div
                  key={card.label}
                  className="theme-transition rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className={`mb-2 inline-flex rounded-lg bg-gradient-to-r ${card.color} p-2 text-white`}>
                    <card.icon size={18} aria-hidden="true" />
                  </div>
                  <p className="text-2xl font-black text-slate-950 dark:text-white">{card.value}</p>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{card.label}</p>
                </div>
              ))}
            </div>

            <MicahBookingSimulation
              onSimulate={handleSimulateBooking}
              isAnimating={simulating}
              animationStep={animationStep}
              businessName={displayBusinessName}
            />

            {/* Reminders panel */}
            <aside className="theme-transition rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-950 dark:text-white">Reminders</h2>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Follow-ups for {displayBusinessName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReminderModalOpen(true)}
                  className="touch-target rounded-xl bg-green-100 p-2 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                  aria-label="Add reminder"
                >
                  <Plus size={20} aria-hidden="true" />
                </button>
              </div>
              <div className="grid max-h-[320px] gap-3 overflow-auto">
                {[...reminders]
                  .sort((a, b) => `${a.dueDate} ${a.dueTime}`.localeCompare(`${b.dueDate} ${b.dueTime}`))
                  .map((reminder) => (
                    <article
                      key={reminder.id}
                      className={`rounded-xl border p-4 transition ${
                        reminder.completed
                          ? "border-slate-200 bg-slate-50 opacity-60 dark:border-slate-700 dark:bg-slate-800/40"
                          : "border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleReminder(reminder.id)}
                          className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                            reminder.completed
                              ? "bg-green-500 text-white"
                              : "border-2 border-green-400 bg-white dark:bg-slate-800"
                          }`}
                          aria-label={reminder.completed ? "Mark incomplete" : "Mark complete"}
                        >
                          {reminder.completed ? <CheckCircle2 size={18} aria-hidden="true" /> : null}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className={`font-black text-slate-950 dark:text-white ${reminder.completed ? "line-through" : ""}`}>
                              {reminder.title}
                            </h3>
                            <span className="shrink-0 rounded-lg bg-white px-2 py-0.5 text-xs font-black dark:bg-slate-700 dark:text-slate-200">
                              {reminder.priority}
                            </span>
                          </div>
                          <p className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-600 dark:text-slate-400">
                            <UserRound size={14} aria-hidden="true" />
                            {reminder.contact}
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                            {reminder.dueDate} at {reminder.dueTime}
                          </p>
                          {reminder.notes ? (
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-400">{reminder.notes}</p>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                {reminders.length === 0 ? (
                  <p className="py-6 text-center text-sm font-semibold text-slate-500">No reminders yet.</p>
                ) : null}
              </div>
            </aside>

            {/* Customer summary card */}
            <div className="theme-transition rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-purple-50 p-4 dark:border-slate-800 dark:from-blue-950/40 dark:to-purple-950/40">
              <h3 className="font-black text-slate-950 dark:text-white">{displayBusinessName} at a glance</h3>
              <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-600 dark:text-cyan-400" aria-hidden="true" />
                  Customer calls &amp; chats handled by Micah SCW
                </li>
                <li className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  {stats.totalBookings} bookings on your calendar
                </li>
                <li className="flex items-center gap-2">
                  <BellPlus size={16} className="text-green-600 dark:text-green-400" aria-hidden="true" />
                  {stats.pendingReminders} active reminders
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl bg-slate-950 px-5 py-4 text-center text-base font-black text-white shadow-2xl dark:bg-gradient-to-r dark:from-purple-700 dark:to-blue-700">
          {toast}
        </div>
      ) : null}

      <EventModal
        isOpen={eventModalOpen}
        onClose={() => {
          setEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleAddEvent}
        editingEvent={editingEvent}
      />
      <ReminderModal isOpen={reminderModalOpen} onClose={() => setReminderModalOpen(false)} onSave={handleAddReminder} />
      <EventDetailsPanel
        event={selectedEvent}
        businessName={displayBusinessName}
        onClose={() => setSelectedEvent(null)}
        onEdit={openEditEvent}
      />
    </div>
  );
}

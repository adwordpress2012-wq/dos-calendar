"use client";

import { useEffect, useMemo, useState } from "react";
import { BellPlus, CalendarPlus, Clock, LayoutGrid, ListChecks, Plus, UserRound } from "lucide-react";
import { EventModal } from "@/components/EventModal";
import { MicahBookingSimulation } from "@/components/MicahBookingSimulation";
import { ReminderModal } from "@/components/ReminderModal";
import type { CalendarEvent, CalendarView, Reminder } from "@/components/calendarTypes";
import { categoryDots, categoryStyles } from "@/components/calendarTypes";

const storageKey = "dos-calendar-demo-state";

function toDateInput(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
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
    notes: "Leaking outdoor tap and bathroom pressure check.",
    category: "blue",
  },
  {
    id: "restaurant-booking",
    title: "Restaurant booking for 4",
    customerName: "Noah Clarke",
    phone: "0400 222 333",
    serviceType: "Dinner booking",
    date: toDateInput(0),
    time: "18:30",
    notes: "Window table if available.",
    category: "orange",
  },
  {
    id: "buyer-inspection",
    title: "Real estate buyer inspection",
    customerName: "Mia Tran",
    phone: "0400 333 444",
    serviceType: "Property inspection",
    date: toDateInput(2),
    time: "11:00",
    notes: "Buyer wants school catchment details.",
    category: "green",
  },
  {
    id: "salon-appointment",
    title: "Salon appointment",
    customerName: "Sophie Martin",
    phone: "0400 444 555",
    serviceType: "Cut and colour",
    date: toDateInput(3),
    time: "10:15",
    notes: "Prefers senior stylist.",
    category: "purple",
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
  },
];

const viewLabels: CalendarView[] = ["day", "week", "month"];

export function CalendarDemo() {
  const [view, setView] = useState<CalendarView>("week");
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [reminders, setReminders] = useState<Reminder[]>(sampleReminders);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) {
        return;
      }
      try {
        const parsed = JSON.parse(stored) as { events?: CalendarEvent[]; reminders?: Reminder[] };
        setEvents(parsed.events?.length ? parsed.events : sampleEvents);
        setReminders(parsed.reminders?.length ? parsed.reminders : sampleReminders);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ events, reminders }));
  }, [events, reminders]);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    if (view === "day") {
      return sorted.filter((event) => event.date === toDateInput(0));
    }
    if (view === "week") {
      const weekDates = new Set(Array.from({ length: 7 }, (_, index) => toDateInput(index)));
      return sorted.filter((event) => weekDates.has(event.date));
    }
    return sorted;
  }, [events, view]);

  const visibleReminders = useMemo(() => {
    return [...reminders].sort((a, b) => `${a.dueDate} ${a.dueTime}`.localeCompare(`${b.dueDate} ${b.dueTime}`));
  }, [reminders]);

  function handleAddEvent(event: CalendarEvent) {
    setEvents((current) => [event, ...current]);
    setToast("Booking added — business notified");
  }

  function handleAddReminder(reminder: Reminder) {
    setReminders((current) => [reminder, ...current]);
    setToast("Reminder created");
  }

  function handleSimulateBooking() {
    const simulated: CalendarEvent = {
      id: crypto.randomUUID(),
      title: "Customer quote request",
      customerName: "Micah Demo Lead",
      phone: "0400 987 654",
      serviceType: "Quote request",
      date: toDateInput(1),
      time: "15:00",
      notes: "Captured from customer chat: tomorrow afternoon preferred.",
      category: "cyan",
    };
    setEvents((current) => [simulated, ...current]);
    setSimulating(true);
    setToast("Customer booking added — business notified");
    window.setTimeout(() => setSimulating(false), 1400);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-5 rounded-lg bg-slate-950 p-5 text-white shadow-soft-color sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-normal text-cyan-200">DOS Calendar demo</p>
              <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">Operational calendar for bookings, reminders, and customer intake.</h1>
              <p className="mt-3 text-lg font-medium leading-8 text-blue-50">Use this iPad-friendly demo to show how a customer request becomes a booked job and a business notification.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setEventModalOpen(true)} className="touch-target inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 py-4 text-base font-black text-slate-950 hover:bg-green-300">
                <CalendarPlus size={21} aria-hidden="true" />
                Add event
              </button>
              <button onClick={() => setReminderModalOpen(true)} className="touch-target inline-flex items-center justify-center gap-2 rounded-lg bg-orange-300 px-5 py-4 text-base font-black text-slate-950 hover:bg-orange-200">
                <BellPlus size={21} aria-hidden="true" />
                Add reminder
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Calendar</h2>
                <p className="font-medium text-slate-600">{visibleEvents.length} bookings visible in {view} view</p>
              </div>
              <div className="grid grid-cols-3 rounded-lg bg-slate-100 p-1">
                {viewLabels.map((label) => (
                  <button key={label} onClick={() => setView(label)} className={`touch-target rounded-lg px-4 py-3 text-sm font-black capitalize ${view === label ? "bg-blue-600 text-white shadow" : "text-slate-700 hover:bg-white"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {visibleEvents.map((event) => (
                <article key={event.id} className={`rounded-lg border p-4 ${categoryStyles[event.category]}`}>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span className={`mt-1 h-3 w-3 rounded-lg ${categoryDots[event.category]}`} />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-black leading-6">{event.title}</h3>
                      <p className="mt-1 text-sm font-bold opacity-80">{event.serviceType}</p>
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm font-bold">
                    <p className="flex items-center gap-2">
                      <Clock size={17} aria-hidden="true" />
                      {event.date} at {event.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <UserRound size={17} aria-hidden="true" />
                      {event.customerName}
                    </p>
                    {event.notes ? <p className="rounded-lg bg-white/65 p-3 leading-6">{event.notes}</p> : null}
                  </div>
                </article>
              ))}
              {visibleEvents.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <LayoutGrid className="mx-auto text-slate-400" size={34} aria-hidden="true" />
                  <p className="mt-3 text-lg font-black text-slate-800">No bookings in this view</p>
                  <button onClick={() => setEventModalOpen(true)} className="touch-target mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-black text-white">
                    <Plus size={19} aria-hidden="true" />
                    Add booking
                  </button>
                </div>
              ) : null}
            </div>
          </section>

          <div className="grid content-start gap-5">
            <MicahBookingSimulation onSimulate={handleSimulateBooking} isAnimating={simulating} />
            <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Reminders</h2>
                  <p className="font-medium text-slate-600">Follow-ups and next actions</p>
                </div>
                <ListChecks className="text-green-600" size={28} aria-hidden="true" />
              </div>
              <div className="grid gap-3">
                {visibleReminders.map((reminder) => (
                  <article key={reminder.id} className="rounded-lg border border-green-100 bg-green-50 p-4 text-green-950">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black">{reminder.title}</h3>
                        <p className="mt-1 text-sm font-bold opacity-80">{reminder.contact}</p>
                      </div>
                      <span className="rounded-lg bg-white px-3 py-1 text-xs font-black">{reminder.priority}</span>
                    </div>
                    <p className="mt-3 text-sm font-bold">{reminder.dueDate} at {reminder.dueTime}</p>
                    {reminder.notes ? <p className="mt-2 text-sm font-semibold leading-6">{reminder.notes}</p> : null}
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg bg-slate-950 px-5 py-4 text-center text-base font-black text-white shadow-2xl">
          {toast}
        </div>
      ) : null}
      <EventModal isOpen={eventModalOpen} onClose={() => setEventModalOpen(false)} onSave={handleAddEvent} />
      <ReminderModal isOpen={reminderModalOpen} onClose={() => setReminderModalOpen(false)} onSave={handleAddReminder} />
    </main>
  );
}

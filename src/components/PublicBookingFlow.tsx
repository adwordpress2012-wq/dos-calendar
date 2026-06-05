"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, CalendarCheck, CalendarClock, CheckCircle2, Mail, MessageCircle, XCircle } from "lucide-react";
import { toCalendarEvent } from "@/components/calendarStorage";
import type { CalendarEvent, DemoState } from "@/components/calendarTypes";
import { STORAGE_KEY, eventStatusLabels } from "@/components/calendarTypes";
import {
  buildLifecycleNotificationEvent,
  createOperationalBooking,
  notificationStageLabels,
  type BookingStatus,
} from "@/lib/dosCalendarCore";

type FlowMode = "book" | "confirmation" | "reschedule" | "cancel";

type BookingForm = {
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  notes: string;
};

const initialForm: BookingForm = {
  name: "Sarah Johnson",
  phone: "0412 345 678",
  email: "sarah@example.com",
  service: "Quote request / Booking enquiry",
  date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  time: "14:30",
  notes: "Customer asked Micah for the next clear booking path.",
};

function readDemoState(): Partial<DemoState> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}") as Partial<DemoState>;
  } catch {
    return {};
  }
}

function writeEvents(events: CalendarEvent[]) {
  const current = readDemoState();
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      businessName: current.businessName ?? "",
      reminders: current.reminders ?? [],
      events,
    }),
  );
}

function getBookingFromUrl() {
  if (typeof window === "undefined") {
    return { booking: null, bookingId: "" };
  }

    const id = new URLSearchParams(window.location.search).get("id") || "";
    const state = readDemoState();
  return {
    bookingId: id,
    booking: (state.events ?? []).find((event) => event.id === id) ?? null,
  };
}

function useBookingFromUrl() {
  const [bookingState, setBookingState] = useState(getBookingFromUrl);

  return {
    ...bookingState,
    setBooking: (booking: CalendarEvent) => setBookingState((current) => ({ ...current, booking })),
  };
}

function formatBookingTime(booking: CalendarEvent) {
  return `${booking.date} at ${booking.time}${booking.endTime ? `-${booking.endTime}` : ""}`;
}

function notificationList(booking: CalendarEvent) {
  return booking.notificationEvents.map((event) => ({
    id: event.id,
    label: notificationStageLabels[event.stage],
    status: event.status,
  }));
}

export function PublicBookingFlow({ mode }: { mode: FlowMode }) {
  if (mode === "book") {
    return <MicahBookingPage />;
  }
  if (mode === "reschedule") {
    return <LifecyclePage action="reschedule" />;
  }
  if (mode === "cancel") {
    return <LifecyclePage action="cancel" />;
  }
  return <ConfirmationPage />;
}

function Shell({ children, kicker, title, copy }: { children: React.ReactNode; kicker: string; title: string; copy: string }) {
  return (
    <main className="min-h-[calc(100svh-76px)] bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-2xl dark:bg-slate-900">
          <p className="text-sm font-black uppercase tracking-wide text-cyan-300">{kicker}</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-slate-300">{copy}</p>
          <div className="mt-8 grid gap-3 text-sm font-black">
            {["Micah captures the request", "DOS Calendar creates the booking", "Emails are recorded", "Customer can reschedule or cancel"].map((step) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/8 p-3">
                <CheckCircle2 size={18} className="text-cyan-300" aria-hidden="true" />
                {step}
              </div>
            ))}
          </div>
        </div>
        {children}
      </section>
    </main>
  );
}

function MicahBookingPage() {
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    const booking = createOperationalBooking({
      title: form.service,
      customerName: form.name,
      phone: form.phone,
      email: form.email,
      serviceType: form.service,
      date: form.date,
      time: form.time,
      notes: form.notes,
      source: "micah",
      bookingType: "micah-created-booking",
      status: "confirmed",
      metadata: { sourceProduct: "micah-public-booking" },
    });
    const eventRecord = toCalendarEvent(booking, "cyan");
    const current = readDemoState().events ?? [];
    writeEvents([eventRecord, ...current.filter((item) => item.id !== eventRecord.id)]);

    try {
      await fetch("/api/micah/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer: { name: form.name, phone: form.phone, email: form.email },
          request: { serviceType: form.service, preferredDate: form.date, preferredTime: form.time, notes: form.notes },
          sourceProduct: "micah-public-booking",
        }),
      });
    } catch {
      // Demo mode still succeeds locally when Supabase env vars are not configured.
    }

    window.location.href = `/confirmation?id=${eventRecord.id}`;
  }

  return (
    <Shell kicker="Micah booking" title="Book the next action." copy="A customer asks. Micah captures the minimum details. DOS Calendar confirms the booking.">
      <form onSubmit={submitBooking} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-200">
            <MessageCircle size={24} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Micah intake</h2>
            <p className="text-sm font-semibold text-slate-500">Only the details needed to book.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["name", "Customer name", "text"],
            ["phone", "Phone", "tel"],
            ["email", "Email", "email"],
            ["service", "Service", "text"],
            ["date", "Date", "date"],
            ["time", "Time", "time"],
          ].map(([field, label, type]) => (
            <label key={field} className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              {label}
              <input
                required={field !== "phone"}
                type={type}
                value={form[field as keyof BookingForm]}
                onChange={(e) => setForm((current) => ({ ...current, [field]: e.target.value }))}
                className="touch-target rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
          ))}
          <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 sm:col-span-2">
            Notes
            <textarea
              value={form.notes}
              onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
              className="min-h-24 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>
        <button disabled={isSaving} className="touch-target mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-lg font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-70">
          Confirm booking <ArrowRight size={20} aria-hidden="true" />
        </button>
      </form>
    </Shell>
  );
}

function ConfirmationPage() {
  const { booking } = useBookingFromUrl();

  return (
    <Shell kicker="Confirmation" title="Booked. Notified. Ready." copy="The customer sees the confirmed booking and the next available actions.">
      <BookingSummary booking={booking} />
    </Shell>
  );
}

function LifecyclePage({ action }: { action: "reschedule" | "cancel" }) {
  const { booking, bookingId, setBooking } = useBookingFromUrl();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [done, setDone] = useState(false);

  const title = action === "reschedule" ? "Request a new time." : "Cancel the booking.";
  const copy = action === "reschedule" ? "One clear action: pick a new time and notify the team." : "One clear action: cancel and send the cancellation email.";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!booking) {
      return;
    }

    const status: BookingStatus = action === "reschedule" ? "reschedule-requested" : "cancelled";
    const nextEvent = buildLifecycleNotificationEvent(
      booking.id,
      action === "reschedule" ? "reschedule-email" : "cancellation-email",
      Boolean(booking.email),
    );
    const updated: CalendarEvent = {
      ...booking,
      date: action === "reschedule" ? date || booking.date : booking.date,
      time: action === "reschedule" ? time || booking.time : booking.time,
      status,
      updatedAt: new Date().toISOString(),
      notificationEvents: [nextEvent, ...booking.notificationEvents],
    };

    const current = readDemoState().events ?? [];
    writeEvents(current.map((item) => (item.id === booking.id ? updated : item)));
    setBooking(updated);
    setDone(true);
  }

  return (
    <Shell kicker={action === "reschedule" ? "Reschedule" : "Cancel"} title={title} copy={copy}>
      <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <BookingMini booking={booking} />
        {action === "reschedule" ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              New date
              <input type="date" required value={date || booking?.date || ""} onChange={(event) => setDate(event.target.value)} className="touch-target rounded-2xl border border-slate-300 bg-white px-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              New time
              <input type="time" required value={time || booking?.time || ""} onChange={(event) => setTime(event.target.value)} className="touch-target rounded-2xl border border-slate-300 bg-white px-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            </label>
          </div>
        ) : null}
        <button className={`touch-target mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-lg font-black text-white shadow-lg ${action === "cancel" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}>
          {action === "cancel" ? <XCircle size={20} aria-hidden="true" /> : <CalendarClock size={20} aria-hidden="true" />}
          {action === "cancel" ? "Cancel booking" : "Request reschedule"}
        </button>
        {done ? (
          <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-black text-green-800 dark:bg-green-500/15 dark:text-green-200">
            {action === "cancel" ? "Cancellation email recorded." : "Reschedule email recorded."}{" "}
            <Link className="underline" href={`/confirmation?id=${bookingId}`}>
              View confirmation
            </Link>
          </div>
        ) : null}
      </form>
    </Shell>
  );
}

function BookingSummary({ booking }: { booking: CalendarEvent | null }) {
  if (!booking) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">Booking not found</h2>
        <Link className="mt-4 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-black text-white" href="/book">
          Start booking
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <BookingMini booking={booking} />
      <div className="mt-5 grid gap-3">
        {notificationList(booking).map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
            <span className="inline-flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-200">
              <Mail size={16} className="text-cyan-600" aria-hidden="true" />
              {item.label}
            </span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black uppercase text-green-800 dark:bg-green-500/20 dark:text-green-200">
              {item.status}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link className="touch-target inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-4 font-black text-white hover:bg-blue-700" href={`/reschedule?id=${booking.id}`}>
          Reschedule
        </Link>
        <Link className="touch-target inline-flex items-center justify-center rounded-2xl border border-red-200 px-5 py-4 font-black text-red-700 hover:bg-red-50 dark:border-red-500/40 dark:text-red-200 dark:hover:bg-red-500/10" href={`/cancel?id=${booking.id}`}>
          Cancel
        </Link>
      </div>
      <Link className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-4 font-black text-white dark:bg-cyan-500 dark:text-slate-950" href="/demo">
        Open DOS Calendar
      </Link>
    </div>
  );
}

function BookingMini({ booking }: { booking: CalendarEvent | null }) {
  if (!booking) {
    return <p className="rounded-2xl bg-orange-50 p-4 font-bold text-orange-800">No booking selected.</p>;
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200">
          <CalendarCheck size={24} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">{eventStatusLabels[booking.status]}</p>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">{booking.title}</h2>
          <p className="mt-1 font-bold text-slate-600 dark:text-slate-300">{booking.customerName}</p>
          <p className="mt-1 font-black text-blue-700 dark:text-cyan-300">{formatBookingTime(booking)}</p>
        </div>
      </div>
    </div>
  );
}

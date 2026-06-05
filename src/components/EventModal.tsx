"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import type { CalendarEvent } from "@/components/calendarTypes";
import {
  bookingTypeLabels,
  categoryForStatus,
  eventStatusLabels,
  getLeadSourceLabel,
  leadSourceOptions,
  sourceForLeadSource,
} from "@/components/calendarTypes";
import { BOOKING_STATUSES, BOOKING_TYPE_IDS, createOperationalBooking } from "@/lib/dosCalendarCore";

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  editingEvent?: CalendarEvent | null;
};

function buildForm(editingEvent?: CalendarEvent | null) {
  if (editingEvent) {
    const eventIcon = editingEvent.metadata?.eventIcon;
    return {
      title: editingEvent.title,
      customerName: editingEvent.customerName,
      phone: editingEvent.phone,
      email: editingEvent.email,
      organization: editingEvent.organization,
      serviceType: editingEvent.serviceType,
      date: editingEvent.date,
      time: editingEvent.time,
      endDate: editingEvent.endDate || editingEvent.date,
      endTime: editingEvent.endTime || "15:00",
      notes: editingEvent.notes,
      bookingType: editingEvent.bookingType,
      sourceLabel: getLeadSourceLabel(editingEvent),
      status: editingEvent.status,
      eventIcon: typeof eventIcon === "string" ? eventIcon : "",
    };
  }
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    title: "",
    customerName: "",
    phone: "",
    email: "",
    organization: "",
    serviceType: "",
    date: tomorrow.toISOString().slice(0, 10),
    time: "14:00",
    endDate: tomorrow.toISOString().slice(0, 10),
    endTime: "15:00",
    notes: "",
    bookingType: "service-booking" as const,
    sourceLabel: "Manual",
    status: "confirmed" as const,
    eventIcon: "",
  };
}

function EventModalForm({
  editingEvent,
  onClose,
  onSave,
}: {
  editingEvent?: CalendarEvent | null;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
}) {
  const [form, setForm] = useState(() => buildForm(editingEvent));

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "date" && (!current.endDate || current.endDate === current.date) ? { endDate: value } : {}),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const booking = createOperationalBooking({
      title: form.title || "New booking",
      customerName: form.customerName || "Demo Customer",
      phone: form.phone,
      email: form.email,
      organization: form.organization,
      serviceType: form.serviceType || "General booking",
      date: form.date,
      time: form.time,
      endDate: form.endDate || form.date,
      endTime: form.endTime,
      notes: form.notes,
      bookingType: form.bookingType,
      source: sourceForLeadSource(form.sourceLabel),
      status: form.status,
      metadata: {
        ...(editingEvent?.metadata ?? {}),
        leadSource: form.sourceLabel,
        eventIcon: form.eventIcon.trim(),
      },
    }, [], editingEvent?.id);
    onSave({
      ...booking,
      category: categoryForStatus(booking.status),
      contactId: editingEvent?.contactId ?? booking.contactId,
      createdAt: editingEvent?.createdAt ?? booking.createdAt,
    });
    onClose();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="theme-transition max-h-[92svh] w-full overflow-auto rounded-t-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:max-w-2xl sm:rounded-2xl"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">
            {editingEvent ? "Edit booking" : "New booking"}
          </h2>
          <p className="font-medium text-slate-600 dark:text-slate-400">Create a demo calendar event instantly.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="touch-target grid w-12 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <X size={22} aria-hidden="true" />
          <span className="sr-only">Close</span>
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          Event name
          <input
            required
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          Optional icon
          <input
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.eventIcon}
            onChange={(e) => updateField("eventIcon", e.target.value)}
            placeholder="🌸"
          />
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          Customer name
          <input
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
          />
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          Phone
          <input
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          Email
          <input
            type="email"
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          Organization
          <input
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.organization}
            onChange={(e) => updateField("organization", e.target.value)}
          />
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          Service type
          <input
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.serviceType}
            onChange={(e) => updateField("serviceType", e.target.value)}
          />
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          Start date
          <input
            type="date"
            required
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
          />
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          Start time
          <input
            type="time"
            required
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.time}
            onChange={(e) => updateField("time", e.target.value)}
          />
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          End date
          <input
            type="date"
            required
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
          />
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          End time
          <input
            type="time"
            required
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.endTime}
            onChange={(e) => updateField("endTime", e.target.value)}
          />
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          Booking type
          <select
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.bookingType}
            onChange={(e) => updateField("bookingType", e.target.value)}
          >
            {BOOKING_TYPE_IDS.map((id) => (
              <option key={id} value={id}>
                {bookingTypeLabels[id]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          Status
          <select
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
          >
            {BOOKING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {eventStatusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          Source
          <select
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.sourceLabel}
            onChange={(e) => updateField("sourceLabel", e.target.value)}
          >
            {leadSourceOptions.map((source) => (
              <option key={source.label} value={source.label}>
                {source.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300 sm:col-span-2">
          Notes
          <textarea
            className="min-h-24 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />
        </label>
      </div>
      <button className="touch-target mt-5 w-full rounded-xl bg-blue-600 px-5 py-4 text-lg font-black text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700">
        {editingEvent ? "Update booking" : "Save booking"}
      </button>
    </form>
  );
}

export function EventModal({ isOpen, onClose, onSave, editingEvent }: EventModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/45 p-0 dark:bg-black/70 sm:place-items-center sm:p-4">
      <EventModalForm key={editingEvent?.id ?? "new"} editingEvent={editingEvent} onClose={onClose} onSave={onSave} />
    </div>
  );
}

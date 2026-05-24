"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import type { CalendarEvent, CategoryColor } from "@/components/calendarTypes";

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  editingEvent?: CalendarEvent | null;
};

const colorOptions: CategoryColor[] = ["blue", "cyan", "purple", "green", "orange"];

function buildForm(editingEvent?: CalendarEvent | null) {
  if (editingEvent) {
    return {
      title: editingEvent.title,
      customerName: editingEvent.customerName,
      phone: editingEvent.phone,
      serviceType: editingEvent.serviceType,
      date: editingEvent.date,
      time: editingEvent.time,
      endTime: editingEvent.endTime || "15:00",
      notes: editingEvent.notes,
      category: editingEvent.category,
    };
  }
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    title: "",
    customerName: "",
    phone: "",
    serviceType: "",
    date: tomorrow.toISOString().slice(0, 10),
    time: "14:00",
    endTime: "15:00",
    notes: "",
    category: "blue" as CategoryColor,
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
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      id: editingEvent?.id ?? crypto.randomUUID(),
      title: form.title || "New booking",
      customerName: form.customerName || "Demo Customer",
      phone: form.phone,
      serviceType: form.serviceType || "General booking",
      date: form.date,
      time: form.time,
      endTime: form.endTime,
      notes: form.notes,
      category: form.category,
      source: editingEvent?.source ?? "manual",
      status: editingEvent?.status ?? "confirmed",
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
          Event title
          <input
            required
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
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
          Service type
          <input
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.serviceType}
            onChange={(e) => updateField("serviceType", e.target.value)}
          />
        </label>
        <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
          Date
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
          Category colour
          <select
            className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base capitalize dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
          >
            {colorOptions.map((color) => (
              <option key={color} value={color}>
                {color}
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

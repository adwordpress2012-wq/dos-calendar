"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import type { CalendarEvent, CategoryColor } from "@/components/calendarTypes";

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
};

const colorOptions: CategoryColor[] = ["blue", "cyan", "purple", "green", "orange"];

export function EventModal({ isOpen, onClose, onSave }: EventModalProps) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().slice(0, 10);
  const [form, setForm] = useState({
    title: "",
    customerName: "",
    phone: "",
    serviceType: "",
    date: defaultDate,
    time: "14:00",
    notes: "",
    category: "blue" as CategoryColor,
  });

  if (!isOpen) {
    return null;
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      id: crypto.randomUUID(),
      title: form.title || "New booking",
      customerName: form.customerName || "Demo Customer",
      phone: form.phone,
      serviceType: form.serviceType || "General booking",
      date: form.date,
      time: form.time,
      notes: form.notes,
      category: form.category,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/45 p-0 sm:place-items-center sm:p-4">
      <form onSubmit={handleSubmit} className="max-h-[92svh] w-full overflow-auto rounded-t-lg bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-lg">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Add booking</h2>
            <p className="font-medium text-slate-600">Create a demo calendar event instantly.</p>
          </div>
          <button type="button" onClick={onClose} className="touch-target grid w-12 place-items-center rounded-lg bg-slate-100 text-slate-700">
            <X size={22} aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 font-bold text-slate-700">
            Event title
            <input required className="touch-target rounded-lg border border-slate-300 px-4 text-base" value={form.title} onChange={(event) => updateField("title", event.target.value)} />
          </label>
          <label className="grid gap-2 font-bold text-slate-700">
            Customer name
            <input className="touch-target rounded-lg border border-slate-300 px-4 text-base" value={form.customerName} onChange={(event) => updateField("customerName", event.target.value)} />
          </label>
          <label className="grid gap-2 font-bold text-slate-700">
            Phone
            <input className="touch-target rounded-lg border border-slate-300 px-4 text-base" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
          </label>
          <label className="grid gap-2 font-bold text-slate-700">
            Service type
            <input className="touch-target rounded-lg border border-slate-300 px-4 text-base" value={form.serviceType} onChange={(event) => updateField("serviceType", event.target.value)} />
          </label>
          <label className="grid gap-2 font-bold text-slate-700">
            Date
            <input type="date" required className="touch-target rounded-lg border border-slate-300 px-4 text-base" value={form.date} onChange={(event) => updateField("date", event.target.value)} />
          </label>
          <label className="grid gap-2 font-bold text-slate-700">
            Time
            <input type="time" required className="touch-target rounded-lg border border-slate-300 px-4 text-base" value={form.time} onChange={(event) => updateField("time", event.target.value)} />
          </label>
          <label className="grid gap-2 font-bold text-slate-700 sm:col-span-2">
            Notes
            <textarea className="min-h-24 rounded-lg border border-slate-300 px-4 py-3 text-base" value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
          </label>
          <label className="grid gap-2 font-bold text-slate-700 sm:col-span-2">
            Category colour
            <select className="touch-target rounded-lg border border-slate-300 px-4 text-base capitalize" value={form.category} onChange={(event) => updateField("category", event.target.value)}>
              {colorOptions.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="touch-target mt-5 w-full rounded-lg bg-blue-600 px-5 py-4 text-lg font-black text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700">
          Save booking
        </button>
      </form>
    </div>
  );
}

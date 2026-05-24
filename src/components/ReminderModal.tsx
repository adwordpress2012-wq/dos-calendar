"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import type { Reminder } from "@/components/calendarTypes";

type ReminderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: Reminder) => void;
};

export function ReminderModal({ isOpen, onClose, onSave }: ReminderModalProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    title: "",
    contact: "",
    dueDate: today,
    dueTime: "09:00",
    notes: "",
    priority: "Medium" as Reminder["priority"],
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
      title: form.title || "Follow-up reminder",
      contact: form.contact || "Demo Contact",
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      notes: form.notes,
      priority: form.priority,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/45 p-0 sm:place-items-center sm:p-4">
      <form onSubmit={handleSubmit} className="max-h-[92svh] w-full overflow-auto rounded-t-lg bg-white p-5 shadow-2xl sm:max-w-xl sm:rounded-lg">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Add reminder</h2>
            <p className="font-medium text-slate-600">Keep the next customer action visible.</p>
          </div>
          <button type="button" onClick={onClose} className="touch-target grid w-12 place-items-center rounded-lg bg-slate-100 text-slate-700">
            <X size={22} aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 font-bold text-slate-700 sm:col-span-2">
            Reminder title
            <input required className="touch-target rounded-lg border border-slate-300 px-4 text-base" value={form.title} onChange={(event) => updateField("title", event.target.value)} />
          </label>
          <label className="grid gap-2 font-bold text-slate-700">
            Customer/contact
            <input className="touch-target rounded-lg border border-slate-300 px-4 text-base" value={form.contact} onChange={(event) => updateField("contact", event.target.value)} />
          </label>
          <label className="grid gap-2 font-bold text-slate-700">
            Priority
            <select className="touch-target rounded-lg border border-slate-300 px-4 text-base" value={form.priority} onChange={(event) => updateField("priority", event.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
          <label className="grid gap-2 font-bold text-slate-700">
            Due date
            <input type="date" required className="touch-target rounded-lg border border-slate-300 px-4 text-base" value={form.dueDate} onChange={(event) => updateField("dueDate", event.target.value)} />
          </label>
          <label className="grid gap-2 font-bold text-slate-700">
            Due time
            <input type="time" required className="touch-target rounded-lg border border-slate-300 px-4 text-base" value={form.dueTime} onChange={(event) => updateField("dueTime", event.target.value)} />
          </label>
          <label className="grid gap-2 font-bold text-slate-700 sm:col-span-2">
            Notes
            <textarea className="min-h-24 rounded-lg border border-slate-300 px-4 py-3 text-base" value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
          </label>
        </div>
        <button className="touch-target mt-5 w-full rounded-lg bg-green-500 px-5 py-4 text-lg font-black text-white shadow-lg shadow-green-500/25 hover:bg-green-600">
          Save reminder
        </button>
      </form>
    </div>
  );
}

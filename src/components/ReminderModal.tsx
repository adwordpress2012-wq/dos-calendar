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
      completed: false,
    });
    onClose();
    setForm({
      title: "",
      contact: "",
      dueDate: today,
      dueTime: "09:00",
      notes: "",
      priority: "Medium",
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/45 p-0 dark:bg-black/70 sm:place-items-center sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="theme-transition max-h-[92svh] w-full overflow-auto rounded-t-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:max-w-xl sm:rounded-2xl"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Add reminder</h2>
            <p className="font-medium text-slate-600 dark:text-slate-400">Keep the next customer action visible.</p>
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
          <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300 sm:col-span-2">
            Reminder title
            <input
              required
              className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </label>
          <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
            Customer/contact
            <input
              className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={form.contact}
              onChange={(e) => updateField("contact", e.target.value)}
            />
          </label>
          <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
            Priority
            <select
              className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={form.priority}
              onChange={(e) => updateField("priority", e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
          <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
            Due date
            <input
              type="date"
              required
              className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={form.dueDate}
              onChange={(e) => updateField("dueDate", e.target.value)}
            />
          </label>
          <label className="grid gap-2 font-bold text-slate-700 dark:text-slate-300">
            Due time
            <input
              type="time"
              required
              className="touch-target rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={form.dueTime}
              onChange={(e) => updateField("dueTime", e.target.value)}
            />
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
        <button className="touch-target mt-5 w-full rounded-xl bg-green-500 px-5 py-4 text-lg font-black text-white shadow-lg shadow-green-500/25 hover:bg-green-600">
          Save reminder
        </button>
      </form>
    </div>
  );
}

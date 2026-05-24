"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Bot, Check, MessageCircle, Send, Sparkles, X } from "lucide-react";

export type MicahBookingDraft = {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
};

type MicahChatWidgetProps = {
  onBook: (draft: MicahBookingDraft) => void;
};

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

const initialDraft: MicahBookingDraft = {
  name: "Sarah Johnson",
  phone: "0412 345 678",
  service: "Table for 5 guests",
  date: todayInput(),
  time: "19:00",
  notes: "Window seat if available",
};

export function MicahChatWidget({ onBook }: MicahChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<MicahBookingDraft>(initialDraft);
  const [success, setSuccess] = useState(false);

  function updateField(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
    setSuccess(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onBook(draft);
    setSuccess(true);
  }

  function openDrawer() {
    setIsOpen(true);
    setSuccess(false);
  }

  return (
    <>
      <aside className="theme-transition rounded-2xl border border-cyan-300/70 bg-cyan-50 p-4 text-slate-950 shadow-lg shadow-cyan-900/10 dark:border-cyan-400/30 dark:bg-slate-900/90 dark:text-white dark:shadow-cyan-950/30">
        <div className="flex items-start gap-3">
          <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-purple-500 text-white shadow-lg shadow-cyan-600/30">
            <Bot size={24} aria-hidden="true" />
            <span className="absolute inset-0 rounded-full ring-4 ring-cyan-300/30" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Micah SCW Demo</p>
            <p className="mt-1 text-sm font-bold leading-5 text-slate-700 dark:text-slate-300">
              Chat intake that drops a booking straight into DOS Calendar.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openDrawer}
          className="touch-target mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-md hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
        >
          <MessageCircle size={18} aria-hidden="true" />
          Open Micah Chat
        </button>
      </aside>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-sm dark:bg-black/70">
          <button
            type="button"
            aria-label="Close Micah chat"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 cursor-default"
          />
          <aside className="theme-transition relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950 sm:max-w-lg">
            <header className="border-b border-slate-200 p-5 dark:border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-purple-500 text-white">
                      <Bot size={21} aria-hidden="true" />
                    </span>
                    <span className="rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-black uppercase text-purple-800 dark:bg-purple-500/20 dark:text-purple-200">
                      Demo mode
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-950 dark:text-white">Micah Booking Assistant</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="touch-target grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <X size={22} aria-hidden="true" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
            </header>

            <div className="flex-1 space-y-4 overflow-auto p-5">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-sm font-bold leading-6 text-white">
                Hi, can I book a table for 5 guests tonight?
              </div>
              <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                Absolutely - what name, phone number, preferred time, and any notes should I add to the booking?
              </div>

              <form onSubmit={handleSubmit} className="grid gap-3 rounded-2xl border border-cyan-200 bg-cyan-50/80 p-4 dark:border-cyan-500/30 dark:bg-cyan-500/10">
                <div className="flex items-center gap-2 text-sm font-black text-cyan-800 dark:text-cyan-200">
                  <Sparkles size={16} aria-hidden="true" />
                  Quick-fill booking details
                </div>
                <label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                  Name
                  <input
                    name="name"
                    className="touch-target rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    value={draft.name}
                    onChange={updateField}
                  />
                </label>
                <label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                  Phone
                  <input
                    name="phone"
                    inputMode="tel"
                    className="touch-target rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    value={draft.phone}
                    onChange={updateField}
                  />
                </label>
                <label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                  Guests / Service
                  <input
                    name="service"
                    className="touch-target rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    value={draft.service}
                    onChange={updateField}
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                    Date
                    <input
                      name="date"
                      type="date"
                      className="touch-target rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                      value={draft.date}
                      onChange={updateField}
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                    Time
                    <input
                      name="time"
                      type="time"
                      className="touch-target rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                      value={draft.time}
                      onChange={updateField}
                    />
                  </label>
                </div>
                <label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                  Notes
                  <textarea
                    name="notes"
                    className="min-h-20 rounded-xl border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    value={draft.notes}
                    onChange={updateField}
                  />
                </label>
                <button className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-base font-black text-white shadow-lg shadow-cyan-600/20 hover:from-cyan-600 hover:to-blue-700">
                  <Send size={18} aria-hidden="true" />
                  Book through Micah
                </button>
                {success ? (
                  <div className="flow-check flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-black text-white">
                    <Check size={18} aria-hidden="true" />
                    Booking added to calendar
                  </div>
                ) : null}
              </form>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

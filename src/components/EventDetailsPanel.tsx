"use client";

import { Bell, Calendar, Edit3, Eye, Mail, Phone, UserRound, X } from "lucide-react";
import type { CalendarEvent } from "@/components/calendarTypes";
import { bookingTypeLabels, categoryDots, eventStatusLabels, sourceLabels } from "@/components/calendarTypes";
import { notificationStageLabels } from "@/lib/dosCalendarCore";

type EventDetailsPanelProps = {
  event: CalendarEvent | null;
  businessName: string;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
};

export function EventDetailsPanel({ event, businessName, onClose, onEdit }: EventDetailsPanelProps) {
  if (!event) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close booking details"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm dark:bg-black/60"
      />
      <aside className="theme-transition fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:max-w-lg">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-700">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${categoryDots[event.category]}`} />
              <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-blue-800 dark:bg-blue-500/20 dark:text-blue-200">
                {sourceLabels[event.source]}
              </span>
              <span className="rounded-lg bg-green-100 px-2.5 py-1 text-xs font-black capitalize text-green-800 dark:bg-green-500/20 dark:text-green-200">
                {eventStatusLabels[event.status]}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">{event.title}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{businessName} booking</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="touch-target grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <dl className="grid gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <dt className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <UserRound size={14} aria-hidden="true" />
                Customer
              </dt>
              <dd className="mt-1 text-lg font-black text-slate-950 dark:text-white">{event.customerName}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <dt className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Service</dt>
              <dd className="mt-1 text-lg font-black text-slate-950 dark:text-white">{event.serviceType}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <dt className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Booking type</dt>
              <dd className="mt-1 text-lg font-black text-slate-950 dark:text-white">{bookingTypeLabels[event.bookingType]}</dd>
            </div>
            {event.email ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <dt className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</dt>
                <dd className="mt-1 text-lg font-black text-slate-950 dark:text-white">{event.email}</dd>
              </div>
            ) : null}
            {event.phone ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <dt className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <Phone size={14} aria-hidden="true" />
                  Phone
                </dt>
                <dd className="mt-1 text-lg font-black text-slate-950 dark:text-white">{event.phone}</dd>
              </div>
            ) : null}
            {event.email ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <dt className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <Mail size={14} aria-hidden="true" />
                  Email
                </dt>
                <dd className="mt-1 text-lg font-black text-slate-950 dark:text-white">{event.email}</dd>
              </div>
            ) : null}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <dt className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <Calendar size={14} aria-hidden="true" />
                Date &amp; time
              </dt>
              <dd className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                {event.date} · {event.time}
                {event.endTime ? ` – ${event.endTime}` : ""}
              </dd>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
              <dt className="text-xs font-black uppercase tracking-wide text-blue-700 dark:text-blue-200">Next action</dt>
              <dd className="mt-1 text-lg font-black text-slate-950 dark:text-white">{event.nextAction.label}</dd>
              <dd className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{event.nextAction.ownerRole}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <dt className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Notifications</dt>
              <dd className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300">
                {event.notificationEvents.filter((notification) => notification.status === "pending").length} pending /{" "}
                {event.notificationEvents.filter((notification) => notification.status === "skipped").length} skipped
              </dd>
            </div>
            {event.notes ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <dt className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Notes</dt>
                <dd className="mt-2 text-sm font-semibold leading-7 text-slate-700 dark:text-slate-300">{event.notes}</dd>
              </div>
            ) : null}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <dt className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Next action</dt>
              <dd className="mt-1 text-lg font-black text-slate-950 dark:text-white">{event.nextAction.label}</dd>
              <dd className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">{event.nextAction.dueAt}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <dt className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <Bell size={14} aria-hidden="true" />
                Notification events
              </dt>
              <dd className="mt-3 grid gap-2">
                {event.notificationEvents.map((notification) => (
                  <span key={notification.id} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm font-bold dark:bg-slate-900">
                    <span>{notificationStageLabels[notification.stage]}</span>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-black uppercase text-green-800 dark:bg-green-500/20 dark:text-green-200">
                      {notification.status}
                    </span>
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-slate-200 p-4 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="touch-target inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-3 text-sm font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Eye size={16} aria-hidden="true" />
            View
          </button>
          <button
            type="button"
            onClick={() => onEdit(event)}
            className="touch-target inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-black text-white hover:bg-blue-700"
          >
            <Edit3 size={16} aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="touch-target inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-3 text-sm font-black text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
}

"use client";

import { BellRing, Bot, CalendarCheck, Check, MessageCircle, Send } from "lucide-react";

type MicahBookingSimulationProps = {
  onSimulate: () => void;
  isAnimating: boolean;
  animationStep: number;
  businessName: string;
};

const flow = [
  {
    title: "Customer chat/call received",
    copy: "Hi, can I book a quote for tomorrow afternoon?",
    icon: MessageCircle,
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-200",
  },
  {
    title: "Micah captures details",
    copy: "Name, phone, service type, and preferred time captured automatically.",
    icon: Bot,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200",
  },
  {
    title: "DOS Calendar creates booking",
    copy: "Booking appears on the calendar in the next available afternoon slot.",
    icon: CalendarCheck,
    color: "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200",
  },
  {
    title: "Business notified",
    copy: "Team sees the new booking and can follow up immediately.",
    icon: BellRing,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200",
  },
];

export function MicahBookingSimulation({ onSimulate, isAnimating, animationStep, businessName }: MicahBookingSimulationProps) {
  return (
    <aside className="theme-transition rounded-2xl border border-purple-200 bg-white p-4 shadow-soft-color dark:border-purple-500/30 dark:bg-slate-900/80 dark:shadow-purple-900/20">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-purple-700 dark:text-purple-300">Micah / SCW simulation</p>
          <h2 className="text-xl font-black leading-snug text-slate-950 dark:text-white">
            Customer asks → Micah captures → {businessName} calendar books
          </h2>
        </div>
        <span className="shrink-0 rounded-xl bg-purple-600 px-3 py-2 text-xs font-black uppercase text-white">Demo mode</span>
      </div>
      <div className="grid gap-3">
        {flow.map((item, index) => (
          <div
            key={item.title}
            className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60"
          >
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${item.color}`}>
              <item.icon size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-black text-slate-950 dark:text-white">{item.title}</p>
                {isAnimating && animationStep > index ? (
                  <span
                    className="flow-check grid h-6 w-6 place-items-center rounded-lg bg-green-500 text-white"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <Check size={16} aria-hidden="true" />
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-400">{item.copy}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onSimulate}
        disabled={isAnimating}
        className="touch-target mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-4 text-base font-black text-white shadow-lg shadow-purple-600/25 hover:from-purple-700 hover:to-blue-700 disabled:opacity-70"
      >
        <Send size={20} aria-hidden="true" />
        Simulate customer booking from Micah SCW
      </button>
    </aside>
  );
}

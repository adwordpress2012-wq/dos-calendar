"use client";

import { Bot, CalendarCheck, Check, MessageCircle, Send } from "lucide-react";

type MicahBookingSimulationProps = {
  onSimulate: () => void;
  isAnimating: boolean;
};

const flow = [
  { title: "Customer message", copy: "Hi, can I book a quote for tomorrow afternoon?", icon: MessageCircle, color: "bg-cyan-100 text-cyan-800" },
  { title: "Micah action", copy: "Captured name, phone, service and preferred time.", icon: Bot, color: "bg-purple-100 text-purple-800" },
  { title: "DOS Calendar action", copy: "Booking added to calendar.", icon: CalendarCheck, color: "bg-green-100 text-green-800" },
];

export function MicahBookingSimulation({ onSimulate, isAnimating }: MicahBookingSimulationProps) {
  return (
    <aside className="rounded-lg border border-purple-100 bg-white p-4 shadow-soft-color">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-purple-700">Micah / SCW booking simulation</p>
          <h2 className="text-2xl font-black text-slate-950">Customer asks → Micah captures → Calendar books</h2>
        </div>
        <span className="hidden rounded-lg bg-purple-600 px-3 py-2 text-sm font-black text-white sm:inline-flex">Live demo</span>
      </div>
      <div className="grid gap-3">
        {flow.map((item, index) => (
          <div key={item.title} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${item.color}`}>
              <item.icon size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-black text-slate-950">{item.title}</p>
                {isAnimating ? (
                  <span className="flow-check grid h-6 w-6 place-items-center rounded-lg bg-green-500 text-white" style={{ animationDelay: `${index * 150}ms` }}>
                    <Check size={16} aria-hidden="true" />
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{item.copy}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onSimulate} className="touch-target mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-4 text-base font-black text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700">
        <Send size={20} aria-hidden="true" />
        Simulate customer booking
      </button>
    </aside>
  );
}

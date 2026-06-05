import { ArrowRight, BellRing, Bot, CalendarPlus, CheckCircle2, RefreshCcw } from "lucide-react";

const steps = [
  { label: "Customer asks Micah", icon: Bot, color: "bg-cyan-100 text-cyan-700" },
  { label: "Micah captures details", icon: Bot, color: "bg-purple-100 text-purple-700" },
  { label: "DOS Calendar books it", icon: CalendarPlus, color: "bg-blue-100 text-blue-700" },
  { label: "Emails are sent", icon: BellRing, color: "bg-green-100 text-green-700" },
  { label: "Customer confirms", icon: CheckCircle2, color: "bg-orange-100 text-orange-700" },
  { label: "Reschedule or cancel", icon: RefreshCcw, color: "bg-slate-100 text-slate-700" },
];

export function VisualFlow() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">The V1 road</h2>
          <p className="mt-3 text-lg font-medium text-slate-600">Booking → notification → confirmation → reschedule or cancel.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, index) => (
            <div className="contents" key={step.label}>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <span className={`mb-4 grid h-14 w-14 place-items-center rounded-lg ${step.color}`}>
                  <step.icon size={28} aria-hidden="true" />
                </span>
                <p className="text-lg font-black text-slate-950">{step.label}</p>
              </div>
              {index < steps.length - 1 ? <ArrowRight className="mx-auto hidden text-blue-500 xl:hidden" size={24} aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

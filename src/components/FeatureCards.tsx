import { Bell, BriefcaseBusiness, CalendarDays, ClipboardList, MessageCircle, NotebookTabs } from "lucide-react";

const features = [
  { title: "Online bookings", icon: CalendarDays, color: "bg-blue-600" },
  { title: "Call/chat booking intake", icon: MessageCircle, color: "bg-cyan-500" },
  { title: "Reminders", icon: Bell, color: "bg-orange-400" },
  { title: "Calendar events", icon: ClipboardList, color: "bg-purple-500" },
  { title: "Customer notes", icon: NotebookTabs, color: "bg-green-500" },
  { title: "Staff/job scheduling", icon: BriefcaseBusiness, color: "bg-slate-900" },
];

export function FeatureCards() {
  return (
    <section className="bg-blue-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">Everything visible in one place</h2>
          <p className="mt-3 text-lg font-medium text-slate-600">A colourful demo surface for bookings, customer context, and daily operations.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-lg border border-white bg-white p-5 shadow-soft-color">
              <span className={`mb-5 grid h-14 w-14 place-items-center rounded-lg text-white ${feature.color}`}>
                <feature.icon size={27} aria-hidden="true" />
              </span>
              <h3 className="text-xl font-black text-slate-950">{feature.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

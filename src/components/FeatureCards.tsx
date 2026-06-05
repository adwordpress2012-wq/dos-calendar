import { Bell, CalendarDays, CalendarX, CheckCircle2, MessageCircle, RefreshCcw } from "lucide-react";

const features = [
  { title: "Micah booking intake", icon: MessageCircle, color: "bg-cyan-500" },
  { title: "DOS Calendar booking", icon: CalendarDays, color: "bg-blue-600" },
  { title: "Internal and customer email", icon: Bell, color: "bg-orange-400" },
  { title: "Customer confirmation", icon: CheckCircle2, color: "bg-green-500" },
  { title: "Reschedule request", icon: RefreshCcw, color: "bg-purple-500" },
  { title: "Cancellation request", icon: CalendarX, color: "bg-slate-900" },
];

export function FeatureCards() {
  return (
    <section className="bg-blue-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">One page. One purpose.</h2>
          <p className="mt-3 text-lg font-medium text-slate-600">The demo shows only the road from request to next action.</p>
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

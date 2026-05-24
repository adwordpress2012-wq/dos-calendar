import Link from "next/link";
import { ArrowRight, CalendarCheck, MessageCircle, PhoneCall, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-[6%] top-16 h-40 w-40 rounded-lg bg-cyan-400/25" />
        <div className="absolute right-[9%] top-24 h-52 w-52 rounded-lg bg-purple-500/25" />
        <div className="absolute bottom-16 left-[34%] h-32 w-56 rounded-lg bg-green-400/20" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,.78),rgba(15,23,42,.68)_55%,rgba(14,165,233,.6))]" />
      </div>
      <div className="relative mx-auto grid min-h-[calc(100svh-76px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:px-8">
        <div className="max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-lg bg-white/12 px-4 py-2 text-sm font-bold text-cyan-100 ring-1 ring-white/15">
            <Sparkles size={18} aria-hidden="true" />
            Smart booking intake for busy teams
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-normal sm:text-6xl lg:text-7xl">
            Bookings, reminders, and customer calls in one smart calendar.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-blue-50 sm:text-xl">
            DOS Calendar turns customer chats, calls, reminders, and bookings into one simple operational calendar.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="touch-target inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-6 py-4 text-base font-black text-slate-950 shadow-xl shadow-cyan-950/30 hover:bg-green-300" href="/demo">
              Try Calendar Demo <ArrowRight size={20} aria-hidden="true" />
            </Link>
            <a className="touch-target inline-flex items-center justify-center rounded-lg bg-white px-6 py-4 text-base font-black text-blue-700 hover:bg-orange-100" href="https://www.directiveos.com.au/contact">
              Contact Sales
            </a>
            <a className="touch-target inline-flex items-center justify-center rounded-lg border border-white/25 px-6 py-4 text-base font-black text-white hover:bg-white/10" href="https://dosworkspace.com">
              Explore DOS Workspace
            </a>
          </div>
        </div>
        <div className="mb-4 grid gap-4 self-end rounded-lg bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-md">
          {[
            { icon: MessageCircle, title: "Customer chat", detail: "Quote request for tomorrow", color: "bg-cyan-300 text-slate-950" },
            { icon: PhoneCall, title: "Micah captures", detail: "Name, phone, service, time", color: "bg-purple-300 text-slate-950" },
            { icon: CalendarCheck, title: "Calendar booked", detail: "Team gets notified instantly", color: "bg-green-300 text-slate-950" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4 rounded-lg bg-white p-4 text-slate-950 shadow-xl">
              <span className={`grid h-14 w-14 place-items-center rounded-lg ${item.color}`}>
                <item.icon size={25} aria-hidden="true" />
              </span>
              <div>
                <p className="font-black">{item.title}</p>
                <p className="text-sm font-semibold text-slate-600">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

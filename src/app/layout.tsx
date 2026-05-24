import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import "./globals.css";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DOS Calendar",
  description: "Bookings, reminders, and customer calls in one smart calendar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased`}>
        <header className="sticky top-0 z-40 border-b border-white/70 bg-white/88 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3 text-lg font-black text-slate-950">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-600 text-white shadow-soft-color">
                <CalendarDays size={25} aria-hidden="true" />
              </span>
              <span>DOS Calendar</span>
            </Link>
            <div className="flex items-center gap-2 text-sm font-bold">
              <Link className="touch-target rounded-lg px-4 py-3 text-slate-700 hover:bg-cyan-50 hover:text-blue-700" href="/demo">
                Demo
              </Link>
              <a className="hidden touch-target rounded-lg px-4 py-3 text-slate-700 hover:bg-purple-50 hover:text-purple-700 sm:inline-flex" href="https://dosworkspace.com">
                DOS Workspace
              </a>
              <a className="touch-target rounded-lg bg-slate-950 px-4 py-3 text-white shadow-lg shadow-slate-900/15 hover:bg-blue-700" href="https://www.directiveos.com.au/contact">
                Contact Sales
              </a>
            </div>
          </nav>
        </header>
        {children}
        <Footer />
      </body>
    </html>
  );
}

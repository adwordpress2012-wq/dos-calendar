import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-8 text-center dark:border-slate-800 dark:bg-slate-950">
      <nav className="mb-4 flex flex-wrap items-center justify-center gap-4 text-sm font-bold">
        <Link className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400" href="/">
          Home
        </Link>
        <Link className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400" href="/demo">
          DOS Calendar Demo
        </Link>
        <a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400" href="https://dosworkspace.com">
          DOS Workspace
        </a>
        <a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400" href="https://www.directiveos.com.au">
          Directive OS
        </a>
        <a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400" href="https://www.directiveos.com.au/contact">
          Contact Sales
        </a>
      </nav>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
        © 2026 DOS — Directive Operating Systems Pty Ltd. All rights reserved.
      </p>
    </footer>
  );
}

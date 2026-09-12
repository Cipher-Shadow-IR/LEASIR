"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useWallet } from "@/hooks/useContract";
import { ArrowUpRight, Menu, X, Plus, Wallet } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/agreements", label: "Agreements" },
  { href: "/create", label: "Draft Lease" },
];

export default function Navbar({ onConnect }) {
  const { account, connect } = useWallet();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleConnect = async () => {
    try {
      const addr = await connect();
      if (onConnect) onConnect(addr);
    } catch (e) {
    }
  };

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const mainLinks = NAV_LINKS.filter((l) => l.href !== "/create");
  const draftLink = NAV_LINKS.find((l) => l.href === "/create");

  return (
    <header className="relative sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl transition-colors duration-200 dark:border-slate-800/70 dark:bg-slate-950/85">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/45 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3 lg:gap-8">
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white p-1 ring-1 ring-slate-200 transition-all group-hover:shadow-md group-hover:ring-indigo-300 dark:bg-slate-900 dark:ring-slate-700 dark:group-hover:ring-indigo-500/50">
                <img
                  src="/LEASIR_LOGO.png"
                  alt="LEASIR logo"
                  className="h-7 w-7 object-contain"
                />
              </span>
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-lg font-extrabold tracking-tight text-transparent dark:from-indigo-300 dark:via-indigo-400 dark:to-violet-300">
                LEASIR
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {mainLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-all duration-200 ${
                      active
                        ? "bg-indigo-600/10 text-indigo-700 ring-1 ring-inset ring-indigo-600/15 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-100"
                    }`}
                  >
                    <span
                      className={`h-1 w-1 rounded-full transition-colors ${
                        active
                          ? "bg-indigo-500 dark:bg-indigo-400"
                          : "bg-transparent"
                      }`}
                    />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {draftLink && (
              <Link
                href={draftLink.href}
                className="hidden items-center gap-1.5 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-on-accent shadow-sm shadow-indigo-600/25 transition-all hover:shadow-md hover:shadow-indigo-600/30 hover:brightness-110 active:scale-[0.97] md:inline-flex"
              >
                <Plus className="h-4 w-4" />
                Draft Lease
              </Link>
            )}

            <a
              href="https://galaxir.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 lg:inline-flex dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-100"
            >
              by Ishaan Ray
              <ArrowUpRight className="h-3 w-3" />
            </a>

            <ThemeToggle />

            {account ? (
              <div
                className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 font-mono text-xs font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200"
                title={account}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>
                  {account.slice(0, 6)}&hellip;{account.slice(-4)}
                </span>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-on-accent shadow-sm shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                <Wallet className="h-4 w-4" />
                Connect
              </button>
            )}

            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:text-slate-900 md:hidden dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="animate-nav-drop border-t border-slate-200 py-3 md:hidden dark:border-slate-800">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-indigo-600/10 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        active
                          ? "bg-indigo-500 dark:bg-indigo-400"
                          : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
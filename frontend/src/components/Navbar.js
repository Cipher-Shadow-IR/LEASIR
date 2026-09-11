"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/hooks/useContract";
import { Scale, PlusCircle, LayoutDashboard, FileText, ArrowUpRight, Wallet } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar({ onConnect }) {
  const { account, connect } = useWallet();
  const pathname = usePathname();

  const handleConnect = async () => {
    try {
      const addr = await connect();
      if (onConnect) onConnect(addr);
    } catch (e) {
      // user rejected or error
    }
  };

  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/agreements", label: "Agreements", icon: FileText },
    { href: "/create", label: "Draft Lease", icon: PlusCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/LEASIR_LOGO.png"
                alt="LEASIR Logo"
                className="h-9 w-9 object-contain group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-sans">LEASIR</span>
                  <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                    Protocol
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                  Smart Contract Lease Agreements
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="hidden sm:flex sm:items-center sm:gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <a
              href="https://galaxir.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 px-2.5 py-1 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <span>by Ishaan Ray</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            {account ? (
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/80 px-3 py-1.5 font-mono text-xs text-slate-700 dark:text-slate-300 shadow-inner">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-600 hover:to-blue-700 transition-all active:scale-[0.98]"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


"use client";

import Link from "next/link";
import { Scale, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 tracking-tight">LEASIR</span>
                <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[10px] font-mono text-indigo-400 uppercase font-semibold">
                  v2.1 EVM
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous Legal Lease & Escrow Protocol</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-slate-200 transition-colors">Dashboard</Link>
            <Link href="/agreements" className="hover:text-slate-200 transition-colors">Registry</Link>
            <Link href="/create" className="hover:text-slate-200 transition-colors">New Lease</Link>
            <a
              href="https://galaxir.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Portfolio
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://github.com/Cipher-Shadow-IR"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} LEASIR Protocol. Non-custodial legal escrow agreements.</p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>Smart Contract: Hardhat Local / Sepolia Testnet</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

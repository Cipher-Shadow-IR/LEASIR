import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50/80 py-12 dark:border-slate-800/80 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/LEASIR_LOGO.png"
                alt="LEASIR logo"
                className="h-8 w-8 object-contain shrink-0"
              />
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                LEASIR
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Rental agreements recorded and executed on-chain: rent terms,
              security deposit terms, and dispute states enforced by a Solidity
              smart contract.
            </p>
          </div>

          <div>
            <p className="meta-label mb-3 text-slate-500 dark:text-slate-400">
              Product
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/agreements"
                  className="text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Agreement Registry
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Draft Lease
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="meta-label text-slate-500 dark:text-slate-400">
              Author
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Designed &amp; Developed by{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                Ishaan Ray
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <a
                href="https://github.com/Cipher-Shadow-IR"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                GitHub
                <ArrowUpRight className="h-3 w-3" />
              </a>
              <a
                href="https://linkedin.com/in/ishaan-ray-cs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                LinkedIn
                <ArrowUpRight className="h-3 w-3" />
              </a>
              <a
                href="https://galaxir.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                Portfolio
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/60 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} LEASIR. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono">Contract network: Hardhat local</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
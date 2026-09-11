"use client";

import Link from "next/link";
import { Clock, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, UserCheck, Calendar, Coins } from "lucide-react";

const STATE_BADGES = {
  Pending: {
    badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    icon: Clock,
  },
  Active: {
    badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  Terminated: {
    badgeClass: "bg-slate-500/10 text-slate-600 border-slate-300 dark:text-slate-400 dark:border-slate-700/50",
    icon: ShieldCheck,
  },
  Disputed: {
    badgeClass: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
    icon: AlertTriangle,
  },
  Completed: {
    badgeClass: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400",
    icon: CheckCircle2,
  },
};

export default function AgreementCard({ agreement }) {
  const badgeConfig = STATE_BADGES[agreement.state] || STATE_BADGES.Pending;
  const StateIcon = badgeConfig.icon;

  const formatDate = (dateObj) => {
    if (!dateObj) return "N/A";
    if (dateObj instanceof Date && !isNaN(dateObj)) {
      return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    return String(dateObj);
  };

  return (
    <Link href={`/agreements/${agreement.id}`} className="group block">
      <div className="glow-card glow-card-hover rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-full">
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60">
                LEASE #{agreement.id}
              </span>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeConfig.badgeClass}`}
            >
              <StateIcon className="h-3 w-3" />
              <span>{agreement.state}</span>
            </span>
          </div>

          {/* Financials Row */}
          <div className="grid grid-cols-2 gap-3 mb-4 rounded-xl bg-slate-50 p-3 border border-slate-200 dark:bg-slate-900/70 dark:border-slate-800/80">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">Monthly Rent</span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                {agreement.rentAmount} <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">ETH</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">Escrow Deposit</span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                {agreement.securityDeposit} <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">ETH</span>
              </span>
            </div>
          </div>

          {/* Parties & Dates */}
          <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-slate-500" />
                Tenant
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {agreement.tenant ? `${agreement.tenant.slice(0, 6)}...${agreement.tenant.slice(-4)}` : "Unassigned"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                Expires
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {formatDate(agreement.endDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Link Footer */}
        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-medium text-indigo-600 group-hover:text-indigo-500 transition-colors dark:border-slate-800/60 dark:text-indigo-400 dark:group-hover:text-indigo-300">
          <span>Inspect Agreement</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}


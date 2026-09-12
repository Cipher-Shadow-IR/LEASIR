"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STATE_TONE = {
  Pending: "text-amber-600 dark:text-amber-400",
  Active: "text-emerald-600 dark:text-emerald-400",
  Terminated: "text-slate-500 dark:text-slate-400",
  Disputed: "text-rose-600 dark:text-rose-400",
  Completed: "text-indigo-600 dark:text-indigo-400",
};

const stateDot = (state) => {
  switch (state) {
    case "Active":
      return "bg-emerald-500";
    case "Pending":
      return "bg-amber-500";
    case "Disputed":
      return "bg-rose-500";
    case "Terminated":
      return "bg-slate-500";
    default:
      return "bg-indigo-500";
  }
};

export default function AgreementCard({ agreement }) {
  const tone = STATE_TONE[agreement.state] || STATE_TONE.Pending;

  const formatDate = (dateObj) => {
    if (!dateObj) return "N/A";
    if (dateObj instanceof Date && !isNaN(dateObj)) {
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return String(dateObj);
  };

  return (
    <Link
      href={`/agreements/${agreement.id}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-colors group-hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900/40 dark:group-hover:border-indigo-500/40">
        <div className="flex items-center justify-between">
          <span className="meta-label text-slate-400 dark:text-slate-500">
            Lease #{agreement.id}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${tone}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${stateDot(agreement.state)}`} />
            {agreement.state}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-6">
          <div>
            <span className="meta-label block text-slate-400 dark:text-slate-500">
              Monthly rent
            </span>
            <span className="mt-1 block font-mono text-base font-bold text-slate-900 dark:text-slate-100">
              {agreement.rentAmount} <span className="text-xs font-medium text-slate-400">ETH</span>
            </span>
          </div>
          <div>
            <span className="meta-label block text-slate-400 dark:text-slate-500">
              Security deposit
            </span>
            <span className="mt-1 block font-mono text-base font-bold text-slate-900 dark:text-slate-100">
              {agreement.securityDeposit} <span className="text-xs font-medium text-slate-400">ETH</span>
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-xs dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="meta-label text-slate-400 dark:text-slate-500">
              Tenant
            </span>
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {agreement.tenant
                ? `${agreement.tenant.slice(0, 6)}&hellip;${agreement.tenant.slice(-4)}`
                : "Unassigned"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="meta-label text-slate-400 dark:text-slate-500">
              Term ends
            </span>
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {formatDate(agreement.endDate)}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span className="group-hover:text-indigo-600 transition-colors dark:group-hover:text-indigo-400">
            Inspect agreement
          </span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </article>
    </Link>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function LeasirPreloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setDone(true), reduce ? 120 : 1100);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-50 dark:bg-slate-950"
      aria-hidden="true"
    >
      <div className="flex w-64 flex-col items-center gap-6 text-center select-none">
        <div className="animate-logo-fade flex items-center gap-3">
          <img
            src="/LEASIR_LOGO.png"
            alt=""
            className="h-12 w-12 object-contain"
          />
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            LEASIR
          </span>
        </div>

        <div className="w-full">
          <div className="h-px w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
            <div className="animate-doc-line h-full w-full bg-indigo-600 dark:bg-indigo-400" />
          </div>
        </div>

        <p className="meta-label text-slate-400 dark:text-slate-500">
          On-chain lease registry
        </p>
      </div>
    </div>
  );
}
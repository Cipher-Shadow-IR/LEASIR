"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "INITIATING ESCROW RAIL",
  "LOADING SOLIDITY ORACLE",
  "VERIFYING SIGNATURE SET",
  "OPENING LEASE RECORD",
];

export default function LeasirPreloader() {
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setDone(true), 120);
      return () => clearTimeout(t);
    }

    let raf;
    const start = performance.now();
    const duration = 1500;

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setProgress(Math.round(t * 100));
      setStep(Math.min(Math.floor(t * STEPS.length), STEPS.length - 1));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        const t2 = setTimeout(() => setDone(true), 180);
        raf = t2;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-50 dark:bg-slate-950" aria-hidden="true">
      <div className="flex flex-col items-center gap-8 text-center select-none">
        {/* Wordmark */}
        <div className="flex items-center gap-3">
          <img
            src="/LEASIR_LOGO.png"
            alt=""
            className="h-12 w-12 object-contain"
          />
          <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
            LEASIR<span className="text-indigo-600 dark:text-indigo-400">.</span>
          </span>
        </div>

        {/* Structured ledger rail */}
        <div className="w-56 space-y-3">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <span>{STEPS[step]}</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 transition-[width] duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-colors duration-200 ${
                  i < step ? "bg-indigo-500" : i === step ? "bg-indigo-500/50" : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
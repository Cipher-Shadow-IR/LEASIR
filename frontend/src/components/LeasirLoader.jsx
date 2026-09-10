"use client";

import { Scale, Lock, ShieldCheck } from "lucide-react";

export default function LeasirLoader({
  message = "Validating Smart Contract Escrow State...",
  submessage = "Synchronizing on-chain tenancy agreement parameters"
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-5">
      {/* High-Tech Orbital Escrow Rings */}
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping opacity-60" />
        <div className="absolute inset-1 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-3 rounded-full border-2 border-blue-500/40 border-b-cyan-400 animate-spin [animation-direction:reverse]" />
        <div className="w-5 h-5 rounded-full bg-indigo-500/20 backdrop-blur-md flex items-center justify-center border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.6)]">
          <Scale className="w-3 h-3 text-indigo-400" />
        </div>
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-bold tracking-tight text-white">
          {message}
        </h4>
        <p className="text-xs text-slate-400 font-mono">
          {submessage}
        </p>
      </div>

      <div className="w-40 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 w-3/4 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

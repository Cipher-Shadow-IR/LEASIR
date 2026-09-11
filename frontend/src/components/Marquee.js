import { ShieldCheck, Scale, FileText, Lock, Building, Zap } from "lucide-react";

const ITEMS = [
  { label: "Multi-Sig Security Deposit Escrow", icon: Lock },
  { label: "Automated Monthly Rent Routing", icon: Zap },
  { label: "Transparent On-Chain Arbitration", icon: Scale },
  { label: "Residential & Commercial Leases", icon: Building },
  { label: "Immutable Legal Terms Hash", icon: FileText },
  { label: "Audited Solidity Escrow Logic", icon: ShieldCheck },
];

export default function Marquee({ className = "" }) {
  return (
    <div
      className={`relative w-full overflow-hidden border-y border-slate-200 bg-slate-50/80 py-3.5 backdrop-blur-sm select-none dark:border-slate-800/80 dark:bg-slate-950/60 ${className}`}
      aria-hidden="true"
    >
      <div className="flex w-max items-center gap-10 animate-marquee">
        {[...ITEMS, ...ITEMS, ...ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 text-xs font-mono font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400"
            >
              <Icon className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>{item.label}</span>
              <span className="text-indigo-500/40">◆</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

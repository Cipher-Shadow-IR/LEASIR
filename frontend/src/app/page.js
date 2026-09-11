"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { connectWallet, switchToLocalhost, getBalance } from "@/lib/web3";
import AgreementCard from "@/components/AgreementCard";
import { useAgreements } from "@/hooks/useContract";
import CountUp from "@/components/CountUp";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import {
  Scale,
  Shield,
  PlusCircle,
  Wallet,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  UserCheck,
  Building,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Lock,
  RefreshCw,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [isLandlord, setIsLandlord] = useState(true);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const { agreements, loading, fetchByLandlord, fetchByTenant } = useAgreements();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  const connect = async () => {
    try {
      const { address } = await connectWallet();
      await switchToLocalhost();
      setAccount(address);
      const bal = await getBalance(address);
      setBalance(bal);
      await loadAgreements(address);
    } catch (e) {
      console.error(e);
    }
  };

  const copyAccount = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const loadAgreements = async (addr) => {
    if (!addr) return;
    if (isLandlord) {
      await fetchByLandlord(addr);
    } else {
      await fetchByTenant(addr);
    }
  };

  useEffect(() => {
    if (account) {
      loadAgreements(account);
    }
  }, [account, isLandlord]);

  const activeCount = agreements.filter((a) => a.state === "Active").length;
  const pendingCount = agreements.filter((a) => a.state === "Pending").length;
  const disputedCount = agreements.filter((a) => a.state === "Disputed").length;

  // Calculate total escrowed deposit across agreements
  const totalEscrowEth = agreements
    .reduce((sum, a) => sum + (parseFloat(a.securityDeposit) || 0), 0)
    .toFixed(3);

  // Unconnected Hero State
  if (!account) {
    return (
      <div className="py-6 sm:py-8 space-y-12">
        {/* Protocol Hero with Floating Tilted UI Cards */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-100 via-white to-white dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-950 p-6 sm:p-12 lg:p-16 legal-grid shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.18),transparent_70%)] pointer-events-none" />

          {/* Ambient blurred glow blobs */}
          <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl animate-float-slow" />
          <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl animate-float-slower" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left / Center Column: Copy & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>ETHEREUM SMART CONTRACT ESCROW PROTOCOL</span>
                </div>
              </Reveal>

              <Reveal delay={90}>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
                  Trustless Digital Leases with{" "}
                  <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300">
                    On-Chain Escrow
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={180}>
                <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                LEASIR replaces paper rental agreements with deterministic Solidity smart contracts.
                Automate rent payments directly to landlords, safeguard security deposits in trustless escrow,
                and resolve tenancy disputes with mathematical transparency.
              </p>
              </Reveal>

              <Reveal delay={260}>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={connect}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 hover:from-indigo-600 hover:to-blue-700 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Connect MetaMask</span>
                </button>
                <Link
                  href="/agreements"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-all"
                >
                  <span>Browse Registry</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              </Reveal>

              {/* Protocol Telemetry Mini Strip */}
              <Reveal delay={340}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-left">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Escrow Value</p>
                  <p className="text-sm sm:text-base font-bold text-indigo-400">
                    <CountUp end={850} prefix="$" suffix="K+" />
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Leases Deployed</p>
                  <p className="text-sm sm:text-base font-bold text-white">
                    <CountUp end={1240} suffix="+" />
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Resolution Rate</p>
                  <p className="text-sm sm:text-base font-bold text-emerald-400">
                    <CountUp end={99.8} decimals={1} suffix="%" />
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Arbitration</p>
                  <p className="text-sm sm:text-base font-bold text-cyan-400">Solidity Logic</p>
                </div>
              </div>
              </Reveal>
            </div>

            {/* Right Column: Floating Tilted UI Cards */}
            <div className="lg:col-span-5 relative h-[360px] sm:h-[400px] flex items-center justify-center min-w-0">
              <div className="relative w-full max-w-sm h-full">
                
                {/* Floating Card 1: Live Escrow Agreement */}
                <div className="absolute left-[0%] top-[12%] w-[88%] rounded-2xl border border-indigo-500/30 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-xl animate-float-slow z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-white">DEPOSIT ESCROW</span>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400 font-semibold uppercase">
                      Locked • Active
                    </span>
                  </div>

                  <div className="mt-4 space-y-1">
                    <p className="text-xs font-semibold text-slate-200">Apt 4B, 742 Evergreen Terrace</p>
                    <p className="text-[11px] font-mono text-slate-400">Tenant: 0x7099...79c8</p>
                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-400 font-mono">Security Deposit</span>
                      <span className="text-sm font-bold font-mono text-indigo-400">1.250 ETH</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                    <span>Smart Contract #28</span>
                    <span className="text-emerald-400 font-semibold">Verified Safe</span>
                  </div>
                </div>

                {/* Floating Card 2: Automated Monthly Routing */}
                <div className="absolute right-[2%] top-[4%] w-[68%] rounded-xl border border-slate-800 bg-slate-950/95 p-4 shadow-xl backdrop-blur-xl animate-float-slower z-30">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-mono font-medium text-white">Direct Rent Stream</span>
                  </div>
                  <p className="mt-1 text-[10px] font-mono text-slate-400">Next due in 14 days</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                    <span>Amount</span>
                    <span className="font-bold">0.65 ETH / mo</span>
                  </div>
                </div>

                {/* Floating Card 3: Mutual Attestation */}
                <div className="absolute left-[10%] bottom-[6%] w-[72%] rounded-xl border border-blue-500/30 bg-slate-900/90 p-4 shadow-xl backdrop-blur-xl animate-float z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-blue-400" />
                      <span className="text-xs font-semibold text-white">Arbitration Clause</span>
                    </div>
                    <span className="text-[10px] font-mono text-blue-400">EVM Native</span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">Equitable deposit return via contract consensus</p>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Infinite Marquee Ticker */}
        <Marquee />

        {/* Protocol Capabilities Bento */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="glow-card rounded-2xl p-6 space-y-3 glow-card-hover">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Deposit Escrow Lock</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tenant deposits are held safely in the verified smart contract balance, preventing unilateral withholding by landlords.
            </p>
          </div>

          <div className="glow-card rounded-2xl p-6 space-y-3 glow-card-hover">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Coins className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Direct Rent Routing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rent transfers trigger on-chain state updates and forward exact wei directly to the landlord wallet with verifiable receipts.
            </p>
          </div>

          <div className="glow-card rounded-2xl p-6 space-y-3 glow-card-hover">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Dispute Arbitration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Either party can flag disputes directly to the contract. Arbitration logic governs fair escrow distribution based on mutual terms.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Account & Protocol Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Lease Command Center</h1>
            <span className="rounded bg-indigo-500/10 px-2 py-0.5 font-mono text-xs font-medium text-indigo-400">
              {isLandlord ? "Landlord Mode" : "Tenant Mode"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-slate-300">Wallet: {account}</span>
            <button
              onClick={copyAccount}
              className="inline-flex items-center gap-1 font-mono text-indigo-400 hover:underline ml-1 cursor-pointer"
            >
              {copiedAccount ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copiedAccount ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-right">
            <span className="text-[11px] text-slate-400 font-mono block">Available Balance</span>
            <span className="text-sm font-bold text-white font-mono">
              {parseFloat(balance).toFixed(4)} <span className="text-indigo-400">ETH</span>
            </span>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Lease</span>
          </Link>
        </div>
      </div>

      {/* 4 Protocol Telemetry Badges with CountUp */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glow-card rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Active Leases</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono">
            <CountUp end={activeCount} />
          </p>
        </div>
        <div className="glow-card rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Pending Leases</span>
          <p className="text-2xl font-bold text-amber-400 font-mono">
            <CountUp end={pendingCount} />
          </p>
        </div>
        <div className="glow-card rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">In Dispute</span>
          <p className="text-2xl font-bold text-rose-400 font-mono">
            <CountUp end={disputedCount} />
          </p>
        </div>
        <div className="glow-card rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Escrow Locked</span>
          <p className="text-2xl font-bold text-indigo-400 font-mono">
            <CountUp end={parseFloat(totalEscrowEth) || 0} decimals={3} suffix=" ETH" />
          </p>
        </div>
      </div>

      {/* Role Toggle Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900/60 p-1">
          <button
            onClick={() => setIsLandlord(true)}
            className={`rounded-md px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              isLandlord ? "bg-indigo-600 text-white font-semibold shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Landlord Agreements
          </button>
          <button
            onClick={() => setIsLandlord(false)}
            className={`rounded-md px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              !isLandlord ? "bg-indigo-600 text-white font-semibold shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Tenant Agreements
          </button>
        </div>

        <button
          onClick={() => loadAgreements(account)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Agreements Listing */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-indigo-400" />
          <p className="text-xs font-mono">Syncing on-chain agreement states...</p>
        </div>
      ) : agreements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 p-12 text-center space-y-4 max-w-md mx-auto">
          <Building className="h-8 w-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 font-mono">No {isLandlord ? "landlord" : "tenant"} agreements found for this address.</p>
          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Create Your First Agreement</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agreements.map((agreement) => (
            <AgreementCard key={agreement.id} agreement={agreement} currentAccount={account} />
          ))}
        </div>
      )}
    </div>
  );
}

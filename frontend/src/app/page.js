"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { connectWallet, switchToLocalhost, getBalance } from "@/lib/web3";
import AgreementCard from "@/components/AgreementCard";
import { useAgreements } from "@/hooks/useContract";
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
      <div className="py-12 space-y-20">
        {/* Protocol Hero */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-8 sm:p-14 text-center legal-grid shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-mono font-medium text-indigo-400 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>ETHEREUM SMART CONTRACT ESCROW PROTOCOL</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Trustless Digital Leases with{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                On-Chain Escrow
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              LEASIR replaces paper rental agreements with deterministic Solidity smart contracts.
              Automate rent payments directly to landlords, safeguard security deposits in trustless escrow,
              and resolve tenancy disputes with mathematical transparency.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={connect}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/25 hover:from-indigo-600 hover:to-blue-700 transition-all active:scale-[0.98]"
              >
                <Wallet className="h-5 w-5" />
                <span>Connect MetaMask</span>
              </button>
              <Link
                href="/agreements"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-4 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                <span>Browse Registry</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Protocol Capabilities Bento */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="glow-card rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Deposit Escrow Lock</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tenant deposits are held safely in the verified smart contract balance, preventing unilateral withholding by unscrupulous landlords.
            </p>
          </div>

          <div className="glow-card rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Coins className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Direct Rent Routing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Rent transfers trigger on-chain state updates and forward exact wei directly to the landlord wallet with verifiable timestamped receipts.
            </p>
          </div>

          <div className="glow-card rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Dispute Arbitration</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
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
              className="inline-flex items-center gap-1 font-mono text-indigo-400 hover:underline ml-1"
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
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Draft Lease</span>
          </Link>
        </div>
      </div>

      {/* 4 Financial & Lease Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glow-card rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Total Leases</span>
            <FileText className="h-4 w-4 text-slate-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{agreements.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">In your wallet registry</span>
        </div>

        <div className="glow-card rounded-2xl p-5 border-emerald-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Active Leases</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{activeCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Executing rent cycles</span>
        </div>

        <div className="glow-card rounded-2xl p-5 border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Awaiting Acceptance</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-400">{pendingCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Pending signature</span>
        </div>

        <div className="glow-card rounded-2xl p-5 border-indigo-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Escrow Value</span>
            <Coins className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-indigo-300">
            {totalEscrowEth} <span className="text-xs font-mono text-indigo-400 font-normal">ETH</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Locked security deposits</span>
        </div>
      </div>

      {/* Role View Toggle Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 p-1">
          <button
            onClick={() => setIsLandlord(true)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
              isLandlord
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="h-4 w-4" />
            <span>Landlord Portfolio</span>
          </button>
          <button
            onClick={() => setIsLandlord(false)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
              !isLandlord
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Tenant Leases</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 text-xs text-slate-400">
          <button
            onClick={() => loadAgreements(account)}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-indigo-400" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Agreements Feed */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <div className="h-8 w-8 mx-auto border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono">Querying EVM contract state...</p>
        </div>
      ) : agreements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center space-y-4 bg-slate-900/30">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Rental Agreements Recorded</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
              {isLandlord
                ? "You haven't initiated any rental agreements as a landlord yet. Draft a new lease with automated rent terms."
                : "You don't have any rental agreements assigned to your tenant address on this network."}
            </p>
          </div>
          {isLandlord && (
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Draft First Legal Lease</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {agreements.map((a) => (
            <AgreementCard key={a.id} agreement={a} />
          ))}
        </div>
      )}
    </div>
  );
}


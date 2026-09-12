"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  connectWallet,
  switchToLocalhost,
  getBalance,
  getContractBalance,
} from "@/lib/web3";
import AgreementCard from "@/components/AgreementCard";
import { useAgreements } from "@/hooks/useContract";
import Reveal from "@/components/Reveal";
import {
  PlusCircle,
  Wallet,
  Check,
  Copy,
  RefreshCw,
  ArrowRight,
  FileSignature,
  FileWarning,
} from "lucide-react";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const CAPABILITIES = [
  {
    n: "01",
    title: "Rent terms on-chain",
    body: "Monthly rent, period, and grace period are recorded in the agreement and verified by the contract at execution.",
  },
  {
    n: "02",
    title: "Recorded deposit terms",
    body: "Security deposit is a recorded term of the agreement. Release follows the contract lifecycle: refund after termination, or dispute resolution.",
  },
  {
    n: "03",
    title: "Contract-governed disputes",
    body: "Either party can move an agreement into a disputed state; subsequent state transitions are controlled by the contract.",
  },
];

export default function Dashboard() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [contractBalance, setContractBalance] = useState(null);
  const [isLandlord, setIsLandlord] = useState(true);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const { agreements, loading, fetchByLandlord, fetchByTenant } = useAgreements();

  const refreshBalances = useCallback(async (addr) => {
    if (addr) {
      const bal = await getBalance(addr);
      setBalance(bal);
    }
    if (CONTRACT_ADDRESS) {
      const bal = await getContractBalance(CONTRACT_ADDRESS);
      setContractBalance(bal);
    }
  }, []);

  const loadAgreements = useCallback(
    async (addr, landlordMode) => {
      if (!addr) return;
      if (landlordMode) {
        await fetchByLandlord(addr);
      } else {
        await fetchByTenant(addr);
      }
    },
    [fetchByLandlord, fetchByTenant]
  );

  useEffect(() => {
    const handler = (accounts) => {
      setAccount(accounts[0] || null);
    };
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handler);
      return () => window.ethereum.removeListener("accountsChanged", handler);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (account) {
      loadAgreements(account, isLandlord);
    }
  }, [account, isLandlord, loadAgreements]);

  const connect = async () => {
    try {
      const { address } = await connectWallet();
      await switchToLocalhost();
      setAccount(address);
      await refreshBalances(address);
      await loadAgreements(address, isLandlord);
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

  if (!account) {
    return (
      <div className="space-y-20">
        <section className="grid items-center gap-14 pt-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div
              className="animate-reveal-up meta-label flex items-center gap-3 text-indigo-600 dark:text-indigo-400"
              style={{ animationDelay: "0ms" }}
            >
              <span className="h-px w-8 bg-current" />
              On-chain rental &amp; escrow
            </div>

            <h1
              className="animate-reveal-up font-display mt-4 text-4xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl dark:text-white"
              style={{ animationDelay: "90ms" }}
            >
              Rental agreements,
              <br />
              built for on-chain execution.
            </h1>

            <p
              className="animate-reveal-up mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg dark:text-slate-400"
              style={{ animationDelay: "180ms" }}
            >
              LEASIR encodes landlord&ndash;tenant lease terms as Solidity smart
              contracts. Rent obligations, security deposit terms, and dispute
              states are recorded and executed on the connected network.
            </p>

            <div
              className="animate-reveal-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "270ms" }}
            >
              <button
                onClick={connect}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-on-accent shadow-sm transition-all hover:bg-indigo-500 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </button>
              <a
                href="#enforcements"
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-300 px-6 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
              >
                How the contract works
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div
              className="animate-reveal-up mt-10 max-w-xl border-t border-slate-200 pt-6 dark:border-slate-800"
              style={{ animationDelay: "360ms" }}
            >
              <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
                <div>
                  <dt className="meta-label text-slate-500 dark:text-slate-400">
                    Rent
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Executed on-chain
                  </dd>
                </div>
                <div>
                  <dt className="meta-label text-slate-500 dark:text-slate-400">
                    Deposit
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Term recorded
                  </dd>
                </div>
                <div>
                  <dt className="meta-label text-slate-500 dark:text-slate-400">
                    Disputes
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Contract state
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="animate-reveal-up rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex items-center justify-between px-5 pt-5">
                <span className="meta-label text-slate-500 dark:text-slate-400">
                  Lease Agreement
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Network &middot; Hardhat local
                </span>
              </div>

              <div className="flex flex-col items-center px-6 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-500">
                  <FileSignature className="h-5 w-5" />
                </div>
                <p className="meta-label mt-5 text-slate-500 dark:text-slate-400">
                  No active agreement
                </p>
                <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Connect your wallet to access your on-chain lease registry.
                </p>
              </div>

              <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Awaiting connection
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Reveal>
          <section id="enforcements" className="scroll-mt-24 border-t border-slate-200 pt-12 dark:border-slate-800">
            <div className="max-w-xl">
              <p className="meta-label text-indigo-600 dark:text-indigo-400">
                Protocol capabilities
              </p>
              <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                What the contract enforces
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                The deployed RentalAgreement contract governs lifecycle
                transitions. All values below are read directly from the chain.
              </p>
            </div>

            <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-3 dark:border-slate-800 dark:bg-slate-800">
              {CAPABILITIES.map((cap) => (
                <div
                  key={cap.n}
                  className="bg-white p-6 dark:bg-slate-900/60"
                >
                  <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400">
                    {cap.n}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {cap.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    );
  }

  const activeCount = agreements.filter((a) => a.state === "Active").length;
  const pendingCount = agreements.filter((a) => a.state === "Pending").length;
  const terminatedCount = agreements.filter((a) => a.state === "Terminated").length;
  const disputedCount = agreements.filter((a) => a.state === "Disputed").length;

  const recordedEscrow = agreements
    .reduce((sum, a) => sum + (parseFloat(a.securityDeposit) || 0), 0)
    .toFixed(3);

  const contractBalanceLabel =
    contractBalance !== null ? `${parseFloat(contractBalance).toFixed(4)} ETH` : "—";

  const stats = [
    { label: "Agreements", value: agreements.length, tone: "text-slate-900 dark:text-white" },
    { label: "Active", value: activeCount, tone: "text-emerald-600 dark:text-emerald-400" },
    { label: "Pending", value: pendingCount, tone: "text-amber-600 dark:text-amber-400" },
    { label: "Terminated", value: terminatedCount, tone: "text-slate-500 dark:text-slate-400" },
    { label: "In dispute", value: disputedCount, tone: "text-rose-600 dark:text-rose-400" },
    { label: "Recorded escrow", value: `${recordedEscrow} ETH`, tone: "text-slate-900 dark:text-white" },
    { label: "Contract balance", value: contractBalanceLabel, tone: "text-indigo-600 dark:text-indigo-400" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Lease Command Center
            </h1>
            <span className="rounded border border-slate-200 px-2 py-0.5 font-mono text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {isLandlord ? "Landlord view" : "Tenant view"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400">
            <span>{account}</span>
            <button
              onClick={copyAccount}
              className="inline-flex items-center gap-1 text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
              title="Copy address"
            >
              {copiedAccount ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="border-r border-slate-200 pr-4 text-right dark:border-slate-800">
            <span className="meta-label block text-slate-500 dark:text-slate-400">
              Wallet balance
            </span>
            <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
              {parseFloat(balance).toFixed(4)} ETH
            </span>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-on-accent transition-all hover:bg-indigo-500 active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Lease
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 text-left sm:grid-cols-3 lg:grid-cols-7 dark:border-slate-800 dark:bg-slate-800">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-4 dark:bg-slate-900/60">
            <span className="meta-label block text-slate-500 dark:text-slate-400">
              {s.label}
            </span>
            <span className={`mt-1.5 block font-mono text-lg font-bold ${s.tone}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="inline-flex rounded-md border border-slate-200 p-0.5 dark:border-slate-800">
          <button
            onClick={() => setIsLandlord(true)}
            className={`rounded px-4 py-1.5 text-xs font-medium transition-colors ${
              isLandlord
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
          >
            Landlord Agreements
          </button>
          <button
            onClick={() => setIsLandlord(false)}
            className={`rounded px-4 py-1.5 text-xs font-medium transition-colors ${
              !isLandlord
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
          >
            Tenant Agreements
          </button>
        </div>

        <button
          onClick={() => {
            refreshBalances(account);
            loadAgreements(account, isLandlord);
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="mx-auto h-5 w-5 animate-spin text-indigo-500" />
          <p className="mt-3 text-xs font-mono text-slate-500 dark:text-slate-400">
            Syncing on-chain agreement states&hellip;
          </p>
        </div>
      ) : agreements.length === 0 ? (
        <div className="mx-auto max-w-md rounded-xl border border-dashed border-slate-300 px-8 py-14 text-center dark:border-slate-700">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-500">
            <FileWarning className="h-5 w-5" />
          </div>
          <p className="meta-label mt-5 text-slate-500 dark:text-slate-400">
            No agreements yet
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            No {isLandlord ? "landlord" : "tenant"} agreements are recorded
            on-chain for this address.
          </p>
          <Link
            href="/create"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-on-accent transition-all hover:bg-indigo-500 active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4" />
            Draft Your First Lease
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {agreements.map((agreement) => (
            <AgreementCard key={agreement.id} agreement={agreement} />
          ))}
        </div>
      )}
    </div>
  );
}
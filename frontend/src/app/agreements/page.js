"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { connectWallet, switchToLocalhost } from "@/lib/web3";
import { useAgreements } from "@/hooks/useContract";
import AgreementCard from "@/components/AgreementCard";
import { Search, PlusCircle, Wallet, FileWarning } from "lucide-react";

const STATUSES = ["All", "Pending", "Active", "Terminated", "Disputed", "Completed"];

export default function AgreementsPage() {
  const [account, setAccount] = useState(null);
  const [view, setView] = useState("landlord");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { agreements, loading, fetchByLandlord, fetchByTenant } = useAgreements();

  useEffect(() => {
    const init = async () => {
      try {
        const { address } = await connectWallet();
        await switchToLocalhost();
        setAccount(address);
      } catch (e) {
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!account) return;
    if (view === "landlord") {
      fetchByLandlord(account);
    } else {
      fetchByTenant(account);
    }
  }, [account, view, fetchByLandlord, fetchByTenant]);

  const filteredAgreements = agreements.filter((a) => {
    const matchesStatus = statusFilter === "All" || a.state === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      String(a.id).includes(query) ||
      (a.tenant && a.tenant.toLowerCase().includes(query)) ||
      (a.landlord && a.landlord.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Agreement Registry
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Agreements and their states are read directly from the deployed
            RentalAgreement contract on the connected network.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 self-start rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-on-accent transition-all hover:bg-indigo-500 active:scale-[0.98] sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Draft Lease
        </Link>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex rounded-md border border-slate-200 p-0.5 dark:border-slate-800">
            <button
              onClick={() => setView("landlord")}
              className={`rounded px-4 py-1.5 text-xs font-medium transition-colors ${
                view === "landlord"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              Landlord records
            </button>
            <button
              onClick={() => setView("tenant")}
              className={`rounded px-4 py-1.5 text-xs font-medium transition-colors ${
                view === "tenant"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              Tenant records
            </button>
          </div>

          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or 0x address&hellip;"
              className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-4 font-mono text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="meta-label mr-1 text-slate-400 dark:text-slate-500">
            Status
          </span>
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === status
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {!account && (
        <div className="mx-auto max-w-md rounded-xl border border-dashed border-slate-300 px-8 py-12 text-center dark:border-slate-700">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-500">
            <Wallet className="h-5 w-5" />
          </div>
          <p className="meta-label mt-5 text-slate-500 dark:text-slate-400">
            Wallet connection required
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Connect your wallet to load the agreements associated with your
            address from the contract registry.
          </p>
        </div>
      )}

      {loading && (
        <div className="py-16 text-center">
          <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500 dark:border-slate-700 dark:border-t-indigo-400" />
          <p className="mt-3 text-xs font-mono text-slate-500 dark:text-slate-400">
            Reading ledger state&hellip;
          </p>
        </div>
      )}

      {!loading && account && filteredAgreements.length === 0 && (
        <div className="mx-auto max-w-md rounded-xl border border-dashed border-slate-300 px-8 py-12 text-center dark:border-slate-700">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-500">
            <FileWarning className="h-5 w-5" />
          </div>
          <p className="meta-label mt-5 text-slate-500 dark:text-slate-400">
            {agreements.length === 0
              ? "No agreements recorded"
              : "No agreements match your filter"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {agreements.length === 0
              ? `No on-chain agreements are recorded for this address in the ${view} registry.`
              : "Adjust the status filter or search query to continue."}
          </p>
          {agreements.length === 0 && (
            <Link
              href="/create"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-on-accent transition-all hover:bg-indigo-500 active:scale-[0.98]"
            >
              <PlusCircle className="h-4 w-4" />
              Draft Your First Lease
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAgreements.map((a) => (
          <AgreementCard key={a.id} agreement={a} />
        ))}
      </div>
    </div>
  );
}
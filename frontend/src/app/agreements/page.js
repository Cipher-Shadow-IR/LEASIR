"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { connectWallet, switchToLocalhost } from "@/lib/web3";
import { useAgreements } from "@/hooks/useContract";
import AgreementCard from "@/components/AgreementCard";
import {
  FileText,
  Building,
  UserCheck,
  Search,
  PlusCircle,
  Filter,
  Wallet,
  Shield,
} from "lucide-react";

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
        // not connected
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
  }, [account, view]);

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

  const statuses = ["All", "Pending", "Active", "Terminated", "Disputed", "Completed"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Lease Agreement Registry</h1>
            <span className="rounded bg-indigo-500/10 px-2 py-0.5 font-mono text-xs font-medium text-indigo-400">
              Immutable Records
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Query on-chain smart contract agreements, inspect escrow states, and verify lease signatures.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Draft Lease</span>
        </Link>
      </div>

      {/* Control Bar: View Switcher, Filter Chips, Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Role Filter */}
          <div className="inline-flex p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            <button
              onClick={() => setView("landlord")}
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                view === "landlord"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building className="h-4 w-4" />
              <span>Landlord Records</span>
            </button>
            <button
              onClick={() => setView("tenant")}
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                view === "tenant"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>Tenant Records</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or 0x address..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-4 py-1.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 font-mono outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" />
            Status:
          </span>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                statusFilter === status
                  ? "bg-slate-700 text-white border border-slate-600 shadow-sm"
                  : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {!account && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Wallet Connection Required</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              Connect MetaMask to authenticate with the LEASIR registry and load your associated agreements.
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <div className="h-8 w-8 mx-auto border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono">Fetching ledger data...</p>
        </div>
      )}

      {!loading && account && filteredAgreements.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center space-y-3 bg-slate-900/20">
          <FileText className="h-10 w-10 text-slate-600 mx-auto" />
          <p className="text-base font-medium text-slate-300">No agreements match your filter</p>
          <p className="text-xs text-slate-400">
            Try adjusting your search criteria or switch between Landlord / Tenant viewpoints.
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAgreements.map((a) => (
          <AgreementCard key={a.id} agreement={a} />
        ))}
      </div>
    </div>
  );
}


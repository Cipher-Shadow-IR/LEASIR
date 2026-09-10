"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { connectWallet, getContract, switchToLocalhost, formatEth, parseEth } from "@/lib/web3";
import { AGREEMENT_STATES } from "@/lib/contract";
import {
  Scale,
  Shield,
  Coins,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lock,
  User,
  ExternalLink,
  Copy,
  Check,
  CreditCard,
  FileText,
  AlertCircle,
  Receipt,
  UserCheck,
} from "lucide-react";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function AgreementDetail({ params }) {
  const { id } = use(params);
  const [account, setAccount] = useState(null);
  const [agreement, setAgreement] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [copiedLandlord, setCopiedLandlord] = useState(false);
  const [copiedTenant, setCopiedTenant] = useState(false);

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
    if (!id) return;
    loadAgreement();
  }, [id]);

  const loadAgreement = async () => {
    setLoading(true);
    setError(null);
    try {
      await connectWallet();
      await switchToLocalhost();
      const contract = await getContract(CONTRACT_ADDRESS);
      const a = await contract.getAgreement(id);
      setAgreement({
        id: Number(a.id),
        landlord: a.landlord,
        tenant: a.tenant,
        rentAmount: formatEth(a.rentAmount),
        securityDeposit: formatEth(a.securityDeposit),
        startDate: new Date(Number(a.startDate) * 1000),
        endDate: new Date(Number(a.endDate) * 1000),
        gracePeriod: Number(a.gracePeriod),
        state: AGREEMENT_STATES[a.state],
        stateCode: Number(a.state),
      });

      const paymentIds = await contract.getAgreementPayments(id);
      if (paymentIds.length > 0) {
        const paymentData = await Promise.all(
          paymentIds.map((pid) => contract.getPayment(pid))
        );
        setPayments(
          paymentData.map((p, idx) => ({
            id: Number(paymentIds[idx]),
            amount: formatEth(p.amount),
            paidDate: new Date(Number(p.paidDate) * 1000),
            status: ["Unpaid", "Paid", "Overdue"][Number(p.status)],
            payer: p.payer,
          }))
        );
      } else {
        setPayments([]);
      }
    } catch (err) {
      setError(err.reason || err.message || "Failed to load agreement from blockchain");
    } finally {
      setLoading(false);
    }
  };

  const doAction = async (action) => {
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await connectWallet();
      await switchToLocalhost();
      const contract = await getContract(CONTRACT_ADDRESS);

      let tx;
      switch (action) {
        case "accept":
          tx = await contract.acceptAgreement(id);
          break;
        case "pay":
          tx = await contract.payRent(id, { value: parseEth(agreement.rentAmount) });
          break;
        case "terminate":
          tx = await contract.terminateAgreement(id);
          break;
        case "dispute":
          tx = await contract.raiseDispute(id);
          break;
        case "refund":
          tx = await contract.refundDeposit(id);
          break;
      }

      await tx.wait();
      setSuccessMsg(`Action "${action}" successfully executed on Ethereum blockchain.`);
      await loadAgreement();
    } catch (err) {
      setError(err.reason || err.message || "Transaction failed");
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "landlord") {
      setCopiedLandlord(true);
      setTimeout(() => setCopiedLandlord(false), 2000);
    } else {
      setCopiedTenant(true);
      setTimeout(() => setCopiedTenant(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 space-y-3">
        <div className="h-8 w-8 mx-auto border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono">Loading legal agreement #{id} from blockchain...</p>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-rose-500/10 border border-rose-500/20 p-8 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Agreement #{id} Not Found</h2>
        <p className="text-xs font-mono text-rose-300">{error || "Contract record does not exist on this EVM network."}</p>
        <Link
          href="/agreements"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Registry</span>
        </Link>
      </div>
    );
  }

  const isLandlord = account && agreement.landlord && account.toLowerCase() === agreement.landlord.toLowerCase();
  const isTenant = account && agreement.tenant && account.toLowerCase() === agreement.tenant.toLowerCase();
  const canAct = isLandlord || isTenant;

  const STATE_STYLES = {
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Terminated: "bg-slate-500/10 text-slate-400 border-slate-700/60",
    Disputed: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    Completed: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  };

  const isExpired = new Date() >= agreement.endDate;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/agreements"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Registry</span>
        </Link>
        <span className="font-mono text-xs text-slate-500">Contract: {CONTRACT_ADDRESS?.slice(0, 8)}...</span>
      </div>

      {/* Header Banner */}
      <div className="glow-card rounded-2xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                Smart Lease Agreement
              </span>
              <span className="text-xs font-mono text-slate-500">#{agreement.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Legal Tenancy Covenant
            </h1>
          </div>

          <div className="self-start sm:self-auto">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                STATE_STYLES[agreement.state] || "bg-slate-800 text-slate-300"
              }`}
            >
              {agreement.state === "Active" && <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />}
              {agreement.state === "Pending" && <Clock className="h-3.5 w-3.5" />}
              {agreement.state === "Disputed" && <AlertTriangle className="h-3.5 w-3.5" />}
              <span>{agreement.state}</span>
            </span>
          </div>
        </div>

        {/* User Role Banner */}
        {account && (
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Your Connected Role:</span>
            {isLandlord ? (
              <span className="font-semibold text-indigo-400 font-mono flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5" /> Landlord (Owner / Creator)
              </span>
            ) : isTenant ? (
              <span className="font-semibold text-emerald-400 font-mono flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5" /> Designated Tenant Counterparty
              </span>
            ) : (
              <span className="text-slate-400 font-mono">Public Observer (Read-Only)</span>
            )}
          </div>
        )}
      </div>

      {/* Parties & Signatures Card */}
      <div className="glow-card rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
          <Scale className="h-4 w-4 text-indigo-400" />
          <span>Parties to Covenant</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Landlord Address</span>
              <button
                onClick={() => copyToClipboard(agreement.landlord, "landlord")}
                className="text-[11px] font-mono text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                {copiedLandlord ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedLandlord ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="font-mono text-xs text-slate-200 break-all">{agreement.landlord}</p>
            <span className="text-[10px] text-slate-500 block">Recipient of monthly rent payments</span>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Tenant Address</span>
              <button
                onClick={() => copyToClipboard(agreement.tenant, "tenant")}
                className="text-[11px] font-mono text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                {copiedTenant ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedTenant ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="font-mono text-xs text-slate-200 break-all">{agreement.tenant}</p>
            <span className="text-[10px] text-slate-500 block">Holder of lease occupancy rights</span>
          </div>
        </div>
      </div>

      {/* Financial & Terms Breakdown */}
      <div className="glow-card rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
          <Coins className="h-4 w-4 text-indigo-400" />
          <span>Financial Terms & Duration</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
            <span className="text-[11px] text-slate-400 block font-mono">Monthly Rent</span>
            <span className="text-lg font-bold text-white font-mono">{agreement.rentAmount}</span>
            <span className="text-[10px] text-indigo-400 font-mono block">ETH / month</span>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
            <span className="text-[11px] text-slate-400 block font-mono">Security Escrow</span>
            <span className="text-lg font-bold text-white font-mono">{agreement.securityDeposit}</span>
            <span className="text-[10px] text-indigo-400 font-mono block">ETH Locked</span>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
            <span className="text-[11px] text-slate-400 block font-mono">Grace Period</span>
            <span className="text-lg font-bold text-white font-mono">
              {agreement.gracePeriod / 86400}
            </span>
            <span className="text-[10px] text-slate-400 block">Days after due</span>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
            <span className="text-[11px] text-slate-400 block font-mono">Payments Made</span>
            <span className="text-lg font-bold text-white font-mono">{payments.length}</span>
            <span className="text-[10px] text-slate-400 block">Verified on-chain</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-center justify-between rounded-xl bg-slate-900/50 border border-slate-800 px-4 py-2.5 text-xs">
            <span className="text-slate-400">Effective Start Date:</span>
            <span className="font-mono text-slate-200">
              {agreement.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-900/50 border border-slate-800 px-4 py-2.5 text-xs">
            <span className="text-slate-400">Lease Expiration Date:</span>
            <span className="font-mono text-slate-200">
              {agreement.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Smart Contract Actions */}
      {canAct && (
        <div className="glow-card rounded-2xl p-6 space-y-4 border-indigo-500/30">
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
            <Lock className="h-4 w-4 text-indigo-400" />
            <span>Authorized Party Actions</span>
          </h2>

          <div className="flex flex-wrap gap-3">
            {/* Tenant: Accept */}
            {agreement.state === "Pending" && isTenant && (
              <button
                onClick={() => doAction("accept")}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-50 transition-all"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{actionLoading ? "Signing on EVM..." : "Accept & Activate Lease"}</span>
              </button>
            )}

            {/* Tenant: Pay Rent */}
            {agreement.state === "Active" && isTenant && (
              <button
                onClick={() => doAction("pay")}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-blue-700 disabled:opacity-50 transition-all"
              >
                <CreditCard className="h-4 w-4" />
                <span>{actionLoading ? "Processing Payment..." : `Pay Rent (${agreement.rentAmount} ETH)`}</span>
              </button>
            )}

            {/* Landlord: Terminate */}
            {agreement.state === "Active" && isLandlord && (
              <button
                onClick={() => doAction("terminate")}
                disabled={actionLoading || !isExpired}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                  isExpired
                    ? "bg-slate-700 text-white hover:bg-slate-600 shadow-md"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
                title={!isExpired ? "Can only terminate after end date has passed" : ""}
              >
                <span>{actionLoading ? "Terminating..." : "Terminate Lease (Post-Term)"}</span>
              </button>
            )}

            {/* Landlord: Refund Security Deposit */}
            {agreement.state === "Terminated" && isLandlord && (
              <button
                onClick={() => doAction("refund")}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 shadow-md transition-all"
              >
                <span>{actionLoading ? "Refunding..." : "Refund Deposit to Tenant"}</span>
              </button>
            )}

            {/* Dispute: Either Party */}
            {(agreement.state === "Active" || agreement.state === "Terminated") && canAct && (
              <button
                onClick={() => doAction("dispute")}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 py-2.5 text-sm font-medium text-rose-300 hover:bg-rose-500/20 transition-all"
              >
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                <span>{actionLoading ? "Submitting Dispute..." : "Raise Dispute to Contract"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Feedback Banners */}
      {successMsg && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs font-mono text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs font-mono text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="break-all">{error}</span>
        </div>
      )}

      {/* On-Chain Payment Ledger Table */}
      <div className="glow-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
            <Receipt className="h-4 w-4 text-indigo-400" />
            <span>On-Chain Payments Audit Ledger</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">{payments.length} Transaction(s)</span>
        </div>

        {payments.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-500 space-y-1">
            <p>No rent payments recorded on-chain yet.</p>
            <p>Once the tenant executes payment, cryptographic transaction records will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Tx ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Payer Address</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/50">
                {payments.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400">#{p.id}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-100">{p.amount} ETH</td>
                    <td className="px-4 py-3 text-slate-300">
                      {p.paidDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">
                      {p.payer ? `${p.payer.slice(0, 6)}...${p.payer.slice(-4)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{p.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


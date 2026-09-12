"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { connectWallet, getContract, switchToLocalhost, formatEth, parseEth, getContractBalance } from "@/lib/web3";
import { AGREEMENT_STATES } from "@/lib/contract";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  FileWarning,
  Wallet,
} from "lucide-react";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const STATE_TONE = {
  Pending: "text-amber-600 dark:text-amber-400",
  Active: "text-emerald-600 dark:text-emerald-400",
  Terminated: "text-slate-500 dark:text-slate-400",
  Disputed: "text-rose-600 dark:text-rose-400",
  Completed: "text-indigo-600 dark:text-indigo-400",
};

const stateDot = (state) => {
  switch (state) {
    case "Active":
      return "bg-emerald-500";
    case "Pending":
      return "bg-amber-500";
    case "Disputed":
      return "bg-rose-500";
    case "Terminated":
      return "bg-slate-500";
    default:
      return "bg-indigo-500";
  }
};

function TransactionStatus({ phase, hash, error, hint }) {
  if (phase === "idle") return null;

  const steps = [
    { key: "waiting", label: "Wallet confirmation" },
    { key: "pending", label: "Transaction pending" },
    { key: "confirmed", label: "Confirmed" },
  ];

  const currentIndex = phase === "confirmed" ? 2 : phase === "failed" ? 0 : phase === "pending" ? 1 : 0;

  return (
    <div className="mt-6 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
      {phase === "failed" ? (
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
          <div className="min-w-0 space-y-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Transaction failed
            </p>
            <p className="break-words font-mono text-xs text-rose-600 dark:text-rose-400">
              {error}
            </p>
            {hint && (
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{hint}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {phase !== "confirmed" ? (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            )}
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {phase === "confirmed"
                ? "Transaction confirmed"
                : phase === "pending"
                  ? "Transaction pending"
                  : "Waiting for wallet confirmation"}
            </p>
          </div>

          <ol className="flex items-center gap-0">
            {steps.map((step, i) => (
              <li key={step.key} className={`flex items-center ${i > 0 ? "flex-1" : ""}`}>
                {i > 0 && (
                  <span
                    className={`mx-2 h-px w-full ${
                      i <= currentIndex ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  />
                )}
                <span
                  className={`whitespace-nowrap text-[11px] font-medium ${
                    i <= currentIndex
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-400"
                  }`}
                >
                  {i + 1}. {step.label}
                </span>
              </li>
            ))}
          </ol>

          {hash && (
            <p className="break-all font-mono text-[11px] text-slate-500 dark:text-slate-400">
              Tx: {hash}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AgreementDetail() {
  const routeParams = useParams();
  const id = routeParams?.id;
  const [account, setAccount] = useState(null);
  const [agreement, setAgreement] = useState(null);
  const [payments, setPayments] = useState([]);
  const [contractBalance, setContractBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tx, setTx] = useState({ phase: "idle", hash: null, error: null, hint: null });
  const [copiedLandlord, setCopiedLandlord] = useState(false);
  const [copiedTenant, setCopiedTenant] = useState(false);

  const loadAgreement = useCallback(async () => {
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

      if (CONTRACT_ADDRESS) {
        const bal = await getContractBalance(CONTRACT_ADDRESS);
        setContractBalance(bal);
      }
    } catch (err) {
      setError(err.reason || err.message || "Failed to load agreement from blockchain");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    loadAgreement();
  }, [id, loadAgreement]);

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

  const runAction = async (action) => {
    setTx({ phase: "waiting", hash: null, error: null, hint: null });
    try {
      await connectWallet();
      await switchToLocalhost();
      const contract = await getContract(CONTRACT_ADDRESS);

      let promise;
      switch (action) {
        case "accept":
          promise = contract.acceptAgreement(id);
          break;
        case "pay":
          promise = contract.payRent(id, { value: parseEth(agreement.rentAmount) });
          break;
        case "terminate":
          promise = contract.terminateAgreement(id);
          break;
        case "dispute":
          promise = contract.raiseDispute(id);
          break;
        case "refund":
          promise = contract.refundDeposit(id);
          break;
        default:
          throw new Error("Unknown action");
      }

      const txPromise = await promise;
      setTx({ phase: "pending", hash: txPromise.hash, error: null, hint: null });

      const receipt = await txPromise.wait();
      setTx({
        phase: "confirmed",
        hash: receipt.hash,
        error: null,
        hint: null,
      });

      await loadAgreement();

      window.setTimeout(() => {
        setTx((current) => (current.phase === "confirmed" ? { ...current, phase: "idle" } : current));
      }, 6000);
    } catch (err) {
      const reason =
        err?.reason ||
        err?.shortMessage ||
        err?.info?.error?.message ||
        err?.message ||
        "The transaction was not completed.";

      let hint = null;
      if (/only tenant/i.test(reason)) {
        hint =
          "Only the tenant address recorded in the agreement can perform this action. Switch to that account in your wallet and retry.";
      } else if (/only landlord/i.test(reason)) {
        hint =
          "Only the landlord address recorded in the agreement can perform this action. Switch to that account in your wallet and retry.";
      } else if (/invalid state/i.test(reason)) {
        hint =
          "The agreement is not in the state required for this action. Refresh the page to read the latest on-chain state.";
      } else if (/term not ended/i.test(reason)) {
        hint = "Termination is only permitted after the lease end date has passed.";
      } else if (/exact rent required/i.test(reason)) {
        hint = "Send exactly the rent amount defined in the agreement.";
      }

      setTx({ phase: "failed", hash: null, error: reason, hint });
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
      <div className="py-24 text-center">
        <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500 dark:border-slate-700 dark:border-t-indigo-400" />
        <p className="mt-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          Reading agreement #{id} from the contract&hellip;
        </p>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-dashed border-slate-300 px-8 py-16 text-center dark:border-slate-700">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <FileWarning className="h-5 w-5" />
        </div>
        <p className="meta-label mt-5 text-slate-500 dark:text-slate-400">
          Agreement #{id} not found
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {error || "No such record exists on the connected network."}
        </p>
        <Link
          href="/agreements"
          className="mt-6 inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to Registry
        </Link>
      </div>
    );
  }

  const isLandlord = account && agreement.landlord && account.toLowerCase() === agreement.landlord.toLowerCase();
  const isTenant = account && agreement.tenant && account.toLowerCase() === agreement.tenant.toLowerCase();
  const isParty = isLandlord || isTenant;

  const now = Date.now() / 1000;
  const endTs = agreement.endDate.getTime() / 1000;
  const expired = now >= endTs;

  const canAccept = agreement.state === "Pending" && isTenant && now <= endTs;
  const canPayRent = agreement.state === "Active" && isTenant;
  const canTerminate = agreement.state === "Active" && isLandlord && expired;
  const canRefund = agreement.state === "Terminated" && isLandlord && parseFloat(agreement.securityDeposit) > 0;
  const canDispute = (agreement.state === "Active" || agreement.state === "Terminated") && isParty;

  const contractBalanceLabel =
    contractBalance !== null ? `${parseFloat(contractBalance).toFixed(4)} ETH` : "—";

  const addresses = (
    <section className="border-t border-slate-200 pt-8 dark:border-slate-800">
      <h2 className="meta-label text-slate-500 dark:text-slate-400">Parties</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Landlord</p>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Rent recipient
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="break-all font-mono text-xs text-slate-700 dark:text-slate-300">
              {agreement.landlord}
            </span>
            <button
              onClick={() => copyToClipboard(agreement.landlord, "landlord")}
              className="shrink-0 text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
              title="Copy address"
            >
              {copiedLandlord ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Tenant</p>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Lease holder
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="break-all font-mono text-xs text-slate-700 dark:text-slate-300">
              {agreement.tenant}
            </span>
            <button
              onClick={() => copyToClipboard(agreement.tenant, "tenant")}
              className="shrink-0 text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
              title="Copy address"
            >
              {copiedTenant ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {account && (
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          Connected role:{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {isLandlord ? "Landlord" : isTenant ? "Tenant" : "Observer (read-only)"}
          </span>
        </p>
      )}
    </section>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="flex items-center justify-between">
        <Link
          href="/agreements"
          className="link-underline inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Registry
        </Link>
        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
          Contract {CONTRACT_ADDRESS?.slice(0, 8)}&hellip;{CONTRACT_ADDRESS?.slice(-6)}
        </span>
      </div>

      <header className="border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="meta-label text-indigo-600 dark:text-indigo-400">
              Smart lease agreement #{agreement.id}
            </p>
            <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Legal Tenancy Covenant
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`inline-flex items-center gap-2 text-sm font-semibold ${STATE_TONE[agreement.state] || "text-slate-500"}`}
            >
              <span className={`h-2 w-2 rounded-full ${stateDot(agreement.state)}`} />
              {agreement.state}
            </span>
          </div>
        </div>
      </header>

      {addresses}

      <section className="border-t border-slate-200 pt-8 dark:border-slate-800">
        <h2 className="meta-label text-slate-500 dark:text-slate-400">Financial terms</h2>
        <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="meta-label text-slate-400 dark:text-slate-500">Monthly rent</p>
            <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-slate-100">
              {agreement.rentAmount} <span className="text-xs font-medium text-slate-400">ETH</span>
            </p>
          </div>
          <div>
            <p className="meta-label text-slate-400 dark:text-slate-500">Deposit (recorded)</p>
            <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-slate-100">
              {agreement.securityDeposit} <span className="text-xs font-medium text-slate-400">ETH</span>
            </p>
          </div>
          <div>
            <p className="meta-label text-slate-400 dark:text-slate-500">Grace period</p>
            <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-slate-100">
              {agreement.gracePeriod / 86400} <span className="text-xs font-medium text-slate-400">days</span>
            </p>
          </div>
          <div>
            <p className="meta-label text-slate-400 dark:text-slate-500">Payments made</p>
            <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-slate-100">
              {payments.length}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8 dark:border-slate-800">
        <h2 className="meta-label text-slate-500 dark:text-slate-400">Timeline</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="meta-label text-slate-400 dark:text-slate-500">Effective start</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {agreement.startDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="meta-label text-slate-400 dark:text-slate-500">Expiration</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {agreement.endDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8 dark:border-slate-800">
        <h2 className="meta-label text-slate-500 dark:text-slate-400">Escrow</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="meta-label text-slate-400 dark:text-slate-500">Contract balance (live)</p>
            <p className="mt-1 font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {contractBalanceLabel}
            </p>
          </div>
          <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            <p>
              The security deposit is a recorded term of the agreement. Release
              follows the contract lifecycle: refund after termination, or
              distribution via dispute resolution.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="meta-label text-slate-500 dark:text-slate-400">
            Payment history
          </h2>
          <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
            {payments.length} recorded
          </span>
        </div>

        {payments.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            No rent payments have been executed against this agreement.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
                <tr className="text-slate-500 dark:text-slate-400">
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Payer</th>
                  <th className="px-4 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-mono text-slate-500 dark:text-slate-400">#{p.id}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {p.amount} ETH
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {p.paidDate.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                      {p.payer ? `${p.payer.slice(0, 6)}&hellip;${p.payer.slice(-4)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isParty && (
        <section className="border-t border-slate-200 pt-8 dark:border-slate-800">
          <h2 className="meta-label text-slate-500 dark:text-slate-400">
            Contract actions
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {canAccept && (
              <button
                onClick={() => runAction("accept")}
                disabled={tx.phase === "waiting" || tx.phase === "pending"}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-on-accent transition-all hover:bg-emerald-500 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                Accept &amp; Activate Lease
              </button>
            )}

            {canPayRent && (
              <button
                onClick={() => runAction("pay")}
                disabled={tx.phase === "waiting" || tx.phase === "pending"}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-on-accent transition-all hover:bg-indigo-500 disabled:opacity-50"
                title={`Pay ${agreement.rentAmount} ETH to the landlord`}
              >
                <Wallet className="h-4 w-4" />
                Pay Rent ({agreement.rentAmount} ETH)
              </button>
            )}

            {canTerminate && (
              <button
                onClick={() => runAction("terminate")}
                disabled={tx.phase === "waiting" || tx.phase === "pending"}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
              >
                Terminate Lease
              </button>
            )}

            {canRefund && (
              <button
                onClick={() => runAction("refund")}
                disabled={tx.phase === "waiting" || tx.phase === "pending"}
                className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-on-accent transition-all hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                Refund Deposit
              </button>
            )}

            {canDispute && (
              <button
                onClick={() => runAction("dispute")}
                disabled={tx.phase === "waiting" || tx.phase === "pending"}
                className="inline-flex items-center gap-2 rounded-md border border-rose-300 px-5 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/40 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                <AlertTriangle className="h-4 w-4" />
                Raise Dispute
              </button>
            )}

            {!canAccept && !canPayRent && !canTerminate && !canRefund && !canDispute && (
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                No contract actions are available for the current state and
                connected role.
              </p>
            )}
          </div>

          <TransactionStatus
            phase={tx.phase}
            hash={tx.hash}
            error={tx.error}
            hint={tx.hint}
          />
        </section>
      )}

      <p className="border-t border-slate-200 pt-6 text-[11px] leading-relaxed text-slate-400 dark:border-slate-800 dark:text-slate-500">
        Actions are executed against the deployed RentalAgreement contract on
        the connected network. Read values above are fetched directly from
        chain state.
      </p>
    </div>
  );
}
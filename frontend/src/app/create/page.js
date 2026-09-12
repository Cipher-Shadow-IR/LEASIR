"use client";

import { useState } from "react";
import Link from "next/link";
import { connectWallet, getContract, parseEth, switchToLocalhost, sanitizeAddress } from "@/lib/web3";
import {
  FileSignature,
  Shield,
  Coins,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lock,
  User,
  ExternalLink,
  Sparkles,
} from "lucide-react";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const GRACE_PERIOD_DEFAULT = 7;
const DAY_SECONDS = 86400;

export default function CreateAgreement() {
  const [form, setForm] = useState({
    tenantAddress: "",
    rentAmount: "0.5",
    securityDeposit: "1.0",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000 * 365).toISOString().split("T")[0],
    gracePeriod: GRACE_PERIOD_DEFAULT,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const setTestTenant = () => {
    setForm({
      ...form,
      tenantAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      await connectWallet();
      await switchToLocalhost();

      const validTenant = sanitizeAddress(form.tenantAddress);
      const contract = await getContract(CONTRACT_ADDRESS);

      const rentWei = parseEth(form.rentAmount);
      const depositWei = parseEth(form.securityDeposit);
      const startUnix = Math.floor(new Date(form.startDate).getTime() / 1000);
      const endUnix = Math.floor(new Date(form.endDate).getTime() / 1000);
      const graceSeconds = Number(form.gracePeriod) * DAY_SECONDS;

      const tx = await contract.createAgreement(
        validTenant,
        rentWei,
        depositWei,
        startUnix,
        endUnix,
        graceSeconds
      );
      const receipt = await tx.wait();

      const event = receipt.logs.find(
        (log) => log.fragment?.name === "AgreementCreated"
      );
      const agreementId = event ? Number(event.args[0]) : "0";

      setResult({
        txHash: receipt.hash,
        agreementId,
      });
    } catch (err) {
      if (err.code === "UNSUPPORTED_OPERATION" || err.message?.includes("ENS") || err.message?.includes("getEnsAddress")) {
        setError("Invalid tenant address. Please enter a valid 0x Ethereum checksummed address.");
      } else {
        setError(err.reason || err.message || "Transaction failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const startD = new Date(form.startDate);
  const endD = new Date(form.endDate);
  const durationDays = !isNaN(startD) && !isNaN(endD) && endD > startD
    ? Math.round((endD - startD) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1 text-xs font-mono font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <FileSignature className="h-3.5 w-3.5" />
          <span>LEASE DRAFTING</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Draft On-Chain Rental Agreement
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Create an on-chain rental agreement and deploy it with your wallet.
          The tenant address you provide will then be able to accept and
          activate the lease.
        </p>
      </div>

      {!CONTRACT_ADDRESS && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-300 flex items-center gap-2 font-mono">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Warning: NEXT_PUBLIC_CONTRACT_ADDRESS is not set. Ensure the RentalAgreement contract is deployed to Sepolia.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glow-card rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white">1. Tenant Counterparty</h2>
            </div>
            <button
              type="button"
              onClick={setTestTenant}
              className="text-xs font-mono text-indigo-600 hover:text-indigo-500 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Use local test tenant
            </button>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Tenant Ethereum Address (0x...)
            </label>
            <input
              type="text"
              name="tenantAddress"
              value={form.tenantAddress}
              onChange={handleChange}
              required
              placeholder="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 text-sm font-mono text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Only this address can accept the agreement and pay rent on-chain.
            </span>
          </div>
        </div>

        <div className="glow-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white">2. Financial & Escrow Terms</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Monthly Rent (ETH)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  name="rentAmount"
                  value={form.rentAmount}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 text-sm font-mono text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-indigo-400 font-semibold">
                  ETH
                </span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Forwarded to your wallet when the tenant executes a rent payment.
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Security Deposit (ETH)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  name="securityDeposit"
                  value={form.securityDeposit}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 text-sm font-mono text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-indigo-400 font-semibold">
                  ETH
                </span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Recorded as a lease term. Release follows the contract lifecycle:
                refund after termination, or dispute resolution.
              </span>
            </div>
          </div>
        </div>

        <div className="glow-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white">3. Lease Schedule & Grace Period</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 text-sm font-mono text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 text-sm font-mono text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Grace Period Buffer (Days)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="gracePeriod"
                  value={form.gracePeriod}
                  onChange={handleChange}
                  required
                  min="1"
                  max="30"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 text-sm font-mono text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  days
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3 flex flex-col justify-center">
              <span className="text-[11px] font-mono text-slate-400">Calculated Lease Duration</span>
              <span className="text-base font-bold text-slate-200">
                {durationDays > 0 ? `${durationDays} Days (~${(durationDays / 30).toFixed(1)} Months)` : "Invalid dates"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-bold">
            <Lock className="h-4 w-4" />
            <span>What the deployed contract enforces</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Only the recorded tenant address may accept the agreement and execute rent payments.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Each rent payment is recorded on-chain with amount, timestamp, and payer address.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Raising a dispute moves the agreement to a Disputed state, which suspends standard lifecycle actions.</span>
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading || !CONTRACT_ADDRESS}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-4 text-base font-semibold text-on-accent shadow-sm transition-all hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Deploying Agreement&hellip;</span>
            </>
          ) : (
            <>
              <FileSignature className="h-5 w-5" />
              <span>Deploy Agreement</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
            <AlertCircle className="h-4 w-4" />
            <span>Transaction Failed</span>
          </div>
          <p className="text-xs font-mono text-rose-300 break-all">{error}</p>
        </div>
      )}

      {result && (
        <div className="glow-card rounded-2xl p-6 border-emerald-500/40 bg-emerald-500/[0.04] space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
            <h3 className="text-lg font-bold">Lease Agreement Successfully Deployed!</h3>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-300">
            The agreement now awaits acceptance by the tenant address recorded
            in this lease. The tenant can connect their wallet and activate it
            from the agreement page.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
              <span className="text-slate-400 block mb-1">Contract Lease ID</span>
              <span className="text-sm font-bold text-indigo-400">#{result.agreementId}</span>
            </div>
            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
              <span className="text-slate-400 block mb-1">Deployment Transaction</span>
              <span className="text-xs text-slate-300 break-all">{result.txHash}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href={`/agreements/${result.agreementId}`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 transition-colors"
            >
              <span>View Deployed Agreement</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


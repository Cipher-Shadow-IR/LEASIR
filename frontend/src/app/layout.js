import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Shield, ExternalLink, Scale, CheckCircle2, Lock } from "lucide-react";

export const metadata = {
  title: "LEASIR — Smart Contract Rental Agreements & Escrow Protocol",
  description:
    "Decentralized legal-tech platform for automated rent payments, security deposit escrow, and transparent on-chain dispute resolution on Ethereum.",
  keywords: ["Smart Contract", "Rental Agreement", "Ethereum", "Web3", "Escrow", "Solidity", "Legal Tech", "LEASIR"],
  authors: [{ name: "Ishaan Ray", url: "https://galaxir.vercel.app" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>

        <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20">
                  <Scale className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 tracking-tight">LEASIR</span>
                    <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[10px] font-mono text-indigo-400 uppercase font-semibold">
                      v2.1 EVM
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Autonomous Legal Lease & Escrow Protocol</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <Link href="/" className="hover:text-slate-200 transition-colors">Dashboard</Link>
                <Link href="/agreements" className="hover:text-slate-200 transition-colors">Registry</Link>
                <Link href="/create" className="hover:text-slate-200 transition-colors">New Lease</Link>
                <a
                  href="https://galaxir.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Portfolio
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://github.com/Cipher-Shadow-IR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>
                Architected & Engineered by{" "}
                <a
                  href="https://galaxir.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-slate-300 hover:text-white transition-colors underline decoration-slate-700 underline-offset-4"
                >
                  Ishaan Ray
                </a>{" "}
                • Decentralized Legal-Tech
              </p>
              <div className="flex items-center gap-4 font-mono">
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Solidity 0.8.28
                </span>
                <span>•</span>
                <span>Hardhat EVM</span>
                <span>•</span>
                <span>Ethers.js v6</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}


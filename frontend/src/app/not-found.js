import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6">
        <FileQuestion className="h-8 w-8" />
      </div>
      <span className="font-mono text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-2">
        Error 404 • Page Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
        Agreement or Page Not Found
      </h1>
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mb-8">
        The requested smart contract rental page or registry resource does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-on-accent transition-all hover:bg-indigo-500 active:scale-[0.98]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}

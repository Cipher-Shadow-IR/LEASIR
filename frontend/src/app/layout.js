import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import LeasirPreloader from "@/components/LeasirPreloader";

export const metadata = {
  title: "LEASIR — Smart Contract Rental Agreements & Escrow Protocol",
  description:
    "Decentralized legal-tech platform for automated rent payments, security deposit escrow, and transparent on-chain dispute resolution on Ethereum.",
  keywords: [
    "Smart Contract",
    "Rental Agreement",
    "Ethereum",
    "Web3",
    "Escrow",
    "Solidity",
    "Legal Tech",
    "LEASIR",
    "Tenant Landlord Escrow",
    "Arbitration",
  ],
  authors: [{ name: "Ishaan Ray", url: "https://galaxir.vercel.app" }],
  creator: "Ishaan Ray",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://leasir.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://leasir.vercel.app",
    siteName: "LEASIR Protocol",
    title: "LEASIR — Smart Contract Rental Agreements & Escrow Protocol",
    description:
      "Automated monthly rent distribution, security deposit multi-sig escrow, and immutable dispute resolution on Ethereum.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LEASIR — Smart Contract Rental Agreements & Escrow Protocol",
    description:
      "Automated monthly rent distribution, security deposit multi-sig escrow, and immutable dispute resolution on Ethereum.",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "LEASIR Protocol",
    url: "https://leasir.vercel.app",
    description:
      "Decentralized legal-tech platform for automated rent payments, security deposit escrow, and transparent on-chain dispute resolution on Ethereum.",
    founder: {
      "@type": "Person",
      name: "Ishaan Ray",
      url: "https://galaxir.vercel.app",
    },
  };

  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/LEASIR_LOGO.png" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased flex flex-col selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-600/40 dark:selection:text-blue-100 overflow-x-hidden transition-colors duration-200">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LeasirPreloader />
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}

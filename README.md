<p align="center">
  <img src="frontend/public/LEASIR_LOGO.png" alt="LEASIR Logo" width="160" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/LEASIR-Smart%20Lease%20%26%20Escrow-4f46e5?style=for-the-badge&logo=ethereum" alt="LEASIR Banner" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Plus+Jakarta+Sans&size=32&duration=4000&color=4F46E5&center=true&vCenter=true&width=1000&height=70&lines=LEASIR+%7C+Smart+Contract+Rental+Agreements;Security+Deposit+Escrow+%7C+Automated+Rent+Streams" alt="Typing SVG" />
</p>

<h2 align="center">⚖️ Decentralized Smart Contract Rental Agreements & Escrow Protocol.</h2>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Version-2.1.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Solidity-0.8.28-purple?style=for-the-badge&logo=solidity" />
  <img src="https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Tests-7%2F7%20Passing-emerald?style=for-the-badge" />
</p>

---
> *"Autonomous Legal Lease & Escrow Protocol."*  
> **LEASIR** replaces traditional paper rental agreements with deterministic Ethereum smart contracts.  
> Built with **Solidity 0.8.28**, **Next.js 15.5 (App Router)**, **Ethers.js v6**, and **Tailwind CSS** for trustless security deposit escrow, direct rent payments, and transparent dispute resolution.

---

# ✨ Features

- 🔒 **Security Deposit Escrow Lock** — Holds tenant deposits securely in the smart contract balance, eliminating unilateral withholding by landlords.
- ⚡ **Automated Monthly Rent Streams** — Direct wei routing from tenant to landlord with cryptographic on-chain receipts.
- ⚖️ **Dispute Arbitration Engine** — Mutual attestation protocol allowing either party to trigger contract-governed escrow resolution.
- 📊 **Lease Command Center** — Role-based toggle switching between Landlord Mode and Tenant Mode with live balance & telemetry badging.
- 📑 **Digital Lease Drafter** — Intuitive form interface to deploy customized smart contract leases with custom duration, rent, and deposit rules.
- 🌙 **Dual Theme System** — High-contrast Light & Dark themes with clean selection highlights (`selection:bg-blue-200`).
- 🛡️ **7 Hardhat Unit Tests** — Security audited contract logic covering creation, acceptance, rent payment, dispute escalation, and termination.

---

# 💡 Why This Project?

This platform demonstrates:

- **Legal Tech Innovation**: Converting static legal agreements into enforceable, self-executing smart contracts.
- **Modern Next.js 15 Engineering**: Fast server-side rendering, App Router architecture, and clean client-side hooks.
- **Financial Safety**: Zero-custody escrow locks ensuring funds are released strictly under validated contract states.

---

# 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity `0.8.28`, Hardhat, Ethers.js v6 |
| Web Application | Next.js 15.5 (App Router), React 19, Tailwind CSS 3 |
| Icons & UI | Lucide React, Custom Theme Toggle, CountUp |
| Local Testnet | Hardhat Local Node (`localhost:8545`) |

---

# 📂 Project Structure

```plaintext
Smart Contract Rental Agreement/
├── contracts/
│   ├── RentalAgreement.sol     # Core Solidity Smart Contract (0.8.28)
│   ├── hardhat.config.js       # Hardhat network & compiler setup
│   └── test/
│       └── RentalAgreement.test.js  # Hardhat Unit Test Suite (7 Passing)
├── frontend/
│   ├── public/
│   │   └── LEASIR_LOGO.png     # Official LEASIR Brand Asset
│   ├── src/
│   │   ├── app/                # Next.js App Router (page.js, layout.js, not-found.js, agreements/, create/)
│   │   ├── components/         # Navbar, Footer, AgreementCard, ThemeToggle, CountUp, Marquee
│   │   ├── hooks/              # useContract, useWallet custom hooks
│   │   ├── lib/                # Web3 providers & contract connection utilities
│   │   └── globals.css         # Tailwind directives & dual theme overrides
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

# ⚙️ Installation & Run Locally

### Prerequisites
- Node.js 18+
- MetaMask browser extension

### 1. Smart Contract Test & Node Setup

```bash
# Clone repository
git clone https://github.com/Cipher-Shadow-IR/LEASIR-Smart-Contract-Rental-Agreement.git
cd "Smart Contract Rental Agreement/contracts"

# Install dependencies & run tests
npm install
npx hardhat test
```

### 2. Start Local Blockchain

```bash
npx hardhat node
```

### 3. Run Frontend Next.js Application

```bash
cd "../frontend"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

# 📬 Smart Contract API Reference

### Contract Methods

| Function | Access | Parameters | Description |
|----------|--------|------------|-------------|
| `createAgreement` | Landlord | `address payable _tenant, uint256 _rent, uint256 _deposit, uint256 _durationDays` | Drafts a new lease |
| `acceptAgreement` | Tenant | `uint256 _id` | Deposit escrow funding & lease activation |
| `payRent` | Tenant | `uint256 _id` | Transfers monthly rent directly to landlord |
| `raiseDispute` | Landlord/Tenant | `uint256 _id` | Escalates contract to Disputed state |
| `terminateLease` | Landlord/Tenant | `uint256 _id` | Releases security deposit back to tenant upon expiry |

---

# 💬 Author

<p align="center">
  <b>Designed & Developed by Ishaan Ray (Cipher Shadow)</b><br>
  <i>"Autonomous Legal Lease & Escrow Protocol."</i><br><br>
  <a href="https://github.com/Cipher-Shadow-IR" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Cipher%20Shadow-181717?style=for-the-badge&logo=github" />
  </a>
  <a href="https://linkedin.com/in/ishaan-ray-cs" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Ishaan%20Ray-0A66C2?style=for-the-badge&logo=linkedin" />
  </a>
  <a href="https://galaxir.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Portfolio-Galaxir-6366F1?style=for-the-badge" />
  </a>
</p>

---

# 📜 License

MIT License © Ishaan Ray

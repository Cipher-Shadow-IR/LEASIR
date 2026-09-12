<p align="center">
  <img src="frontend/public/LEASIR_LOGO.png" alt="LEASIR Logo" width="160" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/LEASIR-On%20Chain%20Lease%20Registry-4f46e5?style=for-the-badge&logo=ethereum" alt="LEASIR Banner" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Plus+Jakarta+Sans&size=32&duration=4000&color=4F46E5&center=true&vCenter=true&width=1000&height=70&lines=LEASIR+%7C+Smart+Contract+Rental+Agreements;On-Chain+Lease+State+%7C+Payments+%26+Disputes" alt="Typing SVG" />
</p>

<h2 align="center">⚖️ Smart Contract Rental Agreements & Lease Registry.</h2>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Solidity-0.8.28-purple?style=for-the-badge&logo=solidity" />
  <img src="https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Tests-7%2F7%20Passing-emerald?style=for-the-badge" />
</p>

---
> *"Smart contract rental agreements with on-chain agreement state, payment handling, dispute and termination lifecycle."*  
> **LEASIR** keeps rental agreements on Ethereum and lets landlords and tenants interact with them through a web app.  
> Built with **Solidity 0.8.28**, **Next.js 15.5 (App Router)**, **Ethers.js v6**, and **Tailwind CSS**. Rent is paid on-chain directly to the landlord wallet; disagreement (dispute) and lifecycle states are recorded on the deployed contract.

---

# ✨ Features

- 📑 **Digital Lease Drafter** — Form interface to deploy a lease with tenant address, rent, deposit, dates, and grace period.
- 🔒 **Recorded Deposit Terms** — The security deposit is recorded as a lease term. It is not collected during creation or acceptance; funds are transferred only through the contract lifecycle (refund after termination, or distribution after dispute resolution).
- ⚡ **On-Chain Rent Payments** — Tenants execute monthly rent payments directly from their wallet. The contract matches the exact rent amount and forwards it to the landlord account.
- ⚖️ **Dispute State & Resolution** — Either party can raise a dispute, which moves the lease to a Disputed state. A resolution call distributes the recorded deposit to the favored party and completes the lease.
- 📊 **Lease Command Center** — Dashboard with per-account agreement list, live contract balance, and role-based views (Landlord / Tenant).
- 🌙 **Dual Theme System** — High-contrast Light & Dark themes.
- 🛡️ **7 Hardhat Unit Tests** — Covering creation, input validation, acceptance, rent payment, dispute, and termination.

---

# 💡 Why This Project?

This platform demonstrates:

- **Legal Tech Innovation**: Converting static paper rental agreements into executable smart contracts.
- **Modern Next.js 15 Engineering**: App Router architecture, client-side wallet hooks, and clean component boundaries.
- **Deterministic Lifecycle**: Lease state transitions are enforced by the deployed contract rather than a party's individual discretion.

---

# 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity `0.8.28`, Hardhat, Ethers.js v6 |
| Web Application | Next.js 15.5 (App Router), React 19, Tailwind CSS 3 |
| Icons & UI | Lucide React, Custom Theme Toggle |
| Local Testnet | Hardhat Local Node (`localhost:8545`) |

---

# 📂 Project Structure

```plaintext
Smart Contract Rental Agreement/
├── contracts/
│   ├── contracts/RentalAgreement.sol     # Core Solidity Smart Contract (0.8.28)
│   ├── scripts/deploy.js                 # Deployment script (Hardhat)
│   ├── hardhat.config.js                 # Hardhat network & compiler setup
│   └── test/
│       └── RentalAgreement.test.js       # Hardhat Unit Test Suite (7 passing)
├── frontend/
│   ├── public/
│   │   └── LEASIR_LOGO.png               # Official LEASIR Brand Asset
│   ├── src/
│   │   ├── app/                          # Next.js App Router
│   │   │   ├── page.js                   # /          — Dashboard (Lease Command Center)
│   │   │   ├── create/page.js            # /create    — Draft & deploy a lease
│   │   │   ├── agreements/page.js        # /agreements — Lease registry
│   │   │   ├── agreements/[id]/page.js   # /agreements/:id — Lease document & actions
│   │   │   ├── layout.js
│   │   │   └── not-found.js
│   │   ├── components/                   # Navbar, Footer, AgreementCard, ThemeToggle, LeasirPreloader, Reveal, PageTransition
│   │   ├── hooks/                        # useContract (wallet/chain connection hooks)
│   │   ├── lib/                          # web3.js (providers & contract utilities), contract.js (state maps)
│   │   └── globals.css                   # Tailwind directives & dual theme overrides
│   ├── .env                              # NEXT_PUBLIC_RPC_URL, NEXT_PUBLIC_CONTRACT_ADDRESS
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

# ⚙️ Installation & Run Locally

### Prerequisites
- Node.js 18+
- MetaMask browser extension (configured for the Hardhat local network)

### 1. Smart Contract Tests

```bash
# Clone repository
git clone https://github.com/Cipher-Shadow-IR/LEASIR-Smart-Contract-Rental-Agreement.git
cd "Smart Contract Rental Agreement/contracts"

npm install
npx hardhat test
```

### 2. Start the Local Blockchain

```bash
npx hardhat node
```

Keep this terminal running.

### 3. Deploy the Contract

In a second terminal:

```bash
cd "Smart Contract Rental Agreement/contracts"
npm run deploy
```

The script prints `RentalAgreement deployed to: <address>`.

### 4. Configure the Frontend

Create `frontend/.env` with:

```env
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed-contract-address>
```

### 5. Run the Frontend

```bash
cd "../frontend"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Connect MetaMask to the Hardhat local network (Chain ID `31337`) and use one of the private keys printed by `npx hardhat node`.

---

# 📬 Smart Contract API Reference

### Note on the security deposit

The deposit is recorded as a lease term. `createAgreement` and `acceptAgreement` are non-payable and do not hold funds. Deposit transfers happen only through `resolveDispute` (favored party distribution) or `refundDeposit` (full refund to the tenant after termination).

### Contract Methods

| Function | Access | Parameters | Description |
|----------|--------|------------|-------------|
| `createAgreement` | Landlord (any caller) | `address _tenant, uint256 _rentAmount, uint256 _securityDeposit, uint256 _startDate, uint256 _endDate, uint256 _gracePeriod` | Records a new lease in Pending state |
| `acceptAgreement` | Tenant | `uint256 agreementId` | Activates the lease (Pending → Active). Requires `block.timestamp <= endDate` |
| `payRent` | Tenant | `uint256 agreementId` (payable) | Requires `msg.value == rentAmount` and Active state; forwards rent to the landlord and records the payment |
| `raiseDispute` | Landlord / Tenant | `uint256 agreementId` | Moves an Active or Terminated lease to Disputed state |
| `resolveDispute` | Any caller | `uint256 agreementId, bool tenantFavored` | Requires Disputed state; sends the recorded deposit to the favored party and sets the lease to Completed |
| `refundDeposit` | Landlord | `uint256 agreementId` | Requires Terminated state; sends the recorded deposit to the tenant and sets the lease to Completed |
| `terminateAgreement` | Landlord | `uint256 agreementId` | Requires Active state and `block.timestamp >= endDate`; sets the lease to Terminated |

### View Functions

| Function | Returns |
|----------|---------|
| `getAgreement(uint256 agreementId)` | Agreement struct (id, landlord, tenant, rent, deposit, dates, grace period, state) |
| `getPayment(uint256 paymentId)` | Payment struct (agreement id, amount, due/paid date, status, payer) |
| `getAgreementPayments(uint256 agreementId)` | Payment id array for the agreement |
| `getLandlordAgreements(address landlord)` | Agreement id array for a landlord |
| `getTenantAgreements(address tenant)` | Agreement id array for a tenant |
| `agreementExists(uint256 agreementId)` | Boolean |
| `getCurrentTimestamp()` | Current chain timestamp |

---

# 💬 Author

<p align="center">
  <b>Designed & Developed by Ishaan Ray (Cipher Shadow)</b><br>
  <i>"Smart contract rental agreements, built for the blockchain."</i><br><br>
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
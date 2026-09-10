# Smart Contract Rental Agreement

Decentralized rental agreement platform built on Ethereum. Landlords and tenants can create, manage, and complete rental agreements on-chain with automated rent payments, security deposit handling, and dispute resolution.

## Tech Stack

- **Smart Contract**: Solidity `0.8.28` + Hardhat
- **Frontend**: Next.js 15 + React 19 + ethers.js
- **Styling**: Tailwind CSS 4
- **Local Blockchain**: Hardhat Network

## Project Structure

```
contracts/          # Solidity smart contract & Hardhat setup
  contracts/        # Solidity sources
  test/             # Contract tests (Hardhat + Chai)
  scripts/          # Deployment scripts
frontend/           # Next.js dApp frontend
  src/
    app/            # Next.js App Router pages
    components/     # UI components
    hooks/          # React hooks (wallet, contract)
    lib/            # Web3 utilities, ABI
```

## Smart Contract

The `RentalAgreement` contract manages the full lifecycle of rental agreements:

| State | Description |
|-------|-------------|
| Pending | Created by landlord, awaiting tenant acceptance |
| Active | Tenant accepted, rent payments in progress |
| Terminated | Landlord ended the agreement after end date |
| Disputed | Either party raised a dispute |
| Completed | Dispute resolved or deposit refunded |

### Key Functions

| Function | Role | Description |
|----------|------|-------------|
| `createAgreement` | Landlord | Creates a new agreement with rent, deposit, dates |
| `acceptAgreement` | Tenant | Accepts and activates the agreement |
| `payRent` | Tenant | Pay monthly rent (sends ETH to landlord) |
| `terminateAgreement` | Landlord | Terminate after end date passes |
| `raiseDispute` | Either | Raise a dispute on active/terminated agreements |
| `resolveDispute` | (Arbitrator) | Resolve dispute, deposit sent to favored party |
| `refundDeposit` | Landlord | Refund security deposit to tenant |

---

## Getting Started

### Prerequisites

- Node.js 22+
- MetaMask browser extension
- Docker (optional, for containerized setup)

### 1. Environment Setup

```bash
cp .env.example .env
```

### 2. Start Local Blockchain & Deploy

#### Option A: Docker (recommended)

```bash
docker compose up --build
```

This starts:
- Hardhat node at `http://localhost:8545`
- Frontend at `http://localhost:3000`

Deploy the contract:

```bash
docker compose exec hardhat npx hardhat run scripts/deploy.js --network localhost
```

Copy the deployed contract address and set it in `.env` as `NEXT_PUBLIC_CONTRACT_ADDRESS`, then restart the frontend.

#### Option B: Without Docker

**Terminal 1 — Hardhat node:**

```bash
cd contracts
npm install
npx hardhat node
```

**Terminal 2 — Deploy contract:**

```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

Copy the printed contract address.

**Terminal 3 — Frontend:**

```bash
cd frontend
npm install
set NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed-address>
npm run dev
```

Open `http://localhost:3000` in your browser.

### 3. Configure MetaMask

1. Add Hardhat Network:
   - **Network Name**: Hardhat Local
   - **RPC URL**: `http://localhost:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
2. Import a test account (Hardhat provides 20 accounts with 10000 ETH each):
   - Private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` (Account #0)
3. Switch to the Hardhat network.

### 4. Usage

1. Connect MetaMask on the dashboard.
2. As a **landlord**: create a new agreement with tenant address, rent, deposit, and dates.
3. As a **tenant**: switch MetaMask to the tenant account, accept the agreement, and pay rent.
4. After the end date passes, the landlord can terminate and refund the deposit.
5. Either party can raise a dispute if needed.

---

## Running Tests

```bash
cd contracts
npx hardhat test
```

---

## Docker Services

| Service | Port | Description |
|---------|------|-------------|
| hardhat | 8545 | Hardhat local blockchain node |
| frontend | 3000 | Next.js dApp |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RPC_URL` | Blockchain RPC endpoint (default: `http://localhost:8545`) |
| `PRIVATE_KEY` | Deployer wallet private key |
| `NEXT_PUBLIC_RPC_URL` | Frontend RPC URL |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed contract address (set after deployment) |

## License

MIT

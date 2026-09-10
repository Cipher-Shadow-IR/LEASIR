# Execution & Testing Guide — Smart Contract Rental Agreement

Ethereum dApp where landlords create rental agreements and tenants accept/pay rent on-chain.

## Current Status (running)

| Service        | URL                          | Status |
|----------------|------------------------------|--------|
| Local Blockchain | http://localhost:8545 (Chain ID 31337) | ✅ Running |
| dApp Frontend  | http://localhost:3000        | ✅ Running |
| Contract       | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` | ✅ Deployed |

## How it was started (Windows native, no Docker)

1. **Hardhat node** → `contracts/` : `npx hardhat node`
2. **Deploy** → `contracts/` : `npx hardhat run scripts/deploy.js --network localhost`
   - Output: `RentalAgreement deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
3. **Frontend** → `frontend/.env`:
   ```
   NEXT_PUBLIC_RPC_URL=http://localhost:8545
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
   ```
4. **Frontend** → `frontend/` : `npm run dev`

> Root `.env` also holds the same address. If you redeploy, update both `.env` files with the new address and restart the frontend.

## MetaMask Setup

1. Add network:
   - **Network Name**: Hardhat Local
   - **RPC URL**: `http://localhost:8545`
   - **Chain ID**: `31337`
   - **Currency**: ETH
2. Import **two test accounts** (each has 10,000 ETH):

| Role     | Account # | Address                                      | Private Key |
|----------|-----------|----------------------------------------------|-------------|
| Landlord | #0        | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| Tenant   | #1        | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |

3. Switch active account to **Landlord (#0)** to start, then switch to **Tenant (#1)** when accepting.

## Test Roadmap (happy path)

> Amounts are in **ETH**; dates should be reasonable relative to today.

1. **Connect** — Open `http://localhost:3000`, click **Connect MetaMask** (Landlord #0 active). Confirm wallet + network switch popup.
2. **Create agreement (Landlord)** — Via `/create`: tenant = Tenant address (#1), rent `0.1`, deposit `0.5`, start = today, end = ~tomorrow/next month, grace period `0`.
3. **Switch to Tenant (#1)** in MetaMask. Dashboard should show the Pending agreement under **As Tenant**.
4. **Accept agreement (Tenant)** — click **Accept**. State → **Active**.
5. **Pay rent (Tenant)** — click **Pay Rent**, confirm `0.1 ETH`. Verify landlord balance increases.
6. **Switch back to Landlord (#0)**. After the end date passes, click **Terminate** → state **Terminated**, then **Refund Deposit** → state **Completed**, tenant gets `0.5 ETH` back.

## Dispute flow (optional)

1. With an **Active** agreement, either party clicks **Raise Dispute** → state **Disputed**.
2. Call `resolveDispute(id, tenantFavored)` (only the contract deployer/arbitrator). If `true` tenant gets deposit; else landlord keeps it → state **Completed**.

## Contract states

`Pending → Active → Terminated → Disputed → Completed`

| State | Meaning |
|-------|---------|
| Pending | Created by landlord, awaiting tenant |
| Active | Tenant accepted, rents in progress |
| Terminated | Landlord ended after end date |
| Disputed | Either party raised dispute |
| Completed | Dispute resolved / deposit refunded |

## Re-running tests

```bash
cd contracts
npx hardhat test          # run contract unit tests (Hardhat + Chai)
```

## Restarting everything

```bash
# 1) blockchain
cd contracts && npx hardhat node
# 2) deploy (copy new address into frontend/.env if different)
cd contracts && npx hardhat run scripts/deploy.js --network localhost
# 3) frontend
cd frontend && npm run dev
```

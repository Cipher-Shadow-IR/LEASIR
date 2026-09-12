import { BrowserProvider, Contract, formatEther, parseEther, getAddress, isAddress } from "ethers";
import { CONTRACT_ABI } from "./contract";

let provider = null;
let signer = null;
let contract = null;
let contractAddress = null;
let contractSigner = null;

export function sanitizeAddress(addr) {
  if (!addr) return "";
  const cleaned = String(addr).trim();
  if (!isAddress(cleaned)) {
    throw new Error(`Invalid Ethereum address: "${addr}". Please provide a valid 0x address.`);
  }
  return getAddress(cleaned);
}

export async function connectWallet() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();

  return { address: getAddress(accounts[0]), provider, signer };
}

export async function getContract(address) {
  if (!signer) {
    throw new Error("Wallet not connected");
  }

  const cleanAddr = sanitizeAddress(address);
  const signerAddress = await signer.getAddress();

  if (contract && contractAddress === cleanAddr && contractSigner === signerAddress) {
    return contract;
  }

  contractAddress = cleanAddr;
  contractSigner = signerAddress;
  contract = new Contract(cleanAddr, CONTRACT_ABI, signer);
  return contract;
}

export async function getReadOnlyContract(address) {
  if (!provider) {
    if (typeof window !== "undefined" && window.ethereum) {
      provider = new BrowserProvider(window.ethereum);
    } else {
      return null;
    }
  }
  return new Contract(address, CONTRACT_ABI, provider);
}

export async function getAccounts() {
  if (typeof window === "undefined" || !window.ethereum) return [];
  return window.ethereum.request({ method: "eth_accounts" });
}

export async function getBalance(address) {
  if (typeof window === "undefined") return "0";
  if (!provider) {
    if (!window.ethereum) return "0";
    provider = new BrowserProvider(window.ethereum);
  }
  const balance = await provider.getBalance(address);
  return formatEther(balance);
}

export async function getContractBalance(address) {
  if (typeof window === "undefined") return "0";
  if (!provider) {
    if (!window.ethereum) return "0";
    provider = new BrowserProvider(window.ethereum);
  }
  const balance = await provider.getBalance(address);
  return formatEther(balance);
}

const CHAINS = {
  31337: {
    chainId: "0x7a69",
    chainName: "Hardhat Local",
    rpcUrls: ["http://localhost:8545"],
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  },
  11155111: {
    chainId: "0xaa36a7",
    chainName: "Sepolia",
    rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
};

const EXPECTED_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111);

export async function switchToExpectedChain() {
  if (typeof window === "undefined" || !window.ethereum) return;

  const config = CHAINS[EXPECTED_CHAIN_ID];
  if (!config) throw new Error(`Unsupported EXPECTED_CHAIN_ID: ${EXPECTED_CHAIN_ID}`);

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: config.chainId }],
    });
  } catch (e) {
    if (e.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [config],
      });
    } else {
      throw e;
    }
  }
}

// Backwards-compatible alias for the old fixed localhost helper
export async function switchToLocalhost() {
  await switchToExpectedChain();
}

export function formatEth(wei) {
  return formatEther(wei);
}

export function parseEth(eth) {
  return parseEther(eth);
}

export function listenAccountChange(callback) {
  if (typeof window === "undefined" || !window.ethereum) return;
  window.ethereum.on("accountsChanged", callback);
}

export function listenChainChange(callback) {
  if (typeof window === "undefined" || !window.ethereum) return;
  window.ethereum.on("chainChanged", callback);
}

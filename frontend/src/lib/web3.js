import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import { CONTRACT_ABI } from "./contract";

let provider = null;
let signer = null;
let contract = null;
let contractAddress = null;

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();

  return { address: accounts[0], provider, signer };
}

export async function getContract(address) {
  if (!signer) {
    throw new Error("Wallet not connected");
  }

  if (contract && contractAddress === address) {
    return contract;
  }

  contractAddress = address;
  contract = new Contract(address, CONTRACT_ABI, signer);
  return contract;
}

export async function getReadOnlyContract(address) {
  if (!provider) {
    provider = new BrowserProvider(window.ethereum);
  }
  return new Contract(address, CONTRACT_ABI, provider);
}

export async function getAccounts() {
  if (!window.ethereum) return [];
  return window.ethereum.request({ method: "eth_accounts" });
}

export async function getBalance(address) {
  if (!provider) {
    if (!window.ethereum) return "0";
    provider = new BrowserProvider(window.ethereum);
  }
  const balance = await provider.getBalance(address);
  return formatEther(balance);
}

export async function switchToLocalhost() {
  if (!window.ethereum) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x7a69" }],
    });
  } catch (e) {
    if (e.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x7a69",
            chainName: "Hardhat Local",
            rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8545"],
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
          },
        ],
      });
    }
  }
}

export function formatEth(wei) {
  return formatEther(wei);
}

export function parseEth(eth) {
  return parseEther(eth);
}

export function listenAccountChange(callback) {
  if (!window.ethereum) return;
  window.ethereum.on("accountsChanged", callback);
}

export function listenChainChange(callback) {
  if (!window.ethereum) return;
  window.ethereum.on("chainChanged", callback);
}

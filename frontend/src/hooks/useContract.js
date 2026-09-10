"use client";

import { useState, useEffect, useCallback } from "react";
import { connectWallet, getContract, getReadOnlyContract, switchToLocalhost, formatEth } from "@/lib/web3";
import { AGREEMENT_STATES } from "@/lib/contract";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { address } = await connectWallet();
      await switchToLocalhost();
      setAccount(address);
      return address;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  return { account, balance, loading, error, connect };
}

export function useAgreements() {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchByLandlord = useCallback(async (address) => {
    if (!CONTRACT_ADDRESS) return [];
    setLoading(true);
    try {
      const contract = await getReadOnlyContract(CONTRACT_ADDRESS);
      if (!contract) return [];
      const ids = await contract.getLandlordAgreements(address);
      const details = await Promise.all(
        ids.map((id) => contract.getAgreement(id))
      );
      const formatted = details.map((a) => ({
        id: Number(a.id),
        landlord: a.landlord,
        tenant: a.tenant,
        rentAmount: formatEth(a.rentAmount),
        securityDeposit: formatEth(a.securityDeposit),
        startDate: new Date(Number(a.startDate) * 1000),
        endDate: new Date(Number(a.endDate) * 1000),
        state: AGREEMENT_STATES[a.state],
        stateCode: Number(a.state),
      }));
      setAgreements(formatted);
      return formatted;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByTenant = useCallback(async (address) => {
    if (!CONTRACT_ADDRESS) return [];
    setLoading(true);
    try {
      const contract = await getReadOnlyContract(CONTRACT_ADDRESS);
      if (!contract) return [];
      const ids = await contract.getTenantAgreements(address);
      const details = await Promise.all(
        ids.map((id) => contract.getAgreement(id))
      );
      const formatted = details.map((a) => ({
        id: Number(a.id),
        landlord: a.landlord,
        tenant: a.tenant,
        rentAmount: formatEth(a.rentAmount),
        securityDeposit: formatEth(a.securityDeposit),
        startDate: new Date(Number(a.startDate) * 1000),
        endDate: new Date(Number(a.endDate) * 1000),
        state: AGREEMENT_STATES[a.state],
        stateCode: Number(a.state),
      }));
      setAgreements(formatted);
      return formatted;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOne = useCallback(async (id) => {
    if (!CONTRACT_ADDRESS) return null;
    setLoading(true);
    try {
      const contract = await getReadOnlyContract(CONTRACT_ADDRESS);
      if (!contract) return null;
      const a = await contract.getAgreement(id);
      return {
        id: Number(a.id),
        landlord: a.landlord,
        tenant: a.tenant,
        rentAmount: formatEth(a.rentAmount),
        securityDeposit: formatEth(a.securityDeposit),
        startDate: new Date(Number(a.startDate) * 1000),
        endDate: new Date(Number(a.endDate) * 1000),
        gracePeriod: Number(a.gracePeriod),
        state: AGREEMENT_STATES[a.state],
        stateCode: Number(a.state),
      };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { agreements, loading, error, fetchByLandlord, fetchByTenant, fetchOne };
}

import { useEffect, useState, useCallback } from "react";

import { getEthereum } from "../utils/ethereum";

type ReturnUseWallet = {
  currentAccount: string | undefined;
  connectWallet: () => void;
  disconnectWallet: () => void;
};

const DISCONNECT_FLAG_KEY = "wallet_disconnected";

export const useWallet = (): ReturnUseWallet => {
  const [currentAccount, setCurrentAccount] = useState<string>();
  const ethereum = getEthereum();

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Get Wallet!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!Array.isArray(accounts)) return;
      console.log("Connected: ", accounts[0]);
      // Clear the disconnect flag when connecting
      localStorage.removeItem(DISCONNECT_FLAG_KEY);
      setCurrentAccount(accounts[0]); // 簡易実装のため、配列の初めのアドレスを使用します。
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = () => {
    // Set disconnect flag in localStorage to persist across reloads
    localStorage.setItem(DISCONNECT_FLAG_KEY, "true");
    setCurrentAccount(undefined);
    console.log("Wallet disconnected");
    // Reload the page immediately after disconnecting
    window.location.reload();
  };

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      // Check if user has manually disconnected
      const isDisconnected = localStorage.getItem(DISCONNECT_FLAG_KEY) === "true";
      if (isDisconnected) {
        console.log("Wallet is manually disconnected");
        setCurrentAccount(undefined);
        return;
      }

      if (!ethereum) {
        console.log("Make sure you have Wallet!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (!Array.isArray(accounts)) return;
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
        setCurrentAccount(undefined);
      }
    } catch (error) {
      console.log(error);
    }
  }, [ethereum]);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  useEffect(() => {
    if (!ethereum) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (!Array.isArray(accounts)) return;
      
      // Check if user has manually disconnected - if so, ignore account changes
      const isDisconnected = localStorage.getItem(DISCONNECT_FLAG_KEY) === "true";
      if (isDisconnected) {
        console.log("Wallet is manually disconnected, ignoring account changes");
        return;
      }
      
      if (accounts.length === 0) {
        // User disconnected their wallet
        setCurrentAccount(undefined);
        console.log("Wallet disconnected");
      } else {
        // User switched accounts
        setCurrentAccount(accounts[0]);
        console.log("Account changed:", accounts[0]);
      }
    };

    ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [ethereum]);

  return {
    currentAccount,
    connectWallet,
    disconnectWallet,
  };
};


import React, { useState, useEffect } from 'react';
import Web3Service from './Web3';

export default function WalletStatus() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    const connected = await Web3Service.connectWallet();
    setIsWalletConnected(connected);
    if (connected) {
      setWalletAddress(Web3Service.account);
    }
  };

  return (
    <>
      {isWalletConnected ? (
        <div className="wallet-status-text">
          Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
      ) : (
        <button className="btn-connect" onClick={checkWalletConnection}>
          Connect Wallet
        </button>
      )}
    </>
  );
}

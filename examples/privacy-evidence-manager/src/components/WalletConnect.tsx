import { useState } from 'react';
import { ethers } from 'ethers';

interface WalletConnectProps {
  isConnected: boolean;
  address: string;
  provider: ethers.BrowserProvider | null;
  onConnect: () => void;
  contract: ethers.Contract | null;
  isLoaded: boolean;
  onLoadContract: (address: string) => void;
}

export function WalletConnect({
  isConnected,
  address,
  provider,
  onConnect,
  contract,
  isLoaded,
  onLoadContract
}: WalletConnectProps) {
  const [contractAddress, setContractAddress] = useState('0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLoadContract = async () => {
    setLoading(true);
    setMessage('');
    try {
      await onLoadContract(contractAddress);
      setMessage('Contract loaded successfully!');
    } catch (error) {
      setMessage('Failed to load contract');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card">
        <h2>Connect Wallet</h2>
        {isConnected ? (
          <div>
            <strong>Wallet Connected</strong><br />
            Address: {address}<br />
          </div>
        ) : (
          <div>
            <p>Please click the button below to connect your wallet</p>
            <button className="btn" onClick={onConnect}>Connect MetaMask</button>
          </div>
        )}
      </div>

      {isConnected && (
        <div className="card">
          <h2>Contract Information</h2>
          <div className="form-group">
            <label>Contract Address:</label>
            <input
              type="text"
              className="form-control"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="Enter contract address"
            />
          </div>
          <button className="btn" onClick={handleLoadContract} disabled={loading}>
            {loading ? 'Loading...' : 'Load Contract'}
          </button>
          {message && (
            <div className={message.includes('success') ? 'success-message' : 'error-message'}>
              {message}
            </div>
          )}
        </div>
      )}
    </>
  );
}

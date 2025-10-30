import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ConnectionStatus } from './components/ConnectionStatus';
import { WalletConnect } from './components/WalletConnect';
import { TabNavigation } from './components/TabNavigation';
import { CasesTab } from './components/CasesTab';
import { EvidenceTab } from './components/EvidenceTab';
import { AccessTab } from './components/AccessTab';
import { StatsTab } from './components/StatsTab';
import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';

type TabType = 'connect' | 'cases' | 'evidence' | 'access' | 'stats';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('connect');
  const { provider, signer, address, isConnected, connect } = useWallet();
  const { contract, loadContract, isLoaded } = useContract(signer);

  return (
    <div className="app">
      <ConnectionStatus isConnected={isConnected} address={address} />

      <header className="header">
        <h1>Privacy Evidence Manager</h1>
        <p>Secure Judicial Evidence Management Platform with Zama FHE</p>
      </header>

      <div className="container">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'connect' && (
          <WalletConnect
            isConnected={isConnected}
            address={address}
            provider={provider}
            onConnect={connect}
            contract={contract}
            isLoaded={isLoaded}
            onLoadContract={loadContract}
          />
        )}

        {activeTab === 'cases' && (
          <CasesTab contract={contract} isLoaded={isLoaded} />
        )}

        {activeTab === 'evidence' && (
          <EvidenceTab contract={contract} isLoaded={isLoaded} />
        )}

        {activeTab === 'access' && (
          <AccessTab contract={contract} isLoaded={isLoaded} />
        )}

        {activeTab === 'stats' && (
          <StatsTab contract={contract} isLoaded={isLoaded} />
        )}
      </div>
    </div>
  );
}

export default App;

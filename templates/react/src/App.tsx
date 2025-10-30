import { useState } from 'react';
import { FHEProvider, useFHE } from './hooks/useFHE';
import { EncryptionDemo } from './components/EncryptionDemo';
import './App.css';

function AppContent() {
  const { client, isInitialized, error, init } = useFHE();
  const [activeTab, setActiveTab] = useState<'encryption' | 'keys'>('encryption');

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={init}>Retry</button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="container">
        <div className="hero">
          <h1>FHEVM React Template</h1>
          <p>Fully Homomorphic Encryption on Ethereum</p>
          <button onClick={init} className="primary">
            Connect Wallet & Initialize
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>FHEVM SDK Demo</h1>
        <p>React Template with Encryption Support</p>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'encryption' ? 'active' : ''}
          onClick={() => setActiveTab('encryption')}
        >
          Encryption Demo
        </button>
        <button
          className={activeTab === 'keys' ? 'active' : ''}
          onClick={() => setActiveTab('keys')}
        >
          Key Management
        </button>
      </nav>

      <main>
        {activeTab === 'encryption' && <EncryptionDemo />}
        {activeTab === 'keys' && (
          <div className="card">
            <h2>Key Management</h2>
            <p>Key management features coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <FHEProvider>
      <AppContent />
    </FHEProvider>
  );
}

export default App;

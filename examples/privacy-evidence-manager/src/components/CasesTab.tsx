import { useState } from 'react';
import { ethers } from 'ethers';

interface CasesTabProps {
  contract: ethers.Contract | null;
  isLoaded: boolean;
}

export function CasesTab({ contract, isLoaded }: CasesTabProps) {
  const [title, setTitle] = useState('');
  const [minAccessLevel, setMinAccessLevel] = useState('0');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateCase = async () => {
    if (!contract || !title) return;

    setLoading(true);
    setMessage('');
    try {
      const tx = await contract.createCase(title, minAccessLevel);
      setMessage('Transaction submitted, waiting for confirmation...');
      await tx.wait();
      setMessage('Case created successfully!');
      setTitle('');
    } catch (error: any) {
      setMessage('Failed to create case: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="card">
        <h2>Case Management</h2>
        <div className="error-message">Please load contract first</div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <h2>Create New Case</h2>
        <div className="form-group">
          <label>Case Title:</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter case title"
          />
        </div>
        <div className="form-group">
          <label>Minimum Access Level:</label>
          <select
            className="form-control"
            value={minAccessLevel}
            onChange={(e) => setMinAccessLevel(e.target.value)}
          >
            <option value="0">Public</option>
            <option value="1">Restricted</option>
            <option value="2">Confidential</option>
            <option value="3">Top Secret</option>
          </select>
        </div>
        <button className="btn" onClick={handleCreateCase} disabled={loading}>
          {loading ? 'Creating...' : 'Create Case'}
        </button>
        {message && (
          <div className={message.includes('success') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Cases List</h2>
        <div className="loading">
          <div className="spinner"></div>
          Loading cases...
        </div>
      </div>
    </>
  );
}

import { ethers } from 'ethers';

interface EvidenceTabProps {
  contract: ethers.Contract | null;
  isLoaded: boolean;
}

export function EvidenceTab({ contract, isLoaded }: EvidenceTabProps) {
  if (!isLoaded) {
    return (
      <div className="card">
        <h2>Evidence Management</h2>
        <div className="error-message">Please load contract first</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Submit Evidence</h2>
      <p>Evidence submission functionality - React component</p>
    </div>
  );
}

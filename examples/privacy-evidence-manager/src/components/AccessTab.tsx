import { ethers } from 'ethers';

interface AccessTabProps {
  contract: ethers.Contract | null;
  isLoaded: boolean;
}

export function AccessTab({ contract, isLoaded }: AccessTabProps) {
  if (!isLoaded) {
    return (
      <div className="card">
        <h2>Access Management</h2>
        <div className="error-message">Please load contract first</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Authorize Users</h2>
      <p>Access control functionality - React component</p>
    </div>
  );
}

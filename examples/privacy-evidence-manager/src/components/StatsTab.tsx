import { ethers } from 'ethers';

interface StatsTabProps {
  contract: ethers.Contract | null;
  isLoaded: boolean;
}

export function StatsTab({ contract, isLoaded }: StatsTabProps) {
  if (!isLoaded) {
    return (
      <div className="card">
        <h2>System Statistics</h2>
        <div className="error-message">Please load contract first</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>System Statistics</h2>
      <p>Statistics display - React component</p>
    </div>
  );
}

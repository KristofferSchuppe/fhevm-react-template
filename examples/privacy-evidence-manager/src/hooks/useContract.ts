import { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ABI = [
  "function createCase(string memory _title, uint8 _minAccessLevel) external returns (uint256)",
  "function submitEvidence(uint256 _caseId, uint8 _evidenceType, uint8 _accessLevel, bytes32 _hashData, uint32 _size, string memory _metadataURI) external returns (uint256)",
  "function reviewEvidence(uint256 _evidenceId, uint8 _status) external",
  "function sealEvidence(uint256 _evidenceId) external",
  "function grantAccess(address _user, uint256 _caseId) external",
  "function grantFHEAccess(uint256 _evidenceId, address _user) external",
  "function getEvidenceBasicInfo(uint256 _evidenceId) external view returns (uint256, uint256, uint8, uint8, uint8, bool)",
  "function getEvidenceDetails(uint256 _evidenceId) external view returns (address, uint256, string)",
  "function getEncryptedEvidenceData(uint256 _evidenceId) external view returns (bytes32, bytes32)",
  "function getCaseBasicInfo(uint256 _caseId) external view returns (uint256, string, address, uint256, bool, uint8)",
  "function getTotalStats() external view returns (uint256, uint256, uint256)",
  "function authorizeJudge(address _judge) external",
  "function authorizeReviewer(address _reviewer) external",
  "function closeCase(uint256 _caseId) external",
];

export function useContract(signer: ethers.Signer | null) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadContract = async (address: string) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    const newContract = new ethers.Contract(address, CONTRACT_ABI, signer);
    setContract(newContract);
    setIsLoaded(true);
    return newContract;
  };

  return { contract, isLoaded, loadContract };
}

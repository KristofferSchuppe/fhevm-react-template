// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract PrivacyEvidenceManager {
    address public owner;
    uint256 public evidenceCount;
    uint256 public caseCount;
    uint256 public requestCount;

    enum EvidenceType { Document, Audio, Video, Image, Digital, Physical }
    enum EvidenceStatus { Submitted, UnderReview, Approved, Rejected, Sealed }
    enum AccessLevel { Public, Restricted, Confidential, TopSecret }

    // Simplified mappings with FHE encryption
    mapping(uint256 => uint256) public evidenceCaseId;
    mapping(uint256 => EvidenceType) public evidenceType;
    mapping(uint256 => EvidenceStatus) public evidenceStatus;
    mapping(uint256 => AccessLevel) public evidenceAccessLevel;
    mapping(uint256 => bytes32) public evidenceHash; // Public hash for verification
    mapping(uint256 => euint64) public evidenceEncryptedHash; // FHE encrypted hash
    mapping(uint256 => euint32) public evidenceEncryptedSize; // FHE encrypted size
    mapping(uint256 => address) public evidenceSubmitter;
    mapping(uint256 => uint256) public evidenceSubmissionTime;
    mapping(uint256 => bool) public evidenceSealed;
    mapping(uint256 => string) public evidenceMetadata;

    mapping(uint256 => string) public caseTitle;
    mapping(uint256 => address) public caseJudge;
    mapping(uint256 => uint256) public caseCreationTime;
    mapping(uint256 => bool) public caseClosed;
    mapping(uint256 => AccessLevel) public caseMinAccessLevel;

    mapping(address => bool) public authorizedJudges;
    mapping(address => bool) public authorizedReviewers;
    mapping(address => mapping(uint256 => bool)) public hasAccess;

    event EvidenceSubmitted(uint256 indexed evidenceId, uint256 indexed caseId, address indexed submitter, EvidenceType evidenceType);
    event EvidenceReviewed(uint256 indexed evidenceId, address indexed reviewer, EvidenceStatus status);
    event CaseCreated(uint256 indexed caseId, string caseTitle, address indexed judge);
    event AccessRequested(uint256 indexed requestId, uint256 indexed evidenceId, address indexed requester);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyJudge() {
        require(authorizedJudges[msg.sender], "Not authorized judge");
        _;
    }

    modifier onlyReviewer() {
        require(authorizedReviewers[msg.sender], "Not authorized reviewer");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedJudges[msg.sender] = true;
        authorizedReviewers[msg.sender] = true;
    }

    function authorizeJudge(address _judge) external onlyOwner {
        authorizedJudges[_judge] = true;
    }

    function authorizeReviewer(address _reviewer) external onlyOwner {
        authorizedReviewers[_reviewer] = true;
    }

    function createCase(
        string memory _title,
        AccessLevel _minAccessLevel
    ) external onlyJudge returns (uint256) {
        caseCount++;
        caseTitle[caseCount] = _title;
        caseJudge[caseCount] = msg.sender;
        caseCreationTime[caseCount] = block.timestamp;
        caseMinAccessLevel[caseCount] = _minAccessLevel;
        hasAccess[msg.sender][caseCount] = true;

        emit CaseCreated(caseCount, _title, msg.sender);
        return caseCount;
    }

    function submitEvidence(
        uint256 _caseId,
        EvidenceType _evidenceType,
        AccessLevel _accessLevel,
        bytes32 _hashData,
        uint32 _size,
        string memory _metadataURI
    ) external returns (uint256) {
        require(_caseId > 0 && _caseId <= caseCount, "Invalid case");
        require(!caseClosed[_caseId], "Case closed");
        require(hasAccess[msg.sender][_caseId] || authorizedJudges[msg.sender], "No access");

        evidenceCount++;

        // Store basic evidence info
        evidenceCaseId[evidenceCount] = _caseId;
        evidenceType[evidenceCount] = _evidenceType;
        evidenceStatus[evidenceCount] = EvidenceStatus.Submitted;
        evidenceAccessLevel[evidenceCount] = _accessLevel;
        evidenceHash[evidenceCount] = _hashData;
        evidenceSubmitter[evidenceCount] = msg.sender;
        evidenceSubmissionTime[evidenceCount] = block.timestamp;
        evidenceMetadata[evidenceCount] = _metadataURI;

        // Encrypt sensitive data with FHE
        _encryptEvidenceData(_hashData, _size);

        emit EvidenceSubmitted(evidenceCount, _caseId, msg.sender, _evidenceType);
        return evidenceCount;
    }

    function reviewEvidence(uint256 _evidenceId, EvidenceStatus _status) external onlyReviewer {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        require(_status == EvidenceStatus.Approved || _status == EvidenceStatus.Rejected, "Invalid status");

        evidenceStatus[_evidenceId] = _status;
        emit EvidenceReviewed(_evidenceId, msg.sender, _status);
    }

    function sealEvidence(uint256 _evidenceId) external onlyJudge {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        evidenceSealed[_evidenceId] = true;
        evidenceStatus[_evidenceId] = EvidenceStatus.Sealed;
    }

    function grantAccess(address _user, uint256 _caseId) external onlyJudge {
        require(_caseId > 0 && _caseId <= caseCount, "Invalid case");
        hasAccess[_user][_caseId] = true;
    }

    function closeCase(uint256 _caseId) external onlyJudge {
        require(_caseId > 0 && _caseId <= caseCount, "Invalid case");
        require(caseJudge[_caseId] == msg.sender, "Not case judge");
        caseClosed[_caseId] = true;
    }

    function getEvidenceBasicInfo(uint256 _evidenceId) external view returns (
        uint256 evidenceId,
        uint256 caseId,
        EvidenceType eType,
        EvidenceStatus status,
        AccessLevel accessLevel,
        bool isSealed
    ) {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        uint256 _caseId = evidenceCaseId[_evidenceId];
        require(hasAccess[msg.sender][_caseId] || authorizedJudges[msg.sender], "No access");

        return (
            _evidenceId,
            _caseId,
            evidenceType[_evidenceId],
            evidenceStatus[_evidenceId],
            evidenceAccessLevel[_evidenceId],
            evidenceSealed[_evidenceId]
        );
    }

    function getEvidenceDetails(uint256 _evidenceId) external view returns (
        address submitter,
        uint256 submissionTime,
        string memory metadataURI
    ) {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        uint256 _caseId = evidenceCaseId[_evidenceId];
        require(hasAccess[msg.sender][_caseId] || authorizedJudges[msg.sender], "No access");

        return (
            evidenceSubmitter[_evidenceId],
            evidenceSubmissionTime[_evidenceId],
            evidenceMetadata[_evidenceId]
        );
    }

    function getCaseBasicInfo(uint256 _caseId) external view returns (
        uint256 caseId,
        string memory title,
        address judge,
        uint256 creationTime,
        bool isClosed,
        AccessLevel minAccessLevel
    ) {
        require(_caseId > 0 && _caseId <= caseCount, "Invalid case");
        require(hasAccess[msg.sender][_caseId] || authorizedJudges[msg.sender], "No access");

        return (
            _caseId,
            caseTitle[_caseId],
            caseJudge[_caseId],
            caseCreationTime[_caseId],
            caseClosed[_caseId],
            caseMinAccessLevel[_caseId]
        );
    }

    function _encryptEvidenceData(bytes32 _hashData, uint32 _size) internal {
        // Encrypt sensitive data using FHE
        euint64 encryptedHash = FHE.asEuint64(uint64(uint256(_hashData) >> 192));
        euint32 encryptedSize = FHE.asEuint32(_size);

        // Store encrypted data
        evidenceEncryptedHash[evidenceCount] = encryptedHash;
        evidenceEncryptedSize[evidenceCount] = encryptedSize;

        // Set access permissions
        FHE.allowThis(encryptedHash);
        FHE.allowThis(encryptedSize);
        FHE.allow(encryptedHash, msg.sender);
        FHE.allow(encryptedSize, msg.sender);
    }

    function getEncryptedEvidenceData(uint256 _evidenceId) external view returns (
        bytes32 encryptedHash,
        bytes32 encryptedSize
    ) {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        uint256 _caseId = evidenceCaseId[_evidenceId];
        require(hasAccess[msg.sender][_caseId] || authorizedJudges[msg.sender], "No access");

        return (
            FHE.toBytes32(evidenceEncryptedHash[_evidenceId]),
            FHE.toBytes32(evidenceEncryptedSize[_evidenceId])
        );
    }

    function grantFHEAccess(uint256 _evidenceId, address _user) external onlyJudge {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");

        FHE.allow(evidenceEncryptedHash[_evidenceId], _user);
        FHE.allow(evidenceEncryptedSize[_evidenceId], _user);
    }

    function getTotalStats() external view returns (uint256, uint256, uint256) {
        return (caseCount, evidenceCount, requestCount);
    }
}
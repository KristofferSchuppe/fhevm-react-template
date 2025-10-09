// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PrivacyEvidenceManager {
    address public owner;
    uint256 public evidenceCount;
    uint256 public caseCount;
    uint256 public requestCount;

    enum EvidenceType { Document, Audio, Video, Image, Digital, Physical }
    enum EvidenceStatus { Submitted, UnderReview, Approved, Rejected, Sealed }
    enum AccessLevel { Public, Restricted, Confidential, TopSecret }

    // Standard mappings for evidence management
    mapping(uint256 => uint256) public evidenceCaseId;
    mapping(uint256 => EvidenceType) public evidenceType;
    mapping(uint256 => EvidenceStatus) public evidenceStatus;
    mapping(uint256 => AccessLevel) public evidenceAccessLevel;
    mapping(uint256 => bytes32) public evidenceHash;
    mapping(uint256 => bytes32) public evidenceEncryptedHash; // Encrypted hash storage
    mapping(uint256 => uint256) public evidenceEncryptedSize; // Encrypted size storage
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
    event AccessGranted(address indexed user, uint256 indexed caseId);

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
        require(_judge != address(0), "Invalid address");
        authorizedJudges[_judge] = true;
    }

    function authorizeReviewer(address _reviewer) external onlyOwner {
        require(_reviewer != address(0), "Invalid address");
        authorizedReviewers[_reviewer] = true;
    }

    function revokeJudge(address _judge) external onlyOwner {
        require(_judge != owner, "Cannot revoke owner");
        authorizedJudges[_judge] = false;
    }

    function revokeReviewer(address _reviewer) external onlyOwner {
        require(_reviewer != owner, "Cannot revoke owner");
        authorizedReviewers[_reviewer] = false;
    }

    function createCase(
        string memory _title,
        AccessLevel _minAccessLevel
    ) external onlyJudge returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");

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
        require(_hashData != bytes32(0), "Invalid hash");
        require(_size > 0, "Invalid size");

        evidenceCount++;

        evidenceCaseId[evidenceCount] = _caseId;
        evidenceType[evidenceCount] = _evidenceType;
        evidenceStatus[evidenceCount] = EvidenceStatus.Submitted;
        evidenceAccessLevel[evidenceCount] = _accessLevel;
        evidenceHash[evidenceCount] = _hashData;
        evidenceSubmitter[evidenceCount] = msg.sender;
        evidenceSubmissionTime[evidenceCount] = block.timestamp;
        evidenceMetadata[evidenceCount] = _metadataURI;

        // Simulate encrypted storage
        evidenceEncryptedHash[evidenceCount] = _hashData;
        evidenceEncryptedSize[evidenceCount] = _size;

        emit EvidenceSubmitted(evidenceCount, _caseId, msg.sender, _evidenceType);
        return evidenceCount;
    }

    function reviewEvidence(uint256 _evidenceId, EvidenceStatus _status) external onlyReviewer {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        require(_status == EvidenceStatus.Approved || _status == EvidenceStatus.Rejected, "Invalid status");
        require(evidenceStatus[_evidenceId] != EvidenceStatus.Sealed, "Evidence is sealed");

        evidenceStatus[_evidenceId] = _status;
        emit EvidenceReviewed(_evidenceId, msg.sender, _status);
    }

    function sealEvidence(uint256 _evidenceId) external onlyJudge {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        require(!evidenceSealed[_evidenceId], "Already sealed");

        evidenceSealed[_evidenceId] = true;
        evidenceStatus[_evidenceId] = EvidenceStatus.Sealed;
    }

    function grantAccess(address _user, uint256 _caseId) external onlyJudge {
        require(_caseId > 0 && _caseId <= caseCount, "Invalid case");
        require(_user != address(0), "Invalid address");

        hasAccess[_user][_caseId] = true;
        emit AccessGranted(_user, _caseId);
    }

    function revokeAccess(address _user, uint256 _caseId) external onlyJudge {
        require(_caseId > 0 && _caseId <= caseCount, "Invalid case");
        require(_user != owner, "Cannot revoke owner");

        hasAccess[_user][_caseId] = false;
    }

    function closeCase(uint256 _caseId) external onlyJudge {
        require(_caseId > 0 && _caseId <= caseCount, "Invalid case");
        require(caseJudge[_caseId] == msg.sender, "Not case judge");
        require(!caseClosed[_caseId], "Already closed");

        caseClosed[_caseId] = true;
    }

    function reopenCase(uint256 _caseId) external onlyJudge {
        require(_caseId > 0 && _caseId <= caseCount, "Invalid case");
        require(caseJudge[_caseId] == msg.sender, "Not case judge");
        require(caseClosed[_caseId], "Case not closed");

        caseClosed[_caseId] = false;
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
        string memory metadataURI,
        bytes32 hashData
    ) {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        uint256 _caseId = evidenceCaseId[_evidenceId];
        require(hasAccess[msg.sender][_caseId] || authorizedJudges[msg.sender], "No access");

        return (
            evidenceSubmitter[_evidenceId],
            evidenceSubmissionTime[_evidenceId],
            evidenceMetadata[_evidenceId],
            evidenceHash[_evidenceId]
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

    function getEncryptedEvidenceData(uint256 _evidenceId) external view returns (
        bytes32 encryptedHash,
        uint256 encryptedSize
    ) {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        uint256 _caseId = evidenceCaseId[_evidenceId];
        require(hasAccess[msg.sender][_caseId] || authorizedJudges[msg.sender], "No access");

        return (
            evidenceEncryptedHash[_evidenceId],
            evidenceEncryptedSize[_evidenceId]
        );
    }

    function getTotalStats() external view returns (uint256, uint256, uint256) {
        return (caseCount, evidenceCount, requestCount);
    }

    function isJudge(address _address) external view returns (bool) {
        return authorizedJudges[_address];
    }

    function isReviewer(address _address) external view returns (bool) {
        return authorizedReviewers[_address];
    }

    function hasAccessToCase(address _user, uint256 _caseId) external view returns (bool) {
        return hasAccess[_user][_caseId] || authorizedJudges[_user];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title ProofVerification
 * @dev Handles proof verification for charity fund utilization using Merkle trees
 */
contract ProofVerification is AccessControl {
    
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    struct Proof {
        uint256 id;
        uint256 charityId;
        bytes32 documentHash;
        bytes32 merkleRoot;
        uint256 timestamp;
        address submitter;
        bool isVerified;
        address verifier;
        uint256 verifiedAt;
        string ipfsHash;
    }

    struct AuditRecord {
        uint256 proofId;
        address auditor;
        bool isApproved;
        string comments;
        uint256 auditTime;
    }

    uint256 public proofCount;
    uint256 public auditCount;

    mapping(uint256 => Proof) public proofs;
    mapping(uint256 => AuditRecord[]) public proofAudits;
    mapping(uint256 => uint256[]) public charityProofs;
    mapping(bytes32 => bool) public usedDocumentHashes;
    mapping(bytes32 => uint256) public merkleRootToProof;

    event ProofSubmitted(
        uint256 indexed proofId,
        uint256 indexed charityId,
        bytes32 documentHash,
        bytes32 merkleRoot,
        address submitter
    );

    event ProofVerified(
        uint256 indexed proofId,
        address indexed verifier,
        uint256 timestamp
    );

    event ProofAudited(
        uint256 indexed proofId,
        uint256 indexed auditId,
        address indexed auditor,
        bool isApproved
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender);
    }

    /**
     * @dev Submit proof of fund utilization
     */
    function submitProof(
        uint256 _charityId,
        bytes32 _documentHash,
        bytes32 _merkleRoot,
        string memory _ipfsHash
    ) external returns (uint256) {
        require(_charityId > 0, "Invalid charity ID");
        require(_documentHash != bytes32(0), "Invalid document hash");
        require(_merkleRoot != bytes32(0), "Invalid merkle root");
        require(!usedDocumentHashes[_documentHash], "Document hash already used");

        proofCount++;

        proofs[proofCount] = Proof({
            id: proofCount,
            charityId: _charityId,
            documentHash: _documentHash,
            merkleRoot: _merkleRoot,
            timestamp: block.timestamp,
            submitter: msg.sender,
            isVerified: false,
            verifier: address(0),
            verifiedAt: 0,
            ipfsHash: _ipfsHash
        });

        usedDocumentHashes[_documentHash] = true;
        merkleRootToProof[_merkleRoot] = proofCount;
        charityProofs[_charityId].push(proofCount);

        emit ProofSubmitted(proofCount, _charityId, _documentHash, _merkleRoot, msg.sender);

        return proofCount;
    }

    /**
     * @dev Verify proof using Merkle proof
     */
    function verifyProof(
        uint256 _proofId,
        bytes32[] calldata _merkleProof,
        bytes32 _leaf
    ) external onlyRole(VERIFIER_ROLE) returns (bool) {
        require(_proofId > 0 && _proofId <= proofCount, "Invalid proof ID");
        
        Proof storage proof = proofs[_proofId];
        require(!proof.isVerified, "Already verified");

        bytes32 merkleRoot = proof.merkleRoot;
        bool isValid = MerkleProof.verify(_merkleProof, merkleRoot, _leaf);
        
        if (isValid) {
            proof.isVerified = true;
            proof.verifier = msg.sender;
            proof.verifiedAt = block.timestamp;

            emit ProofVerified(_proofId, msg.sender, block.timestamp);
        }

        return isValid;
    }

    /**
     * @dev Audit a proof
     */
    function auditProof(
        uint256 _proofId,
        bool _isApproved,
        string memory _comments
    ) external onlyRole(AUDITOR_ROLE) {
        require(_proofId > 0 && _proofId <= proofCount, "Invalid proof ID");
        
        Proof storage proof = proofs[_proofId];
        require(proof.isVerified, "Proof not verified yet");

        auditCount++;

        AuditRecord memory audit = AuditRecord({
            proofId: _proofId,
            auditor: msg.sender,
            isApproved: _isApproved,
            comments: _comments,
            auditTime: block.timestamp
        });

        proofAudits[_proofId].push(audit);

        emit ProofAudited(_proofId, auditCount, msg.sender, _isApproved);
    }

    /**
     * @dev Verify document hash
     */
    function verifyDocumentHash(
        bytes32 _documentHash,
        bytes32[] calldata _merkleProof,
        bytes32 _merkleRoot
    ) external pure returns (bool) {
        return MerkleProof.verify(_merkleProof, _merkleRoot, _documentHash);
    }

    /**
     * @dev Get proof details
     */
    function getProof(uint256 _proofId) external view returns (Proof memory) {
        require(_proofId > 0 && _proofId <= proofCount, "Invalid proof ID");
        return proofs[_proofId];
    }

    /**
     * @dev Get charity proofs
     */
    function getCharityProofs(uint256 _charityId) external view returns (uint256[] memory) {
        return charityProofs[_charityId];
    }

    /**
     * @dev Get proof audits
     */
    function getProofAudits(uint256 _proofId) external view returns (AuditRecord[] memory) {
        require(_proofId > 0 && _proofId <= proofCount, "Invalid proof ID");
        return proofAudits[_proofId];
    }

    /**
     * @dev Check if document hash is used
     */
    function isDocumentHashUsed(bytes32 _documentHash) external view returns (bool) {
        return usedDocumentHashes[_documentHash];
    }

    /**
     * @dev Get proof by merkle root
     */
    function getProofByMerkleRoot(bytes32 _merkleRoot) external view returns (uint256) {
        return merkleRootToProof[_merkleRoot];
    }

    /**
     * @dev Grant verifier role
     */
    function addVerifier(address _verifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VERIFIER_ROLE, _verifier);
    }

    /**
     * @dev Revoke verifier role
     */
    function removeVerifier(address _verifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(VERIFIER_ROLE, _verifier);
    }

    /**
     * @dev Grant auditor role
     */
    function addAuditor(address _auditor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(AUDITOR_ROLE, _auditor);
    }

    /**
     * @dev Revoke auditor role
     */
    function removeAuditor(address _auditor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(AUDITOR_ROLE, _auditor);
    }
}

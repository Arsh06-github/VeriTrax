// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MerkleVerifier
 * @dev Contract for verifying donation proofs using Merkle trees
 * @notice Provides transparent verification of fund utilization
 */
contract MerkleVerifier is Ownable {
    
    struct ProofRecord {
        bytes32 merkleRoot;
        uint256 timestamp;
        address submitter;
        string ipfsHash;
        bool isVerified;
    }

    mapping(uint256 => ProofRecord) public proofRecords;
    mapping(bytes32 => bool) public usedProofs;
    uint256 public recordCount;

    event ProofSubmitted(
        uint256 indexed recordId,
        bytes32 indexed merkleRoot,
        address indexed submitter,
        string ipfsHash
    );

    event ProofVerified(
        uint256 indexed recordId,
        bytes32 proofHash,
        bool isValid
    );

    constructor() Ownable(msg.sender) {
        recordCount = 0;
    }

    /**
     * @dev Submit a new proof record
     * @param _merkleRoot Root of the Merkle tree
     * @param _ipfsHash IPFS hash of supporting documents
     */
    function submitProof(
        bytes32 _merkleRoot,
        string memory _ipfsHash
    ) external returns (uint256) {
        require(_merkleRoot != bytes32(0), "Invalid Merkle root");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");

        recordCount++;

        proofRecords[recordCount] = ProofRecord({
            merkleRoot: _merkleRoot,
            timestamp: block.timestamp,
            submitter: msg.sender,
            ipfsHash: _ipfsHash,
            isVerified: false
        });

        emit ProofSubmitted(recordCount, _merkleRoot, msg.sender, _ipfsHash);

        return recordCount;
    }

    /**
     * @dev Verify a proof against a Merkle root
     * @param _recordId ID of the proof record
     * @param _proof Merkle proof array
     * @param _leaf Leaf node to verify
     */
    function verifyProof(
        uint256 _recordId,
        bytes32[] calldata _proof,
        bytes32 _leaf
    ) external returns (bool) {
        require(_recordId > 0 && _recordId <= recordCount, "Invalid record ID");
        require(!usedProofs[_leaf], "Proof already used");

        ProofRecord storage record = proofRecords[_recordId];
        bool isValid = MerkleProof.verify(_proof, record.merkleRoot, _leaf);

        if (isValid) {
            usedProofs[_leaf] = true;
            record.isVerified = true;
        }

        emit ProofVerified(_recordId, _leaf, isValid);

        return isValid;
    }

    /**
     * @dev Batch verify multiple proofs
     * @param _recordId ID of the proof record
     * @param _proofs Array of Merkle proofs
     * @param _leaves Array of leaf nodes
     */
    function batchVerifyProofs(
        uint256 _recordId,
        bytes32[][] calldata _proofs,
        bytes32[] calldata _leaves
    ) external returns (bool[] memory) {
        require(_recordId > 0 && _recordId <= recordCount, "Invalid record ID");
        require(_proofs.length == _leaves.length, "Array length mismatch");

        ProofRecord storage record = proofRecords[_recordId];
        bool[] memory results = new bool[](_leaves.length);

        for (uint256 i = 0; i < _leaves.length; i++) {
            if (!usedProofs[_leaves[i]]) {
                results[i] = MerkleProof.verify(_proofs[i], record.merkleRoot, _leaves[i]);
                if (results[i]) {
                    usedProofs[_leaves[i]] = true;
                }
            } else {
                results[i] = false;
            }
        }

        return results;
    }

    /**
     * @dev Get proof record details
     * @param _recordId ID of the proof record
     */
    function getProofRecord(uint256 _recordId) external view returns (ProofRecord memory) {
        require(_recordId > 0 && _recordId <= recordCount, "Invalid record ID");
        return proofRecords[_recordId];
    }

    /**
     * @dev Check if a proof has been used
     * @param _proofHash Hash of the proof
     */
    function isProofUsed(bytes32 _proofHash) external view returns (bool) {
        return usedProofs[_proofHash];
    }
}

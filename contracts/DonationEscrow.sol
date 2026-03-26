// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title DonationEscrow
 * @dev Escrow contract for holding donations until proof of utilization
 * @notice Implements Merkle tree verification for transparent fund release
 */
contract DonationEscrow is ReentrancyGuard, Ownable {
    
    struct EscrowDeposit {
        uint256 id;
        address donor;
        address beneficiary;
        uint256 amount;
        uint256 depositTime;
        uint256 releaseTime;
        bool isReleased;
        bool isCancelled;
        bytes32 proofHash;
        bytes32 merkleRoot;
    }

    uint256 public depositCount;
    mapping(uint256 => EscrowDeposit) public deposits;
    mapping(address => uint256[]) public userDeposits;
    mapping(address => uint256[]) public beneficiaryDeposits;

    uint256 public constant MIN_LOCK_PERIOD = 1 days;
    uint256 public constant MAX_LOCK_PERIOD = 365 days;

    event DepositCreated(
        uint256 indexed depositId,
        address indexed donor,
        address indexed beneficiary,
        uint256 amount,
        uint256 releaseTime
    );

    event FundsReleased(
        uint256 indexed depositId,
        address indexed beneficiary,
        uint256 amount,
        bytes32 proofHash
    );

    event DepositCancelled(
        uint256 indexed depositId,
        address indexed donor,
        uint256 refundAmount
    );

    event MerkleRootSet(uint256 indexed depositId, bytes32 merkleRoot);

    constructor() Ownable(msg.sender) {
        depositCount = 0;
    }

    /**
     * @dev Create escrow deposit
     * @param _beneficiary Address to receive funds
     * @param _lockPeriod Time in seconds to lock funds
     * @param _proofHash Hash of utilization proof
     */
    function createDeposit(
        address _beneficiary,
        uint256 _lockPeriod,
        bytes32 _proofHash
    ) external payable nonReentrant returns (uint256) {
        require(_beneficiary != address(0), "Invalid beneficiary");
        require(msg.value > 0, "Amount must be greater than 0");
        require(_lockPeriod >= MIN_LOCK_PERIOD && _lockPeriod <= MAX_LOCK_PERIOD, "Invalid lock period");

        depositCount++;
        uint256 releaseTime = block.timestamp + _lockPeriod;

        deposits[depositCount] = EscrowDeposit({
            id: depositCount,
            donor: msg.sender,
            beneficiary: _beneficiary,
            amount: msg.value,
            depositTime: block.timestamp,
            releaseTime: releaseTime,
            isReleased: false,
            isCancelled: false,
            proofHash: _proofHash,
            merkleRoot: bytes32(0)
        });

        userDeposits[msg.sender].push(depositCount);
        beneficiaryDeposits[_beneficiary].push(depositCount);

        emit DepositCreated(depositCount, msg.sender, _beneficiary, msg.value, releaseTime);

        return depositCount;
    }

    /**
     * @dev Release funds with Merkle proof verification
     * @param _depositId ID of the deposit
     * @param _merkleProof Merkle proof for verification
     */
    function releaseFunds(
        uint256 _depositId,
        bytes32[] calldata _merkleProof
    ) external nonReentrant {
        require(_depositId > 0 && _depositId <= depositCount, "Invalid deposit ID");
        EscrowDeposit storage deposit = deposits[_depositId];
        
        require(!deposit.isReleased, "Funds already released");
        require(!deposit.isCancelled, "Deposit cancelled");
        require(block.timestamp >= deposit.releaseTime, "Lock period not ended");
        require(msg.sender == deposit.beneficiary, "Only beneficiary can release");

        // Verify Merkle proof if root is set
        if (deposit.merkleRoot != bytes32(0)) {
            bytes32 leaf = keccak256(abi.encodePacked(deposit.proofHash));
            require(
                MerkleProof.verify(_merkleProof, deposit.merkleRoot, leaf),
                "Invalid Merkle proof"
            );
        }

        deposit.isReleased = true;

        (bool success, ) = deposit.beneficiary.call{value: deposit.amount}("");
        require(success, "Transfer failed");

        emit FundsReleased(_depositId, deposit.beneficiary, deposit.amount, deposit.proofHash);
    }

    /**
     * @dev Set Merkle root for deposit verification
     * @param _depositId ID of the deposit
     * @param _merkleRoot Merkle root hash
     */
    function setMerkleRoot(uint256 _depositId, bytes32 _merkleRoot) external {
        require(_depositId > 0 && _depositId <= depositCount, "Invalid deposit ID");
        EscrowDeposit storage deposit = deposits[_depositId];
        
        require(msg.sender == deposit.donor || msg.sender == owner(), "Not authorized");
        require(!deposit.isReleased, "Funds already released");
        require(!deposit.isCancelled, "Deposit cancelled");

        deposit.merkleRoot = _merkleRoot;

        emit MerkleRootSet(_depositId, _merkleRoot);
    }

    /**
     * @dev Cancel deposit and refund donor
     * @param _depositId ID of the deposit
     */
    function cancelDeposit(uint256 _depositId) external nonReentrant {
        require(_depositId > 0 && _depositId <= depositCount, "Invalid deposit ID");
        EscrowDeposit storage deposit = deposits[_depositId];
        
        require(msg.sender == deposit.donor, "Only donor can cancel");
        require(!deposit.isReleased, "Funds already released");
        require(!deposit.isCancelled, "Already cancelled");
        require(block.timestamp < deposit.releaseTime, "Lock period ended");

        deposit.isCancelled = true;

        (bool success, ) = deposit.donor.call{value: deposit.amount}("");
        require(success, "Refund failed");

        emit DepositCancelled(_depositId, deposit.donor, deposit.amount);
    }

    /**
     * @dev Get user's deposits
     * @param _user Address of the user
     */
    function getUserDeposits(address _user) external view returns (uint256[] memory) {
        return userDeposits[_user];
    }

    /**
     * @dev Get beneficiary's deposits
     * @param _beneficiary Address of the beneficiary
     */
    function getBeneficiaryDeposits(address _beneficiary) external view returns (uint256[] memory) {
        return beneficiaryDeposits[_beneficiary];
    }

    /**
     * @dev Get deposit details
     * @param _depositId ID of the deposit
     */
    function getDeposit(uint256 _depositId) external view returns (EscrowDeposit memory) {
        require(_depositId > 0 && _depositId <= depositCount, "Invalid deposit ID");
        return deposits[_depositId];
    }

    receive() external payable {}
    fallback() external payable {}
}

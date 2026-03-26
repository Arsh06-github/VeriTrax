// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title EscrowManager
 * @dev Manages escrow for charity donations with milestone-based releases
 */
contract EscrowManager is Ownable, ReentrancyGuard {
    
    struct EscrowDeposit {
        uint256 id;
        uint256 charityId;
        address donor;
        uint256 amount;
        uint256 depositTime;
        bool isReleased;
        bool isRefunded;
        bytes32 conditionHash;
    }

    struct ReleaseCondition {
        uint256 escrowId;
        bool requiresProof;
        bytes32 proofHash;
        uint256 releaseTime;
        bool isApproved;
        address approver;
    }

    uint256 public escrowCount;
    uint256 public totalEscrowed;
    uint256 public totalReleased;
    uint256 public totalRefunded;

    mapping(uint256 => EscrowDeposit) public escrows;
    mapping(uint256 => ReleaseCondition) public releaseConditions;
    mapping(uint256 => uint256[]) public charityEscrows;
    mapping(address => uint256[]) public donorEscrows;
    mapping(address => bool) public approvedApprovers;

    event EscrowCreated(
        uint256 indexed escrowId,
        uint256 indexed charityId,
        address indexed donor,
        uint256 amount
    );

    event EscrowReleased(
        uint256 indexed escrowId,
        uint256 indexed charityId,
        uint256 amount,
        address recipient
    );

    event EscrowRefunded(
        uint256 indexed escrowId,
        address indexed donor,
        uint256 amount
    );

    event ConditionApproved(
        uint256 indexed escrowId,
        address indexed approver,
        bytes32 proofHash
    );

    event ApproverAdded(address indexed approver);
    event ApproverRemoved(address indexed approver);

    modifier onlyApprover() {
        require(approvedApprovers[msg.sender] || msg.sender == owner(), "Not an approver");
        _;
    }

    constructor() {
        escrowCount = 0;
        approvedApprovers[msg.sender] = true;
    }

    /**
     * @dev Create escrow deposit
     */
    function createEscrow(
        uint256 _charityId,
        bytes32 _conditionHash,
        bool _requiresProof
    ) external payable nonReentrant returns (uint256) {
        require(msg.value > 0, "Amount must be greater than 0");
        require(_charityId > 0, "Invalid charity ID");

        escrowCount++;
        
        escrows[escrowCount] = EscrowDeposit({
            id: escrowCount,
            charityId: _charityId,
            donor: msg.sender,
            amount: msg.value,
            depositTime: block.timestamp,
            isReleased: false,
            isRefunded: false,
            conditionHash: _conditionHash
        });

        releaseConditions[escrowCount] = ReleaseCondition({
            escrowId: escrowCount,
            requiresProof: _requiresProof,
            proofHash: bytes32(0),
            releaseTime: 0,
            isApproved: false,
            approver: address(0)
        });

        charityEscrows[_charityId].push(escrowCount);
        donorEscrows[msg.sender].push(escrowCount);
        totalEscrowed += msg.value;

        emit EscrowCreated(escrowCount, _charityId, msg.sender, msg.value);
        
        return escrowCount;
    }

    /**
     * @dev Approve release condition
     */
    function approveRelease(
        uint256 _escrowId,
        bytes32 _proofHash
    ) external onlyApprover {
        require(_escrowId > 0 && _escrowId <= escrowCount, "Invalid escrow ID");
        
        EscrowDeposit storage escrow = escrows[_escrowId];
        require(!escrow.isReleased, "Already released");
        require(!escrow.isRefunded, "Already refunded");

        ReleaseCondition storage condition = releaseConditions[_escrowId];
        require(!condition.isApproved, "Already approved");

        condition.isApproved = true;
        condition.proofHash = _proofHash;
        condition.releaseTime = block.timestamp;
        condition.approver = msg.sender;

        emit ConditionApproved(_escrowId, msg.sender, _proofHash);
    }

    /**
     * @dev Release escrow funds
     */
    function releaseEscrow(
        uint256 _escrowId,
        address payable _recipient
    ) external nonReentrant onlyApprover {
        require(_escrowId > 0 && _escrowId <= escrowCount, "Invalid escrow ID");
        require(_recipient != address(0), "Invalid recipient");

        EscrowDeposit storage escrow = escrows[_escrowId];
        require(!escrow.isReleased, "Already released");
        require(!escrow.isRefunded, "Already refunded");

        ReleaseCondition storage condition = releaseConditions[_escrowId];
        require(condition.isApproved, "Not approved");

        escrow.isReleased = true;
        totalReleased += escrow.amount;

        (bool success, ) = _recipient.call{value: escrow.amount}("");
        require(success, "Transfer failed");

        emit EscrowReleased(_escrowId, escrow.charityId, escrow.amount, _recipient);
    }

    /**
     * @dev Refund escrow to donor
     */
    function refundEscrow(uint256 _escrowId) external nonReentrant {
        require(_escrowId > 0 && _escrowId <= escrowCount, "Invalid escrow ID");

        EscrowDeposit storage escrow = escrows[_escrowId];
        require(msg.sender == escrow.donor || msg.sender == owner(), "Not authorized");
        require(!escrow.isReleased, "Already released");
        require(!escrow.isRefunded, "Already refunded");

        escrow.isRefunded = true;
        totalRefunded += escrow.amount;

        (bool success, ) = escrow.donor.call{value: escrow.amount}("");
        require(success, "Transfer failed");

        emit EscrowRefunded(_escrowId, escrow.donor, escrow.amount);
    }

    /**
     * @dev Add approver
     */
    function addApprover(address _approver) external onlyOwner {
        require(_approver != address(0), "Invalid address");
        require(!approvedApprovers[_approver], "Already an approver");
        
        approvedApprovers[_approver] = true;
        emit ApproverAdded(_approver);
    }

    /**
     * @dev Remove approver
     */
    function removeApprover(address _approver) external onlyOwner {
        require(approvedApprovers[_approver], "Not an approver");
        
        approvedApprovers[_approver] = false;
        emit ApproverRemoved(_approver);
    }

    /**
     * @dev Get escrow details
     */
    function getEscrow(uint256 _escrowId) external view returns (EscrowDeposit memory) {
        require(_escrowId > 0 && _escrowId <= escrowCount, "Invalid escrow ID");
        return escrows[_escrowId];
    }

    /**
     * @dev Get release condition
     */
    function getReleaseCondition(uint256 _escrowId) external view returns (ReleaseCondition memory) {
        require(_escrowId > 0 && _escrowId <= escrowCount, "Invalid escrow ID");
        return releaseConditions[_escrowId];
    }

    /**
     * @dev Get charity escrows
     */
    function getCharityEscrows(uint256 _charityId) external view returns (uint256[] memory) {
        return charityEscrows[_charityId];
    }

    /**
     * @dev Get donor escrows
     */
    function getDonorEscrows(address _donor) external view returns (uint256[] memory) {
        return donorEscrows[_donor];
    }

    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
    fallback() external payable {}
}

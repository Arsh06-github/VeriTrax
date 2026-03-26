// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CharityPlatform
 * @dev Main contract for Veritrax charity donation platform
 * @notice Handles charity registration, donations, and fund management with transparency
 */
contract CharityPlatform is Ownable, ReentrancyGuard, Pausable {
    
    struct Charity {
        uint256 id;
        address payable charityWallet;
        string name;
        string description;
        string category;
        uint256 targetAmount;
        uint256 raisedAmount;
        bool isActive;
        bool isVerified;
        address creator;
        uint256 createdAt;
        bytes32 merkleRoot;
    }

    struct Donation {
        uint256 charityId;
        address donor;
        uint256 amount;
        uint256 timestamp;
        bytes32 proofHash;
        bool isReleased;
    }

    struct Campaign {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 targetAmount;
        uint256 raisedAmount;
        uint256 deadline;
        bool isActive;
        bool isCompleted;
        bytes32[] proofDocuments;
    }

    // State variables
    uint256 public charityCount;
    uint256 public donationCount;
    uint256 public campaignCount;
    uint256 public platformFeePercentage = 2; // 2% platform fee
    uint256 public totalPlatformFees;

    mapping(uint256 => Charity) public charities;
    mapping(uint256 => Donation) public donations;
    mapping(uint256 => Campaign) public campaigns;
    mapping(address => uint256[]) public userDonations;
    mapping(address => uint256[]) public charityDonations;
    mapping(uint256 => mapping(address => uint256)) public campaignContributions;

    // Events
    event CharityCreated(
        uint256 indexed charityId,
        address indexed creator,
        address charityWallet,
        string name,
        uint256 targetAmount
    );

    event CharityVerified(uint256 indexed charityId, address indexed verifier);

    event DonationReceived(
        uint256 indexed donationId,
        uint256 indexed charityId,
        address indexed donor,
        uint256 amount,
        bytes32 proofHash
    );

    event FundsReleased(
        uint256 indexed donationId,
        uint256 indexed charityId,
        uint256 amount,
        bytes32 merkleProof
    );

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 targetAmount,
        uint256 deadline
    );

    event CampaignContribution(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );

    event MerkleRootUpdated(uint256 indexed charityId, bytes32 newMerkleRoot);

    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);

    // Modifiers
    modifier onlyCharityCreator(uint256 _charityId) {
        require(charities[_charityId].creator == msg.sender, "Not charity creator");
        _;
    }

    modifier charityExists(uint256 _charityId) {
        require(_charityId > 0 && _charityId <= charityCount, "Charity does not exist");
        _;
    }

    modifier charityActive(uint256 _charityId) {
        require(charities[_charityId].isActive, "Charity is not active");
        _;
    }

    constructor() Ownable(msg.sender) {
        charityCount = 0;
        donationCount = 0;
        campaignCount = 0;
    }

    /**
     * @dev Create a new charity
     * @param _charityWallet Address to receive donations
     * @param _name Name of the charity
     * @param _description Description of the charity
     * @param _category Category (education, healthcare, etc.)
     * @param _targetAmount Target amount to raise
     */
    function createCharity(
        address payable _charityWallet,
        string memory _name,
        string memory _description,
        string memory _category,
        uint256 _targetAmount
    ) external whenNotPaused returns (uint256) {
        require(_charityWallet != address(0), "Invalid charity wallet");
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(bytes(_name).length > 0, "Name cannot be empty");

        charityCount++;
        
        charities[charityCount] = Charity({
            id: charityCount,
            charityWallet: _charityWallet,
            name: _name,
            description: _description,
            category: _category,
            targetAmount: _targetAmount,
            raisedAmount: 0,
            isActive: true,
            isVerified: false,
            creator: msg.sender,
            createdAt: block.timestamp,
            merkleRoot: bytes32(0)
        });

        emit CharityCreated(charityCount, msg.sender, _charityWallet, _name, _targetAmount);
        
        return charityCount;
    }

    /**
     * @dev Donate to a charity
     * @param _charityId ID of the charity
     * @param _proofHash Hash of the donation proof
     */
    function donate(uint256 _charityId, bytes32 _proofHash) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
        charityExists(_charityId) 
        charityActive(_charityId) 
    {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(charities[_charityId].isVerified, "Charity not verified");

        donationCount++;
        
        donations[donationCount] = Donation({
            charityId: _charityId,
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            proofHash: _proofHash,
            isReleased: false
        });

        charities[_charityId].raisedAmount += msg.value;
        userDonations[msg.sender].push(donationCount);
        charityDonations[charities[_charityId].charityWallet].push(donationCount);

        emit DonationReceived(donationCount, _charityId, msg.sender, msg.value, _proofHash);
    }

    /**
     * @dev Release funds to charity after verification
     * @param _donationId ID of the donation
     * @param _merkleProof Merkle proof for verification
     */
    function releaseFunds(uint256 _donationId, bytes32 _merkleProof) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(_donationId > 0 && _donationId <= donationCount, "Invalid donation ID");
        Donation storage donation = donations[_donationId];
        require(!donation.isReleased, "Funds already released");
        
        Charity storage charity = charities[donation.charityId];
        require(charity.isVerified, "Charity not verified");

        // Calculate platform fee
        uint256 platformFee = (donation.amount * platformFeePercentage) / 100;
        uint256 charityAmount = donation.amount - platformFee;

        // Mark as released
        donation.isReleased = true;
        totalPlatformFees += platformFee;

        // Transfer funds
        (bool success, ) = charity.charityWallet.call{value: charityAmount}("");
        require(success, "Transfer failed");

        emit FundsReleased(_donationId, donation.charityId, charityAmount, _merkleProof);
    }

    /**
     * @dev Create a fundraising campaign
     * @param _title Campaign title
     * @param _description Campaign description
     * @param _targetAmount Target amount to raise
     * @param _durationDays Campaign duration in days
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _durationDays
    ) external whenNotPaused returns (uint256) {
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_durationDays > 0, "Duration must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");

        campaignCount++;
        
        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            creator: msg.sender,
            title: _title,
            description: _description,
            targetAmount: _targetAmount,
            raisedAmount: 0,
            deadline: block.timestamp + (_durationDays * 1 days),
            isActive: true,
            isCompleted: false,
            proofDocuments: new bytes32[](0)
        });

        emit CampaignCreated(campaignCount, msg.sender, _title, _targetAmount, campaigns[campaignCount].deadline);
        
        return campaignCount;
    }

    /**
     * @dev Contribute to a campaign
     * @param _campaignId ID of the campaign
     */
    function contributeToCampaign(uint256 _campaignId) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign is not active");
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(msg.value > 0, "Contribution must be greater than 0");

        campaign.raisedAmount += msg.value;
        campaignContributions[_campaignId][msg.sender] += msg.value;

        emit CampaignContribution(_campaignId, msg.sender, msg.value);
    }

    /**
     * @dev Verify a charity (only owner)
     * @param _charityId ID of the charity to verify
     */
    function verifyCharity(uint256 _charityId) 
        external 
        onlyOwner 
        charityExists(_charityId) 
    {
        charities[_charityId].isVerified = true;
        emit CharityVerified(_charityId, msg.sender);
    }

    /**
     * @dev Update Merkle root for a charity
     * @param _charityId ID of the charity
     * @param _merkleRoot New Merkle root
     */
    function updateMerkleRoot(uint256 _charityId, bytes32 _merkleRoot) 
        external 
        onlyCharityCreator(_charityId) 
    {
        charities[_charityId].merkleRoot = _merkleRoot;
        emit MerkleRootUpdated(_charityId, _merkleRoot);
    }

    /**
     * @dev Update platform fee percentage (only owner)
     * @param _newFeePercentage New fee percentage
     */
    function updatePlatformFee(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= 10, "Fee cannot exceed 10%");
        uint256 oldFee = platformFeePercentage;
        platformFeePercentage = _newFeePercentage;
        emit PlatformFeeUpdated(oldFee, _newFeePercentage);
    }

    /**
     * @dev Withdraw platform fees (only owner)
     */
    function withdrawPlatformFees() external onlyOwner nonReentrant {
        uint256 amount = totalPlatformFees;
        require(amount > 0, "No fees to withdraw");
        
        totalPlatformFees = 0;
        
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Pause the contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Get user's donation history
     * @param _user Address of the user
     */
    function getUserDonations(address _user) external view returns (uint256[] memory) {
        return userDonations[_user];
    }

    /**
     * @dev Get charity's received donations
     * @param _charityWallet Address of the charity wallet
     */
    function getCharityDonations(address _charityWallet) external view returns (uint256[] memory) {
        return charityDonations[_charityWallet];
    }

    /**
     * @dev Get campaign details
     * @param _campaignId ID of the campaign
     */
    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
        return campaigns[_campaignId];
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}

    /**
     * @dev Fallback function
     */
    fallback() external payable {}
}

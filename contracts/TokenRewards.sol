// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title TokenRewards
 * @dev ERC20 token for rewarding donors and verified charities
 */
contract TokenRewards is ERC20, Ownable, Pausable {
    
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    uint256 public rewardRate = 100; // 100 tokens per 1 ETH donated
    
    mapping(address => uint256) public totalDonated;
    mapping(address => uint256) public totalRewarded;
    mapping(address => bool) public isCharityVerified;
    mapping(address => uint256) public charityBonus;

    event TokensRewarded(address indexed recipient, uint256 amount, uint256 donationAmount);
    event CharityVerified(address indexed charity, uint256 bonusRate);
    event RewardRateUpdated(uint256 newRate);

    constructor() ERC20("Veritrax Token", "VTX") {
        _mint(msg.sender, MAX_SUPPLY);
    }

    /**
     * @dev Reward tokens for donation
     */
    function rewardDonation(
        address _donor,
        uint256 _donationAmount
    ) external onlyOwner whenNotPaused {
        require(_donor != address(0), "Invalid donor address");
        require(_donationAmount > 0, "Invalid donation amount");

        uint256 rewardAmount = (_donationAmount * rewardRate) / 1 ether;
        require(totalSupply() + rewardAmount <= MAX_SUPPLY, "Exceeds max supply");

        totalDonated[_donor] += _donationAmount;
        totalRewarded[_donor] += rewardAmount;

        _mint(_donor, rewardAmount);

        emit TokensRewarded(_donor, rewardAmount, _donationAmount);
    }

    /**
     * @dev Reward charity with bonus tokens
     */
    function rewardCharity(
        address _charity,
        uint256 _amount
    ) external onlyOwner whenNotPaused {
        require(_charity != address(0), "Invalid charity address");
        require(isCharityVerified[_charity], "Charity not verified");
        require(_amount > 0, "Invalid amount");

        uint256 bonusAmount = (_amount * charityBonus[_charity]) / 100;
        uint256 totalReward = _amount + bonusAmount;

        require(totalSupply() + totalReward <= MAX_SUPPLY, "Exceeds max supply");

        _mint(_charity, totalReward);

        emit TokensRewarded(_charity, totalReward, _amount);
    }

    /**
     * @dev Verify charity and set bonus rate
     */
    function verifyCharity(
        address _charity,
        uint256 _bonusRate
    ) external onlyOwner {
        require(_charity != address(0), "Invalid charity address");
        require(_bonusRate <= 50, "Bonus rate too high");

        isCharityVerified[_charity] = true;
        charityBonus[_charity] = _bonusRate;

        emit CharityVerified(_charity, _bonusRate);
    }

    /**
     * @dev Update reward rate
     */
    function updateRewardRate(uint256 _newRate) external onlyOwner {
        require(_newRate > 0, "Invalid rate");
        rewardRate = _newRate;
        emit RewardRateUpdated(_newRate);
    }

    /**
     * @dev Pause token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Get donor stats
     */
    function getDonorStats(address _donor) external view returns (
        uint256 donated,
        uint256 rewarded,
        uint256 balance
    ) {
        return (
            totalDonated[_donor],
            totalRewarded[_donor],
            balanceOf(_donor)
        );
    }

    /**
     * @dev Override transfer to add pause functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}

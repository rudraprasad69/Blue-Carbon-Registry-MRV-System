// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title CarbonCredit
 * @dev ERC-20 token representing verified verified blue carbon credits
 * Each token = 1 ton CO2e sequestered in blue carbon ecosystems
 */
contract CarbonCredit is ERC20, ERC20Burnable, Ownable {
    
    // Metadata
    string public constant ECOSYSTEM_TYPE = "Blue Carbon";
    uint256 public constant DECIMALS = 18;
    
    // Credit tracking
    mapping(uint256 => CreditMetadata) public creditMetadata;
    mapping(uint256 => bool) public retiredCredits;
    uint256 private creditCounter;
    
    // Event tracking
    event CreditIssued(
        uint256 indexed creditId,
        address indexed projectOwner,
        uint256 amount,
        uint256 sequestrationRate,
        string methodology
    );
    
    event CreditRetired(
        uint256 indexed creditId,
        address indexed retirer,
        uint256 amount,
        string reason
    );
    
    event CreditTransferred(
        uint256 indexed creditId,
        address indexed from,
        address indexed to,
        uint256 amount
    );
    
    struct CreditMetadata {
        uint256 creditId;
        address projectOwner;
        string projectName;
        string location;
        uint256 issuanceDate;
        uint256 verificationDate;
        uint256 sequestrationRate; // tons CO2e per hectare per year
        uint256 biodiversityScore;
        string dataSource; // satellite, sensor, field data
        string methodology; // Verra, Gold Standard, etc
        bool isRetired;
        uint256 totalAmount;
    }
    
    constructor() ERC20("Blue Carbon Credit", "BCC") {
        creditCounter = 0;
    }
    
    /**
     * @dev Issue new carbon credits for a verified project
     * @param projectOwner Address of project owner
     * @param projectName Name of the carbon project
     * @param location Geographic location
     * @param amount Number of credits to issue (in tons CO2e)
     * @param sequestrationRate Annual sequestration rate
     * @param methodology Methodology used (Verra, Gold Standard, etc)
     */
    function issueCredits(
        address projectOwner,
        string memory projectName,
        string memory location,
        uint256 amount,
        uint256 sequestrationRate,
        string memory methodology
    ) public onlyOwner returns (uint256 creditId) {
        require(projectOwner != address(0), "Invalid project owner");
        require(amount > 0, "Amount must be greater than 0");
        
        creditId = creditCounter++;
        
        // Create metadata
        creditMetadata[creditId] = CreditMetadata({
            creditId: creditId,
            projectOwner: projectOwner,
            projectName: projectName,
            location: location,
            issuanceDate: block.timestamp,
            verificationDate: block.timestamp,
            sequestrationRate: sequestrationRate,
            biodiversityScore: 0, // To be updated based on monitoring
            dataSource: "multi-source",
            methodology: methodology,
            isRetired: false,
            totalAmount: amount
        });
        
        // Mint tokens
        _mint(projectOwner, amount * 10 ** decimals());
        
        emit CreditIssued(
            creditId,
            projectOwner,
            amount,
            sequestrationRate,
            methodology
        );
        
        return creditId;
    }
    
    /**
     * @dev Retire carbon credits (remove from circulation)
     * @param creditId ID of the credit batch
     * @param amount Number of credits to retire
     * @param reason Reason for retirement
     */
    function retireCredits(
        uint256 creditId,
        uint256 amount,
        string memory reason
    ) public {
        require(creditMetadata[creditId].projectOwner != address(0), "Invalid credit ID");
        require(balanceOf(msg.sender) >= amount * 10 ** decimals(), "Insufficient balance");
        
        // Burn tokens
        burn(amount * 10 ** decimals());
        
        // Mark as retired
        retiredCredits[creditId] = true;
        creditMetadata[creditId].isRetired = true;
        
        emit CreditRetired(creditId, msg.sender, amount, reason);
    }
    
    /**
     * @dev Get credit metadata
     */
    function getCreditMetadata(uint256 creditId) 
        public 
        view 
        returns (CreditMetadata memory) 
    {
        require(creditMetadata[creditId].projectOwner != address(0), "Invalid credit ID");
        return creditMetadata[creditId];
    }
    
    /**
     * @dev Check if credit is retired
     */
    function isCreditRetired(uint256 creditId) public view returns (bool) {
        return retiredCredits[creditId];
    }
    
    /**
     * @dev Get total issued credits
     */
    function getTotalCreditsIssued() public view returns (uint256) {
        return creditCounter;
    }
    
    /**
     * @dev Override decimals to 18
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}

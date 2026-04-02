// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CarbonCredit.sol";

/**
 * @title CarbonCreditIssuer
 * @dev Manages automated credit issuance based on verified monitoring data
 */
contract CarbonCreditIssuer {
    
    CarbonCredit public carbonCreditToken;
    address public admin;
    uint256 public verificationThreshold = 70; // 70% confidence minimum
    
    // Project verification tracking
    mapping(string => ProjectVerification) public projectVerifications;
    mapping(string => bool) public verifiedProjects;
    
    // Issuance history
    mapping(string => IssuanceRecord[]) public issuanceHistory;
    
    event ProjectVerified(
        string indexed projectId,
        uint256 carbonSequestered,
        uint256 confidence,
        string methodology
    );
    
    event CreditsIssued(
        string indexed projectId,
        uint256 creditAmount,
        uint256 timestamp,
        address indexed recipient
    );
    
    event VerificationThresholdUpdated(uint256 newThreshold);
    
    struct ProjectVerification {
        string projectId;
        string projectName;
        address projectOwner;
        uint256 carbonSequestered; // tons CO2e
        uint256 confidence; // 0-100
        uint256 verificationDate;
        string dataSource;
        string methodology;
        bool isVerified;
        string ipfsHash; // Store full verification data on IPFS
    }
    
    struct IssuanceRecord {
        uint256 creditAmount;
        uint256 issuanceDate;
        uint256 tokenPrice;
        address recipientAddress;
        string verificationHash;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
    constructor(address _carbonCreditToken) {
        carbonCreditToken = CarbonCredit(_carbonCreditToken);
        admin = msg.sender;
    }
    
    /**
     * @dev Verify monitoring data and issue credits
     * @param projectId Unique project identifier
     * @param projectName Human-readable project name
     * @param projectOwner Address receiving credits
     * @param carbonSequestered Tons of CO2e sequestered (verified)
     * @param confidence Verification confidence 0-100
     * @param methodology Methodology used (Verra, Gold Standard, etc)
     * @param dataSource Data source used (satellite, sensor, field)
     */
    function verifyAndIssueCredits(
        string memory projectId,
        string memory projectName,
        address projectOwner,
        uint256 carbonSequestered,
        uint256 confidence,
        string memory methodology,
        string memory dataSource,
        string memory ipfsHash
    ) external onlyAdmin returns (bool) {
        
        require(projectOwner != address(0), "Invalid project owner");
        require(carbonSequestered > 0, "Carbon sequestered must be > 0");
        require(confidence >= verificationThreshold, "Confidence below threshold");
        require(confidence <= 100, "Confidence must be <= 100");
        
        // Store verification
        ProjectVerification memory verification = ProjectVerification({
            projectId: projectId,
            projectName: projectName,
            projectOwner: projectOwner,
            carbonSequestered: carbonSequestered,
            confidence: confidence,
            verificationDate: block.timestamp,
            dataSource: dataSource,
            methodology: methodology,
            isVerified: true,
            ipfsHash: ipfsHash
        });
        
        projectVerifications[projectId] = verification;
        verifiedProjects[projectId] = true;
        
        emit ProjectVerified(projectId, carbonSequestered, confidence, methodology);
        
        // Issue credits (1 credit = 1 ton CO2e)
        _issueCreditsToProject(projectId, projectName, projectOwner, carbonSequestered);
        
        return true;
    }
    
    /**
     * @dev Internal function to issue credits via ERC-20 contract
     */
    function _issueCreditsToProject(
        string memory projectId,
        string memory projectName,
        address projectOwner,
        uint256 amount
    ) internal {
        
        uint256 creditId = carbonCreditToken.issueCredits(
            projectOwner,
            projectName,
            "Blue Carbon Ecosystem",
            amount,
            50, // 50 tons CO2e per hectare per year (average for mangroves)
            "Multi-source Verification"
        );
        
        // Record issuance
        issuanceHistory[projectId].push(IssuanceRecord({
            creditAmount: amount,
            issuanceDate: block.timestamp,
            tokenPrice: 15 * 10 ** 18, // $15 per credit (in wei)
            recipientAddress: projectOwner,
            verificationHash: ""
        }));
        
        emit CreditsIssued(projectId, amount, block.timestamp, projectOwner);
    }
    
    /**
     * @dev Get project verification details
     */
    function getProjectVerification(string memory projectId) 
        public 
        view 
        returns (ProjectVerification memory) 
    {
        require(verifiedProjects[projectId], "Project not verified");
        return projectVerifications[projectId];
    }
    
    /**
     * @dev Get issuance history for a project
     */
    function getIssuanceHistory(string memory projectId) 
        public 
        view 
        returns (IssuanceRecord[] memory) 
    {
        return issuanceHistory[projectId];
    }
    
    /**
     * @dev Update verification threshold (requires high confidence for credit issuance)
     */
    function setVerificationThreshold(uint256 _newThreshold) 
        external 
        onlyAdmin 
    {
        require(_newThreshold > 0 && _newThreshold <= 100, "Invalid threshold");
        verificationThreshold = _newThreshold;
        emit VerificationThresholdUpdated(_newThreshold);
    }
    
    /**
     * @dev Check if project is verified
     */
    function isProjectVerified(string memory projectId) 
        public 
        view 
        returns (bool) 
    {
        return verifiedProjects[projectId];
    }
    
    /**
     * @dev Prevent double-counting: only issue credits once per project per period
     */
    function hasProjectIssuedCreditsThisYear(string memory projectId) 
        public 
        view 
        returns (bool) 
    {
        IssuanceRecord[] memory history = issuanceHistory[projectId];
        
        if (history.length == 0) return false;
        
        uint256 oneYearAgo = block.timestamp - 365 days;
        
        for (uint256 i = history.length - 1; i >= 0; i--) {
            if (history[i].issuanceDate > oneYearAgo) {
                return true;
            }
            if (i == 0) break;
        }
        
        return false;
    }
}

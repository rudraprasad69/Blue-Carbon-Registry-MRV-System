/**
 * WEB3 BLOCKCHAIN INTEGRATION
 * 
 * Provides utilities for:
 * - Smart contract interaction (ethers.js)
 * - Wallet connections
 * - Transaction signing and execution
 * - Contract ABIs and addresses
 * - Block explorer integration
 */

import { ethers } from 'ethers'

// ============================================================================
// CONTRACT ABIs
// ============================================================================

export const CARBON_CREDIT_ABI = [
  'function issueCredits(address projectOwner, string projectName, string location, uint256 amount, uint256 sequestrationRate, string methodology) external onlyOwner returns (uint256 creditId)',
  'function retireCredits(uint256 creditId, uint256 amount, string reason) external',
  'function getCreditMetadata(uint256 creditId) external view returns (tuple(uint256 creditId, address projectOwner, string projectName, string location, uint256 issuanceDate, uint256 verificationDate, uint256 sequestrationRate, uint256 biodiversityScore, string dataSource, string methodology, bool isRetired, uint256 totalAmount))',
  'function isCreditRetired(uint256 creditId) external view returns (bool)',
  'function getTotalCreditsIssued() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'event CreditIssued(indexed uint256 creditId, indexed address projectOwner, uint256 amount, uint256 sequestrationRate, string methodology)',
  'event CreditRetired(indexed uint256 creditId, indexed address retirer, uint256 amount, string reason)',
]

export const CARBON_CREDIT_ISSUER_ABI = [
  'function verifyAndIssueCredits(string projectId, string projectName, address projectOwner, uint256 carbonSequestered, uint256 confidence, string methodology, string dataSource, string ipfsHash) external onlyAdmin returns (bool)',
  'function getProjectVerification(string projectId) external view returns (tuple(string projectId, string projectName, address projectOwner, uint256 carbonSequestered, uint256 confidence, uint256 verificationDate, string dataSource, string methodology, bool isVerified, string ipfsHash))',
  'function getIssuanceHistory(string projectId) external view returns (tuple(uint256 creditAmount, uint256 issuanceDate, uint256 tokenPrice, address recipientAddress, string verificationHash)[])',
  'function setVerificationThreshold(uint256 _newThreshold) external onlyAdmin',
  'function isProjectVerified(string projectId) external view returns (bool)',
  'function hasProjectIssuedCreditsThisYear(string projectId) external view returns (bool)',
  'event ProjectVerified(indexed string projectId, uint256 carbonSequestered, uint256 confidence, string methodology)',
  'event CreditsIssued(indexed string projectId, uint256 creditAmount, uint256 timestamp, indexed address recipient)',
]

export const CARBON_MARKETPLACE_ABI = [
  'function createOrder(uint8 orderType, uint256 creditAmount, uint256 pricePerCredit) external returns (uint256 orderId)',
  'function cancelOrder(uint256 orderId) external',
  'function getOpenOrders(uint8 orderType) external view returns (tuple(uint256 orderId, address user, uint8 orderType, uint256 creditAmount, uint256 creditAmountFilled, uint256 pricePerCredit, uint8 status, uint256 createdAt, uint256 expiresAt)[])',
  'function getCurrentPrice() external view returns (uint256)',
  'function getTradeHistory(uint256 limit) external view returns (tuple(address buyer, address seller, uint256 creditAmount, uint256 pricePerCredit, uint256 totalPrice, uint256 timestamp, uint256 buyOrderId, uint256 sellOrderId)[])',
  'event OrderCreated(indexed uint256 orderId, indexed address user, uint8 orderType, uint256 amount, uint256 pricePerCredit)',
  'event OrderFilled(indexed uint256 orderId, indexed address buyer, indexed address seller, uint256 amount, uint256 pricePerCredit)',
  'event OrderCancelled(indexed uint256 orderId)',
  'event TradeExecuted(indexed address buyer, indexed address seller, uint256 creditAmount, uint256 totalPrice, uint256 timestamp)',
]

// ============================================================================
// BLOCKCHAIN CONFIGURATION
// ============================================================================

export const BLOCKCHAIN_CONFIG = {
  // Ethereum Mainnet
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.NEXT_PUBLIC_ETH_MAINNET_RPC || 'https://eth-mainnet.alchemyapi.io/v2/demo',
    blockExplorer: 'https://etherscan.io',
  },
  
  // Sepolia Testnet
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC || 'https://eth-sepolia.alchemyapi.io/v2/demo',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  
  // Polygon Mainnet (for scale)
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC || 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
  },
  
  // Polygon Mumbai Testnet
  mumbai: {
    chainId: 80001,
    name: 'Mumbai Testnet',
    rpcUrl: process.env.NEXT_PUBLIC_MUMBAI_RPC || 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com',
  },
  
  // Local Development
  localhost: {
    chainId: 31337,
    name: 'Local Hardhat',
    rpcUrl: process.env.NEXT_PUBLIC_LOCAL_RPC || 'http://localhost:8545',
    blockExplorer: 'http://localhost:8545',
  },
}

// ============================================================================
// SMART CONTRACT ADDRESSES (PLACEHOLDER - Update after deployment)
// ============================================================================

export const CONTRACT_ADDRESSES = {
  sepolia: {
    carbonCredit: process.env.NEXT_PUBLIC_CARBON_CREDIT_SEPOLIA || '0x0000000000000000000000000000000000000000',
    carbonCreditIssuer: process.env.NEXT_PUBLIC_ISSUER_SEPOLIA || '0x0000000000000000000000000000000000000000',
    carbonMarketplace: process.env.NEXT_PUBLIC_MARKETPLACE_SEPOLIA || '0x0000000000000000000000000000000000000000',
    stablecoin: process.env.NEXT_PUBLIC_USDC_SEPOLIA || '0x0000000000000000000000000000000000000000',
  },
  mainnet: {
    carbonCredit: process.env.NEXT_PUBLIC_CARBON_CREDIT_MAINNET || '0x0000000000000000000000000000000000000000',
    carbonCreditIssuer: process.env.NEXT_PUBLIC_ISSUER_MAINNET || '0x0000000000000000000000000000000000000000',
    carbonMarketplace: process.env.NEXT_PUBLIC_MARKETPLACE_MAINNET || '0x0000000000000000000000000000000000000000',
    stablecoin: process.env.NEXT_PUBLIC_USDC_MAINNET || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Real USDC on mainnet
  },
}

// ============================================================================
// WEB3 PROVIDER & SIGNER UTILITIES
// ============================================================================

/**
 * Get provider for specified chain
 */
export function getProvider(chainId: number = 11155111) {
  const config = Object.values(BLOCKCHAIN_CONFIG).find(c => c.chainId === chainId)
  if (!config) throw new Error(`Unknown chain ID: ${chainId}`)
  
  return new ethers.JsonRpcProvider(config.rpcUrl)
}

/**
 * Get signer from wallet
 */
export async function getSigner(provider: ethers.BrowserProvider) {
  try {
    return await provider.getSigner()
  } catch (error) {
    console.error('Failed to get signer:', error)
    throw new Error('Wallet not connected or not available')
  }
}

/**
 * Get contract instance
 */
export function getContract(
  contractAddress: string,
  abi: string[],
  provider: ethers.JsonRpcProvider | ethers.BrowserProvider,
  signer?: ethers.Signer
) {
  return new ethers.Contract(contractAddress, abi, signer || provider)
}

// ============================================================================
// CARBON CREDIT CONTRACT FUNCTIONS
// ============================================================================

/**
 * Issue new carbon credits
 */
export async function issueCredits(
  signerOrProvider: ethers.Signer | ethers.BrowserProvider,
  contractAddress: string,
  projectData: {
    projectOwner: string
    projectName: string
    location: string
    amount: number
    sequestrationRate: number
    methodology: string
  }
): Promise<ethers.ContractTransactionResponse | null> {
  try {
    const signer = signerOrProvider instanceof ethers.Signer 
      ? signerOrProvider 
      : await getSigner(signerOrProvider as ethers.BrowserProvider)
    
    const contract = getContract(contractAddress, CARBON_CREDIT_ABI, signer as ethers.JsonRpcProvider, signer)
    
    const tx = await contract.issueCredits(
      projectData.projectOwner,
      projectData.projectName,
      projectData.location,
      ethers.parseUnits(projectData.amount.toString(), 18),
      projectData.sequestrationRate,
      projectData.methodology
    )
    
    return tx
  } catch (error) {
    console.error('Failed to issue credits:', error)
    throw error
  }
}

/**
 * Retire carbon credits
 */
export async function retireCredits(
  signerOrProvider: ethers.Signer | ethers.BrowserProvider,
  contractAddress: string,
  creditId: number,
  amount: number,
  reason: string
): Promise<ethers.ContractTransactionResponse | null> {
  try {
    const signer = signerOrProvider instanceof ethers.Signer 
      ? signerOrProvider 
      : await getSigner(signerOrProvider as ethers.BrowserProvider)
    
    const contract = getContract(contractAddress, CARBON_CREDIT_ABI, signer as ethers.JsonRpcProvider, signer)
    
    const tx = await contract.retireCredits(
      creditId,
      ethers.parseUnits(amount.toString(), 18),
      reason
    )
    
    return tx
  } catch (error) {
    console.error('Failed to retire credits:', error)
    throw error
  }
}

/**
 * Get credit metadata
 */
export async function getCreditMetadata(
  provider: ethers.JsonRpcProvider | ethers.BrowserProvider,
  contractAddress: string,
  creditId: number
) {
  try {
    const contract = getContract(contractAddress, CARBON_CREDIT_ABI, provider)
    const metadata = await contract.getCreditMetadata(creditId)
    return metadata
  } catch (error) {
    console.error('Failed to get credit metadata:', error)
    throw error
  }
}

/**
 * Get user balance
 */
export async function getUserBalance(
  provider: ethers.JsonRpcProvider | ethers.BrowserProvider,
  contractAddress: string,
  userAddress: string
): Promise<bigint> {
  try {
    const contract = getContract(contractAddress, CARBON_CREDIT_ABI, provider)
    const balance = await contract.balanceOf(userAddress)
    return balance
  } catch (error) {
    console.error('Failed to get balance:', error)
    throw error
  }
}

// ============================================================================
// CARBON CREDIT ISSUER FUNCTIONS
// ============================================================================

/**
 * Verify project and issue credits
 */
export async function verifyAndIssueCredits(
  signerOrProvider: ethers.Signer | ethers.BrowserProvider,
  issuerAddress: string,
  projectData: {
    projectId: string
    projectName: string
    projectOwner: string
    carbonSequestered: number
    confidence: number
    methodology: string
    dataSource: string
    ipfsHash: string
  }
): Promise<ethers.ContractTransactionResponse | null> {
  try {
    const signer = signerOrProvider instanceof ethers.Signer 
      ? signerOrProvider 
      : await getSigner(signerOrProvider as ethers.BrowserProvider)
    
    const contract = getContract(issuerAddress, CARBON_CREDIT_ISSUER_ABI, signer as ethers.JsonRpcProvider, signer)
    
    const tx = await contract.verifyAndIssueCredits(
      projectData.projectId,
      projectData.projectName,
      projectData.projectOwner,
      projectData.carbonSequestered,
      projectData.confidence,
      projectData.methodology,
      projectData.dataSource,
      projectData.ipfsHash
    )
    
    return tx
  } catch (error) {
    console.error('Failed to verify and issue credits:', error)
    throw error
  }
}

/**
 * Get project verification details
 */
export async function getProjectVerification(
  provider: ethers.JsonRpcProvider | ethers.BrowserProvider,
  issuerAddress: string,
  projectId: string
) {
  try {
    const contract = getContract(issuerAddress, CARBON_CREDIT_ISSUER_ABI, provider)
    const verification = await contract.getProjectVerification(projectId)
    return verification
  } catch (error) {
    console.error('Failed to get project verification:', error)
    throw error
  }
}

/**
 * Check if project issued credits this year
 */
export async function hasProjectIssuedCreditsThisYear(
  provider: ethers.JsonRpcProvider | ethers.BrowserProvider,
  issuerAddress: string,
  projectId: string
): Promise<boolean> {
  try {
    const contract = getContract(issuerAddress, CARBON_CREDIT_ISSUER_ABI, provider)
    const hasIssued = await contract.hasProjectIssuedCreditsThisYear(projectId)
    return hasIssued
  } catch (error) {
    console.error('Failed to check issuance history:', error)
    throw error
  }
}

// ============================================================================
// TRANSACTION UTILITIES
// ============================================================================

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  provider: ethers.JsonRpcProvider | ethers.BrowserProvider,
  txHash: string,
  confirmations: number = 1
) {
  try {
    const receipt = await provider.waitForTransaction(txHash, confirmations)
    return receipt
  } catch (error) {
    console.error('Transaction failed:', error)
    throw error
  }
}

/**
 * Get transaction status
 */
export async function getTransactionStatus(
  provider: ethers.JsonRpcProvider | ethers.BrowserProvider,
  txHash: string
) {
  try {
    const receipt = await provider.getTransactionReceipt(txHash)
    return receipt
  } catch (error) {
    console.error('Failed to get transaction status:', error)
    throw error
  }
}

/**
 * Estimate gas for function call
 */
export async function estimateGas(contract: ethers.Contract, functionName: string, ...args: any[]) {
  try {
    const gasEstimate = await contract[functionName].estimateGas(...args)
    return gasEstimate
  } catch (error) {
    console.error('Failed to estimate gas:', error)
    throw error
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format address
 */
export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Parse currency to wei
 */
export function toWei(amount: string | number, decimals: number = 18): bigint {
  return ethers.parseUnits(amount.toString(), decimals)
}

/**
 * Parse wei to currency
 */
export function fromWei(amount: bigint, decimals: number = 18): string {
  return ethers.formatUnits(amount, decimals)
}

/**
 * Get block explorer URL
 */
export function getBlockExplorerUrl(chainId: number, txHash: string): string {
  const config = Object.values(BLOCKCHAIN_CONFIG).find(c => c.chainId === chainId)
  if (!config) return '#'
  return `${config.blockExplorer}/tx/${txHash}`
}

export default {
  CARBON_CREDIT_ABI,
  CARBON_CREDIT_ISSUER_ABI,
  CARBON_MARKETPLACE_ABI,
  BLOCKCHAIN_CONFIG,
  CONTRACT_ADDRESSES,
  getProvider,
  getSigner,
  getContract,
  issueCredits,
  retireCredits,
  getCreditMetadata,
  getUserBalance,
  verifyAndIssueCredits,
  getProjectVerification,
  hasProjectIssuedCreditsThisYear,
  waitForTransaction,
  getTransactionStatus,
  estimateGas,
  formatAddress,
  toWei,
  fromWei,
  getBlockExplorerUrl,
}

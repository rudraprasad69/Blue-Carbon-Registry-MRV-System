export interface WalletTransaction {
  id: string
  hash: string
  type: "buy" | "sell" | "transfer"
  credits: number
  amount: number
  project: string
  status: "confirmed" | "pending" | "failed"
  confirmations: number
  gasUsed: number
  timestamp: string
  blockNumber: number
}

export interface WalletState {
  address: string
  balance: number
  ethValue: number
  connectedAt: string
  networkVerified: boolean
}

export interface NetworkStatus {
  chain: string
  chainId: number
  status: "healthy" | "congested"
  blockTime: number
  lastBlock: number
  gasPrice: {
    standard: number
    fast: number
    urgent: number
  }
  lastUpdated: string
}

export function formatWalletAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function estimateGasCost(gasPrice: number, gasLimit = 21000): number {
  return (gasPrice * gasLimit) / 1e9
}

export function getConfirmationStatus(confirmations: number): {
  status: "pending" | "confirmed" | "finalized"
  isComplete: boolean
} {
  if (confirmations === 0) {
    return { status: "pending", isComplete: false }
  } else if (confirmations < 12) {
    return { status: "confirmed", isComplete: false }
  } else {
    return { status: "finalized", isComplete: true }
  }
}

export function calculateTransactionCost(credits: number, pricePerCredit: number, gasCost: number): number {
  return credits * pricePerCredit + gasCost
}

export function validateWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

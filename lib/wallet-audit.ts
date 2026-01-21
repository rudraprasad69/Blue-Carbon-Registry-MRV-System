export interface WalletAuditEvent {
  id: string
  timestamp: string
  action: "connect" | "disconnect" | "transaction_initiated" | "transaction_confirmed" | "transaction_failed"
  status: "completed" | "pending" | "failed"
  details: string
  actor: string
  walletAddress: string
  transactionHash?: string
  blockNumber?: number
}

export const createAuditEvent = (
  action: WalletAuditEvent["action"],
  status: WalletAuditEvent["status"],
  details: string,
  actor: string,
  walletAddress: string,
  transactionHash?: string,
  blockNumber?: number,
): WalletAuditEvent => {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    action,
    status,
    details,
    actor,
    walletAddress,
    transactionHash,
    blockNumber,
  }
}

export const mockAuditEvents: WalletAuditEvent[] = [
  {
    id: "audit-001",
    timestamp: new Date(Date.now() - 60 * 1000).toISOString(),
    action: "transaction_initiated",
    status: "completed",
    details: "Initiated transaction to purchase 500 carbon credits from Sundarbans project",
    actor: "User (0x1234...5678)",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    transactionHash: "0xabcd1234ef5678gh...",
  },
  {
    id: "audit-002",
    timestamp: new Date(Date.now() - 45 * 1000).toISOString(),
    action: "transaction_confirmed",
    status: "completed",
    details: "Transaction confirmed on blockchain after 12 confirmations",
    actor: "System",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    blockNumber: 19284710,
  },
]

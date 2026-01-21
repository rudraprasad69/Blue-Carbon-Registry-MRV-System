export interface TrackedTransaction {
  id: string
  hash: string
  status: "pending" | "confirming" | "confirmed" | "failed"
  confirmations: number
  requiredConfirmations: number
  gasUsed: number
  timestamp: string
  project: string
  credits: number
  amount: number
  lastUpdated: string
  estimatedCompletionTime?: string
}

export const updateTransactionStatus = (tx: TrackedTransaction, newConfirmations: number): TrackedTransaction => {
  const status: TrackedTransaction["status"] =
    newConfirmations === 0 ? "pending" : newConfirmations < tx.requiredConfirmations ? "confirming" : "confirmed"

  return {
    ...tx,
    confirmations: newConfirmations,
    status,
    lastUpdated: new Date().toISOString(),
  }
}

export const calculateEstimatedTime = (confirmations: number, requiredConfirmations: number): string => {
  const remaining = requiredConfirmations - confirmations
  const avgBlockTime = 12.5
  const secondsRemaining = remaining * avgBlockTime
  const minutes = Math.ceil(secondsRemaining / 60)

  if (minutes <= 0) return "Confirmed"
  if (minutes === 1) return "~1 minute remaining"
  return `~${minutes} minutes remaining`
}

export const mockTrackedTransactions: TrackedTransaction[] = [
  {
    id: "track-001",
    hash: "0xabcd1234ef5678gh...",
    status: "confirming",
    confirmations: 8,
    requiredConfirmations: 12,
    gasUsed: 0.0082,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    project: "Sundarbans Mangrove Restoration",
    credits: 500,
    amount: 12500,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "track-002",
    hash: "0xefgh5678ijkl9012...",
    status: "confirmed",
    confirmations: 15,
    requiredConfirmations: 12,
    gasUsed: 0.0076,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    project: "Seagrass Meadow Conservation",
    credits: 750,
    amount: 13500,
    lastUpdated: new Date().toISOString(),
  },
]

export interface ChainSync {
  chain: string
  chainId: number
  status: "synced" | "syncing" | "error"
  lastSync: string
  blockHeight: number
  confirmations: number
}

export interface CrossChainBridge {
  id: string
  sourceChain: string
  destChain: string
  amount: number
  hash: string
  status: "pending" | "bridged" | "confirmed"
  timestamp: string
}

export const supportedChains: ChainSync[] = [
  {
    chain: "Ethereum",
    chainId: 1,
    status: "synced",
    lastSync: new Date().toISOString(),
    blockHeight: 19284726,
    confirmations: 12,
  },
  {
    chain: "Polygon",
    chainId: 137,
    status: "synced",
    lastSync: new Date().toISOString(),
    blockHeight: 58230145,
    confirmations: 128,
  },
  {
    chain: "Arbitrum",
    chainId: 42161,
    status: "synced",
    lastSync: new Date().toISOString(),
    blockHeight: 215847292,
    confirmations: 3,
  },
]

export const checkCrossChainSync = (bridges: CrossChainBridge[]): number => {
  const synced = bridges.filter((b) => b.status === "confirmed").length
  return (synced / bridges.length) * 100
}

export const estimateBridgeTime = (sourceChain: string, destChain: string): number => {
  const times: Record<string, number> = {
    "Ethereum-Polygon": 150,
    "Ethereum-Arbitrum": 180,
    "Polygon-Arbitrum": 120,
  }
  const key = `${sourceChain}-${destChain}`
  return times[key] || 200
}

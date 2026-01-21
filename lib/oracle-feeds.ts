export interface OracleFeed {
  id: string
  name: string
  provider: string
  ecosystem: string
  price: number
  lastUpdate: string
  confidence: number
  dataAge: number
  status: "healthy" | "delayed" | "error"
}

export interface PriceUpdate {
  timestamp: string
  price: number
  source: string
  chainId: number
}

export const chainlinkOracles: OracleFeed[] = [
  {
    id: "oracle-mgv",
    name: "Mangrove Credit Oracle",
    provider: "Chainlink",
    ecosystem: "mangrove",
    price: 25.8,
    lastUpdate: new Date().toISOString(),
    confidence: 99.2,
    dataAge: 5,
    status: "healthy",
  },
  {
    id: "oracle-sgr",
    name: "Seagrass Credit Oracle",
    provider: "Chainlink",
    ecosystem: "seagrass",
    price: 18.5,
    lastUpdate: new Date().toISOString(),
    confidence: 98.8,
    dataAge: 5,
    status: "healthy",
  },
  {
    id: "oracle-smr",
    name: "Salt Marsh Oracle",
    provider: "Chainlink",
    ecosystem: "saltmarsh",
    price: 22.4,
    lastUpdate: new Date().toISOString(),
    confidence: 98.5,
    dataAge: 5,
    status: "healthy",
  },
  {
    id: "oracle-klp",
    name: "Kelp Forest Oracle",
    provider: "Chainlink",
    ecosystem: "kelp",
    price: 28.8,
    lastUpdate: new Date().toISOString(),
    confidence: 99.1,
    dataAge: 5,
    status: "healthy",
  },
]

export const verifyOracleData = (feed: OracleFeed): boolean => {
  const now = new Date()
  const lastUpdateTime = new Date(feed.lastUpdate)
  const diffMinutes = (now.getTime() - lastUpdateTime.getTime()) / (1000 * 60)

  return diffMinutes < 15 && feed.confidence > 95
}

export const getOracleHealthStatus = (feeds: OracleFeed[]): { healthy: number; delayed: number; error: number } => {
  return {
    healthy: feeds.filter((f) => f.status === "healthy").length,
    delayed: feeds.filter((f) => f.status === "delayed").length,
    error: feeds.filter((f) => f.status === "error").length,
  }
}

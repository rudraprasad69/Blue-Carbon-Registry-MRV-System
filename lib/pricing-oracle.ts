export interface OraclePriceData {
  ecosystem: string
  price: number
  timestamp: string
  confidence: number
  source: string
  dataAge: number
}

export interface PriceHistory {
  timestamp: string
  prices: Record<string, number>
}

export const mockOraclePrices: OraclePriceData[] = [
  {
    ecosystem: "mangrove",
    price: 25.8,
    timestamp: new Date().toISOString(),
    confidence: 99.2,
    source: "Chainlink Oracle",
    dataAge: 5,
  },
  {
    ecosystem: "seagrass",
    price: 18.5,
    timestamp: new Date().toISOString(),
    confidence: 98.8,
    source: "Chainlink Oracle",
    dataAge: 5,
  },
  {
    ecosystem: "saltmarsh",
    price: 22.4,
    timestamp: new Date().toISOString(),
    confidence: 98.5,
    source: "Chainlink Oracle",
    dataAge: 5,
  },
  {
    ecosystem: "kelp",
    price: 28.8,
    timestamp: new Date().toISOString(),
    confidence: 99.1,
    source: "Chainlink Oracle",
    dataAge: 5,
  },
]

export const calculatePriceImpact = (inputAmount: number, poolLiquidity: number): number => {
  return (inputAmount / poolLiquidity) * 100
}

export const estimateMinimumReceived = (outputAmount: number, slippage: number): number => {
  return outputAmount * (1 - slippage / 100)
}

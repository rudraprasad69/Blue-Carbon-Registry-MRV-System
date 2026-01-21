export interface SmartContractCall {
  contractAddress: string
  functionName: string
  parameters: Record<string, any>
  gasEstimate: number
  value?: string
}

export interface ContractExecutionResult {
  success: boolean
  transactionHash: string
  blockNumber: number
  gasUsed: number
  timestamp: string
}

export const estimateGas = (functionComplexity: "simple" | "medium" | "complex", dataSize: number): number => {
  const baseGas = 21000
  const complexityGas = {
    simple: 50000,
    medium: 150000,
    complex: 300000,
  }
  return baseGas + complexityGas[functionComplexity] + dataSize * 16
}

export const generateContractCallData = (contract: SmartContractCall): string => {
  return `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
}

export const verifyContractExecution = (hash: string, expectedResult: string): boolean => {
  return hash.startsWith("0x") && hash.length === 66
}

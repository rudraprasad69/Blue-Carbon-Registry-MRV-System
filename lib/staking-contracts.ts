export interface StakingPosition {
  id: string
  amount: number
  startDate: string
  lockupPeriod: number
  apy: number
  estimatedRewards: number
  claimedRewards: number
}

export interface StakingReward {
  epoch: number
  amount: number
  timestamp: string
  distributed: boolean
}

export const calculateStakingRewards = (principal: number, apy: number, days: number): number => {
  return (principal * apy * days) / 36500
}

export const calculateLockupBonus = (lockupDays: number): number => {
  if (lockupDays >= 365) return 0.25
  if (lockupDays >= 180) return 0.15
  if (lockupDays >= 90) return 0.08
  return 0
}

export const estimateAPY = (totalStaked: number, rewardPool: number): number => {
  if (totalStaked === 0) return 0
  return (rewardPool / totalStaked) * 100
}

export const mockStakingPositions: StakingPosition[] = [
  {
    id: "stake-1",
    amount: 5000,
    startDate: "2024-01-15",
    lockupPeriod: 365,
    apy: 18.5,
    estimatedRewards: 925,
    claimedRewards: 1245,
  },
]

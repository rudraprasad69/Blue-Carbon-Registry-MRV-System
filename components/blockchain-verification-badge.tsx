"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BlockchainVerificationBadgeProps {
  verified: boolean
  chainId?: number
  blockNumber?: number
  confidence?: number
}

export function BlockchainVerificationBadge({
  verified,
  chainId = 1,
  blockNumber,
  confidence = 98,
}: BlockchainVerificationBadgeProps) {
  const chainName = chainId === 1 ? "Ethereum" : "Unknown"

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            className={`cursor-help ${
              verified
                ? "bg-green-500/20 text-green-700 dark:text-green-400"
                : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
            }`}
          >
            {verified ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
            {verified ? "Verified" : "Verifying"}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="w-48">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="font-medium">{chainName} Mainnet</span>
            </div>
            <div className="text-xs space-y-1">
              <p>Chain ID: {chainId}</p>
              {blockNumber && <p>Block: #{blockNumber}</p>}
              <p>Confidence: {confidence}%</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

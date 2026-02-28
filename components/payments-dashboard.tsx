"use client"

import { StablecoinIntegration } from "./stablecoin-integration"
import { FiatOnRamp } from "./fiat-on-ramp"
import { RealtimePayments } from "./realtime-payments"
import { CommunityWallet } from "./community-wallet"

export function PaymentsDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold tracking-tight">Payment & Settlement System</h2>
        <p className="text-muted-foreground">
            A secure and efficient system for carbon credit transactions.
        </p>
      </div>
      <StablecoinIntegration />
      <FiatOnRamp />
      <RealtimePayments />
      <CommunityWallet />
    </div>
  )
}

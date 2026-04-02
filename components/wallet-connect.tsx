"use client"

import React from 'react'

// Lightweight stub until wagmi/rainbowkit versions are stabilized.
export function WalletConnect() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <button className="px-3 py-1 rounded bg-primary text-primary-foreground">Connect Wallet</button>
    </div>
  )
}

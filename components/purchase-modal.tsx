"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PurchaseModalProps {
  credit: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PurchaseModal({ credit, open, onOpenChange }: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  const totalPrice = credit.price * quantity
  const gasEstimate = (totalPrice * 0.02).toFixed(2)

  const handlePurchase = async () => {
    setIsProcessing(true)
    // Simulate blockchain transaction
    setTimeout(() => {
      const hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
      setTransactionHash(hash)
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Carbon Credits</DialogTitle>
          <DialogDescription>{credit.projectName}</DialogDescription>
        </DialogHeader>

        {!transactionHash ? (
          <div className="space-y-6">
            {/* Project Summary */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Project</p>
              <p className="font-semibold text-foreground">{credit.projectName}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {credit.ecosystem} • {credit.location}
              </p>
            </div>

            {/* Quantity Input */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Number of Credits</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  −
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(credit.availableCredits, quantity + 1))}
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{credit.availableCredits} available</p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per credit</span>
                <span className="font-medium text-foreground">${credit.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium text-foreground">{quantity}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-semibold text-foreground">Subtotal</span>
                <span className="font-bold text-lg text-primary">${totalPrice}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Est. Gas Fee</span>
                <span>~${gasEstimate}</span>
              </div>
            </div>

            {/* Warning */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                This transaction will be recorded on the blockchain. Verify all details before confirming.
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isProcessing ? "Processing..." : "Confirm Purchase"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-bold text-lg text-foreground mb-2">Purchase Confirmed!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {quantity} carbon credits have been added to your portfolio
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
              <p className="text-xs text-muted-foreground">Transaction Hash</p>
              <p className="font-mono text-xs text-foreground break-all">{transactionHash}</p>
            </div>

            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              View Portfolio
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

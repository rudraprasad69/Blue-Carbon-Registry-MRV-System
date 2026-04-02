// components/stablecoin-payment.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  getWalletBalance,
  makePayment,
  PaymentResult,
} from '@/lib/stablecoin-payment-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const StablecoinPayment = () => {
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(
    null
  );

  useEffect(() => {
    const fetchBalance = async () => {
      const userBalance = await getWalletBalance('user-wallet');
      setBalance(userBalance);
    };
    fetchBalance();
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setPaymentResult(null);

    const result = await makePayment('user-wallet', 'project-wallet', amount);

    setPaymentResult(result);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'Payment Successful',
        description: `Transaction ID: ${result.transactionId}`,
      });
      // Refresh balance after successful payment
      const userBalance = await getWalletBalance('user-wallet');
      setBalance(userBalance);
    } else {
      toast({
        title: 'Payment Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stablecoin Payment (USDC)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="text-lg font-semibold text-white">Your Wallet Balance:</p>
            <p className="text-3xl font-bold text-green-400">{balance.toFixed(2)} USDC</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount-input">Amount to Pay</Label>
            <Input
              id="amount-input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount in USDC"
              className="w-full"
            />
          </div>

          <Button onClick={handlePayment} disabled={loading} className="w-full">
            {loading ? 'Processing Transaction...' : `Pay ${amount} USDC`}
          </Button>

          {paymentResult && (
            <div
              className={`p-4 rounded-lg ${
                paymentResult.success ? 'bg-green-900' : 'bg-red-900'
              }`}
            >
              <h3 className="font-bold">Transaction Result</h3>
              {paymentResult.success ? (
                <p className="break-all">
                  Success! Transaction ID: {paymentResult.transactionId}
                </p>
              ) : (
                <p>Error: {paymentResult.error}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StablecoinPayment;

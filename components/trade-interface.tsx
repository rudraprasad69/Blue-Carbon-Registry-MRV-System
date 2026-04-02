// components/trade-interface.tsx
'use client';

import { useState } from 'react';
import { executeTrade } from '@/lib/trading-platform-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TradeInterface = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState<number>(10);
  const [price, setPrice] = useState<number>(25);
  const [loading, setLoading] = useState(false);

  const handleTrade = async (type: 'buy' | 'sell') => {
    setLoading(true);
    const result = await executeTrade(type, amount, price);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'Trade Executed',
        description: result.message,
      });
    } else {
      toast({
        title: 'Trade Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <div className="pt-6 space-y-4">
            <div>
              <Label htmlFor="price-input">Price (USDC)</Label>
              <Input
                id="price-input"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="amount-input">Amount (Credits)</Label>
              <Input
                id="amount-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <TabsContent value="buy">
              <Button
                onClick={() => handleTrade('buy')}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Placing Order...' : 'Buy'}
              </Button>
            </TabsContent>
            <TabsContent value="sell">
              <Button
                onClick={() => handleTrade('sell')}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Placing Order...' : 'Sell'}
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradeInterface;

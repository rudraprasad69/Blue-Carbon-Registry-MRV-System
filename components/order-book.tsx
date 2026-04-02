// components/order-book.tsx
'use client';

import { useState, useEffect } from 'react';
import { getOrderBook, OrderBook as IOrderBook, Order } from '@/lib/trading-platform-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrderBook = () => {
  const [orderBook, setOrderBook] = useState<IOrderBook>({ bids: [], asks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderBook = async () => {
      setLoading(true);
      const data = await getOrderBook();
      setOrderBook(data);
      setLoading(false);
    };
    fetchOrderBook();

    // Refresh every 5 seconds to simulate a live market
    const interval = setInterval(fetchOrderBook, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderOrders = (orders: Order[], color: string) => (
    <div className="space-y-1">
      {orders.map((order, index) => (
        <div key={index} className="flex justify-between text-sm">
          <span style={{ color }}>{order.price.toFixed(2)}</span>
          <span>{order.amount.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && !orderBook.bids.length ? (
          <div className="h-[300px] flex items-center justify-center">
            Loading order book...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Price (USDC)</span>
                <span>Amount</span>
              </div>
              {renderOrders(orderBook.bids, '#10b981')}
            </div>
            <div>
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Price (USDC)</span>
                    <span>Amount</span>
                </div>
              {renderOrders(orderBook.asks, '#ef4444')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderBook;

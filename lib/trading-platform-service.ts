// lib/trading-platform-service.ts

export interface Order {
  price: number;
  amount: number; // Amount of carbon credits
}

export interface OrderBook {
  bids: Order[]; // Buy orders
  asks: Order[]; // Sell orders
}

export interface PriceDataPoint {
  date: string;
  price: number;
}

// Generate a random-walk price history
const generatePriceHistory = (): PriceDataPoint[] => {
  const history: PriceDataPoint[] = [];
  let price = 25; // Starting price
  const now = new Date();
  for (let i = 90; i >= 0; i--) {
    price += (Math.random() - 0.49) * 2;
    if (price < 10) price = 10;
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    history.push({ date: date.toISOString().split('T')[0], price: parseFloat(price.toFixed(2)) });
  }
  return history;
};

// Generate a mock order book
const generateOrderBook = (): OrderBook => {
    const bids: Order[] = [];
    const asks: Order[] = [];
    let startPrice = 25 + (Math.random() - 0.5);

    for (let i = 0; i < 20; i++) {
        bids.push({
            price: parseFloat((startPrice - i * 0.1 - Math.random() * 0.1).toFixed(2)),
            amount: parseFloat((Math.random() * 100).toFixed(2)),
        });
        asks.push({
            price: parseFloat((startPrice + i * 0.1 + Math.random() * 0.1).toFixed(2)),
            amount: parseFloat((Math.random() * 100).toFixed(2)),
        });
    }
    return { bids, asks };
};


export const getOrderBook = async (): Promise<OrderBook> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return generateOrderBook();
};

export const getPriceHistory = async (): Promise<PriceDataPoint[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return generatePriceHistory();
};

export const executeTrade = async (type: 'buy' | 'sell', amount: number, price: number): Promise<{success: boolean, message: string}> => {
    console.log(`Executing ${type} trade for ${amount} credits at ${price}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${amount} credits.`}
}

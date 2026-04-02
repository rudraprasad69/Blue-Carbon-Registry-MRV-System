// components/trading-dashboard.tsx

import PriceChart from './price-chart';
import OrderBook from './order-book';
import TradeInterface from './trade-interface';

const TradingDashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Main Chart */}
      <div className="lg:col-span-3">
        <PriceChart />
      </div>

      {/* Trade Interface */}
      <div className="lg:col-span-1">
        <TradeInterface />
      </div>

      {/* Order Book */}
      <div className="lg:col-span-4">
        <OrderBook />
      </div>
    </div>
  );
};

export default TradingDashboard;

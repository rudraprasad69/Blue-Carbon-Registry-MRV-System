// app/dashboard/marketplace/page.tsx

import TradingDashboard from '@/components/trading-dashboard';

const MarketplacePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Carbon Credit Marketplace</h1>
      <p className="mb-6 text-gray-600">
        Trade carbon credits on our decentralized exchange.
      </p>
      <TradingDashboard />
    </div>
  );
};

export default MarketplacePage;

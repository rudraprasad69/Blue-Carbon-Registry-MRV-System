// app/dashboard/payments/page.tsx

import StablecoinPayment from '@/components/stablecoin-payment';

const PaymentsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payments & Settlements</h1>
      <p className="mb-6 text-gray-600">
        Make and manage payments using stablecoins.
      </p>
      <div className="max-w-md mx-auto">
        <StablecoinPayment />
      </div>
    </div>
  );
};

export default PaymentsPage;

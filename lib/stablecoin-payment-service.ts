// lib/stablecoin-payment-service.ts

export interface Wallet {
  address: string;
  balance: number; // Represents the amount of stablecoin (e.g., USDC)
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// In-memory store for wallets, for demonstration purposes.
const wallets: Record<string, Wallet> = {
  'user-wallet': { address: '0xUser123...', balance: 5000 },
  'project-wallet': { address: '0xProject456...', balance: 10000 },
};

export const getWalletBalance = async (walletId: string): Promise<number> => {
  console.log(`Fetching balance for wallet: ${walletId}`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  return wallets[walletId]?.balance || 0;
};

export const makePayment = async (
  fromWalletId: string,
  toWalletId: string,
  amount: number
): Promise<PaymentResult> => {
  console.log(
    `Initiating payment of ${amount} USDC from ${fromWalletId} to ${toWalletId}`
  );
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate blockchain transaction time

  const fromWallet = wallets[fromWalletId];
  const toWallet = wallets[toWalletId];

  if (!fromWallet || !toWallet) {
    return { success: false, error: 'Wallet not found.' };
  }

  if (fromWallet.balance < amount) {
    return { success: false, error: 'Insufficient funds.' };
  }

  // Perform the transaction
  fromWallet.balance -= amount;
  toWallet.balance += amount;

  const transactionId = `0x${[...Array(64)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('')}`;

  console.log(`Payment successful. Transaction ID: ${transactionId}`);

  return {
    success: true,
    transactionId,
  };
};

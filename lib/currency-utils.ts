const USD_TO_INR = 83

export function convertToINR(usdAmount: number): number {
  return Math.round(usdAmount * USD_TO_INR)
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatINRDecimal(amount: number, decimals = 2): string {
  const rounded = Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals)
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(rounded)
}

// src/utils/formatPrice.ts

export const formatPrice = (amount: number): string => {
  if (!amount && amount !== 0) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

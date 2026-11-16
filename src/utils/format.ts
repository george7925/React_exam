export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function discountedPrice(price: number, discountPercentage: number): number {
  return Number((price * (1 - discountPercentage / 100)).toFixed(2));
}

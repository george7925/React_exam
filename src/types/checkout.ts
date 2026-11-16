export interface CheckoutFormValues {
  fullName: string;
  email: string;
  address: string;
  city: string;
}

export interface OrderSummary {
  items: {
    productId: number;
    title: string;
    quantity: number;
    unitPrice: number;
  }[];
  total: number;
  customer: CheckoutFormValues;
  placedAt: string;
}

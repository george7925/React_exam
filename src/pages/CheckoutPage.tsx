import { FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { CheckoutFormValues, OrderSummary } from "../types/checkout";
import { formatPrice } from "../utils/format";
import { FieldErrors, validateCheckout } from "../utils/validation";

export function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [values, setValues] = useState<CheckoutFormValues>({
    fullName: user.username,
    email: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState<FieldErrors<CheckoutFormValues>>({});
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<OrderSummary | null>(null);

  if (!placedOrder && items.length === 0) {
    return (
      <Navigate
        to="/cart"
        state={{ message: "Your cart is empty. Add items before checking out." }}
        replace
      />
    );
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const validationErrors = validateCheckout(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    const summary: OrderSummary = {
      items: items.map((item) => ({
        productId: item.productId,
        title: item.title,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      total: subtotal,
      customer: { ...values },
      placedAt: new Date().toISOString(),
    };

    setPlacedOrder(summary);
    clearCart();
    setSubmitting(false);
  };

  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-emerald-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-4">
            Order Confirmed
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Thank you! Your order has been placed.
          </h1>
          <p className="text-gray-600 mb-6">
            Confirmation sent to <strong>{placedOrder.customer.email}</strong> for delivery to{" "}
            {placedOrder.customer.address}, {placedOrder.customer.city}.
          </p>

          <div className="border-t border-b border-gray-200 py-4 space-y-2 mb-6">
            {placedOrder.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium text-gray-900">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-base text-gray-900">
              <span>Total Paid</span>
              <span>{formatPrice(placedOrder.total)}</span>
            </div>
          </div>

          <Link
            to="/"
            className="min-h-[44px] inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-xs"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-2">Shipping Details</h2>

          <div>
            <label htmlFor="checkout-fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              id="checkout-fullName"
              type="text"
              value={values.fullName}
              onChange={(e) => setValues((prev) => ({ ...prev, fullName: e.target.value }))}
              className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="checkout-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="checkout-email"
              type="email"
              value={values.email}
              onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="checkout-address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              id="checkout-address"
              type="text"
              value={values.address}
              onChange={(e) => setValues((prev) => ({ ...prev, address: e.target.value }))}
              className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>

          <div>
            <label htmlFor="checkout-city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              id="checkout-city"
              type="text"
              value={values.city}
              onChange={(e) => setValues((prev) => ({ ...prev, city: e.target.value }))}
              className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[44px] py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </form>

        {/* Cart Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 pb-4 border-b border-gray-200 text-sm">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-2">
                <span className="text-gray-700 line-clamp-1">
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium text-gray-900 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

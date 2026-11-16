import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const notice = (location.state as { message?: string } | null)?.message;

  const handleClear = () => {
    if (window.confirm("Clear the cart? This cannot be undone.")) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        {notice && (
          <p className="mb-4 inline-block px-4 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-sm">
            {notice}
          </p>
        )}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty.</h1>
        <p className="text-gray-500 mb-6">Add items from the catalog to start your order.</p>
        <Link
          to="/"
          className="min-h-[44px] inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  width={72}
                  height={72}
                  className="w-18 h-18 rounded-lg object-cover bg-gray-100 shrink-0"
                />
                <div>
                  <Link
                    to={`/products/${item.productId}`}
                    className="font-semibold text-gray-900 hover:text-indigo-600"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">{formatPrice(item.price)} each</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="inline-flex items-center border border-gray-300 rounded-lg">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.title}`}
                    disabled={item.quantity <= 1}
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="min-h-[44px] min-w-[44px] font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 rounded-l-lg"
                  >
                    −
                  </button>
                  <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.title}`}
                    disabled={item.quantity >= item.stock}
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="min-h-[44px] min-w-[44px] font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 rounded-r-lg"
                  >
                    +
                  </button>
                </div>

                <span className="font-bold text-gray-900 min-w-[80px] text-right">
                  {formatPrice(item.price * item.quantity)}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="min-h-[44px] px-2 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div>
            <button
              type="button"
              onClick={handleClear}
              className="min-h-[44px] text-sm font-medium text-gray-500 hover:text-red-600 underline"
            >
              Clear cart
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-gray-600 pb-4 border-b border-gray-200">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-emerald-700 font-medium">Free</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-4 text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="w-full min-h-[44px] py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
}

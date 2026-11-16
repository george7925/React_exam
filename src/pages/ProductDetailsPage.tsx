import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError, fetchProductById } from "../api/products.api";
import { AsyncState } from "../types/api";
import { Product } from "../types/product";
import { discountedPrice, formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";
import { NotFoundPage } from "./NotFoundPage";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const numericId = Number(id);
  const isValidId = Boolean(id) && Number.isInteger(numericId) && numericId > 0;

  const [state, setState] = useState<AsyncState<Product>>({ status: "loading" });
  const [isNotFound, setIsNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [cartNotice, setCartNotice] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!isValidId) {
      setIsNotFound(true);
      return;
    }

    const controller = new AbortController();
    setIsNotFound(false);
    setState({ status: "loading" });
    setQuantity(1);
    setCartNotice(null);

    fetchProductById(numericId, controller.signal)
      .then((product) => {
        setState({ status: "success", data: product });
        setSelectedImage(product.images[0] ?? product.thumbnail);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (err instanceof ApiError && err.status === 404) {
          setIsNotFound(true);
          return;
        }
        const message = err instanceof Error ? err.message : "Failed to load product details.";
        setState({ status: "error", message });
      });

    return () => controller.abort();
  }, [isValidId, numericId]);

  if (isNotFound) {
    return <NotFoundPage />;
  }

  if (state.status === "loading" || state.status === "idle") {
    return (
      <div role="status" className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 font-medium mb-4">{state.message}</p>
        <Link to="/" className="text-indigo-600 hover:underline font-medium">
          ← Back to catalog
        </Link>
      </div>
    );
  }

  const product = state.data;
  const finalPrice = discountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage >= 1;
  const gallery = product.images.length > 0 ? product.images : [product.thumbnail];

  const handleAddToCart = () => {
    const result = addItem(product, quantity);
    setCartNotice(result);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="min-h-[44px] inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6"
      >
        ← Back to catalog
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
            <img
              src={selectedImage || product.thumbnail}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={`${imgUrl}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 focus:outline-none ${
                    (selectedImage || product.thumbnail) === imgUrl
                      ? "border-indigo-600"
                      : "border-gray-200 opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.title} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500 capitalize">
              {product.brand ? `${product.brand} · ` : ""}
              {product.category}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{product.title}</h1>

            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="text-amber-600 font-semibold">★ {product.rating.toFixed(1)}</span>
              {product.stock === 0 ? (
                <span className="text-red-600 font-semibold">Out of stock</span>
              ) : product.stock <= 5 ? (
                <span className="text-amber-600 font-semibold">Only {product.stock} left!</span>
              ) : (
                <span className="text-emerald-700 font-semibold">In stock ({product.stock})</span>
              )}
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(finalPrice)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">
                    −{Math.round(product.discountPercentage)}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              {/* Quantity Stepper */}
              <div className="inline-flex items-center border border-gray-300 rounded-lg">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={product.stock === 0 || quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="min-h-[44px] min-w-[44px] text-lg font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-l-lg"
                >
                  −
                </button>
                <span className="px-4 font-semibold text-gray-900 select-none">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={product.stock === 0 || quantity >= product.stock}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="min-h-[44px] min-w-[44px] text-lg font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-r-lg"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                className="flex-1 min-w-[180px] min-h-[44px] px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                {product.stock === 0 ? "Out of stock" : "Add to cart"}
              </button>
            </div>

            {cartNotice && (
              <p
                role="status"
                className={`mt-3 text-sm font-medium ${
                  cartNotice.ok ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {cartNotice.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../types/product";
import { discountedPrice, formatPrice } from "../utils/format";

export interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => { ok: boolean; message: string };
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const finalPrice = discountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage >= 1;

  const handleAddClick = () => {
    const result = onAdd(product);
    setFeedback(result.message);
    window.setTimeout(() => setFeedback(null), 1800);
  };

  return (
    <article className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-4/3 bg-gray-100 overflow-hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          width={320}
          height={240}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            −{Math.round(product.discountPercentage)}%
          </span>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-gray-500 capitalize">
            {product.category}
            {product.brand ? ` · ${product.brand}` : ""}
          </p>
          <Link
            to={`/products/${product.id}`}
            className="mt-1 block font-semibold text-gray-900 line-clamp-1 hover:text-indigo-600 focus:outline-none focus:underline"
          >
            {product.title}
          </Link>

          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-amber-600 font-medium">★ {product.rating.toFixed(1)}</span>
            {product.stock === 0 ? (
              <span className="text-red-600 font-semibold">Out of stock</span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-600 font-semibold">Only {product.stock} left!</span>
            ) : (
              <span className="text-emerald-700 font-medium">In stock</span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">{formatPrice(finalPrice)}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={product.stock === 0}
            onClick={handleAddClick}
            className="w-full min-h-[44px] px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            {product.stock === 0 ? "Out of stock" : feedback ?? "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

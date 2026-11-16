import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products.api";
import { AsyncState } from "../types/api";
import { ProductsResponse } from "../types/product";
import { ProductGrid } from "../components/ProductGrid";
import { useCart } from "../context/CartContext";

export function CatalogPage() {
  const [state, setState] = useState<AsyncState<ProductsResponse>>({ status: "loading" });
  const { addItem } = useCart();

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    fetchProducts(12, 0, controller.signal)
      .then((data) => {
        setState({ status: "success", data });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "Failed to load catalog.";
        setState({ status: "error", message });
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Catalog</h1>
        {state.status === "success" && (
          <p className="text-sm text-gray-500">
            Showing {state.data.products.length} of {state.data.total} products
          </p>
        )}
      </div>

      {state.status === "loading" && (
        <div role="status" className="py-20 text-center text-gray-500">
          Loading products...
        </div>
      )}

      {state.status === "error" && (
        <div role="alert" className="py-12 px-4 bg-red-50 border border-red-200 rounded-xl text-center">
          <p className="text-red-700 font-medium mb-4">{state.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-[44px] px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {state.status === "success" && state.data.products.length === 0 && (
        <div className="py-20 text-center text-gray-500">No products found.</div>
      )}

      {state.status === "success" && state.data.products.length > 0 && (
        <ProductGrid products={state.data.products} onAdd={(p) => addItem(p, 1)} />
      )}
    </div>
  );
}

import { Product, ProductsResponse } from "../types/product";

const BASE_URL = "https://dummyjson.com";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchProducts(limit = 12, skip = 0, signal?: AbortSignal): Promise<ProductsResponse> {
  const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`, { signal });
  if (!response.ok) {
    throw new ApiError(response.status, `Failed to load products (${response.status})`);
  }
  return (await response.json()) as ProductsResponse;
}

export async function fetchProductById(id: number, signal?: AbortSignal): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`, { signal });
  if (!response.ok) {
    throw new ApiError(response.status, response.status === 404 ? "Product not found" : `Request failed (${response.status})`);
  }
  return (await response.json()) as Product;
}

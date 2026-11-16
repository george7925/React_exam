# Debug Log

## Entry 1: Invalid Product IDs Causing Unnecessary API Calls
- **Symptom**: Navigating to `/products/abc` sent a failing network request to `https://dummyjson.com/products/abc` before showing an error.
- **Reproduction**: Open `/products/abc` in the browser address bar with DevTools Network tab open.
- **Tool**: Browser DevTools Network tab & TypeScript compiler.
- **Root Cause**: `useParams()` returns `id` as `string | undefined` without checking if it is a positive integer.
- **Fix**: Added `Number.isInteger(Number(id)) && Number(id) > 0` guard in `ProductDetailsPage.tsx` before calling `fetchProductById`.
- **Lesson Learned**: Validate route parameters client-side before firing network requests.

## Entry 2: Stale State When Navigating Between Product Pages
- **Symptom**: Switching from one product route to another kept previous cart feedback messages visible.
- **Reproduction**: Add a product to cart on `/products/1`, then navigate to `/products/2`.
- **Tool**: React DevTools Components inspector.
- **Root Cause**: Local `cartNotice` and `quantity` states were not reset inside the `useEffect` triggered by `numericId` changes.
- **Fix**: Reset `setQuantity(1)` and `setCartNotice(null)` at the start of the `useEffect` hook in `ProductDetailsPage.tsx`.
- **Lesson Learned**: Component instances persist across dynamic route parameter changes; reset local UI state when route IDs change.

## Entry 3: Corrupted `localStorage` Crashing Cart Initialization
- **Symptom**: Manually editing `shop_cart` in DevTools Application storage to invalid JSON or wrong shape caused runtime errors when reading `.price`.
- **Reproduction**: Set `localStorage.setItem("shop_cart", '{"broken":true}')` and reload `/cart`.
- **Tool**: Browser Console & Application Storage inspector.
- **Root Cause**: `JSON.parse` returns `any` and was trusted without runtime shape verification.
- **Fix**: Added `try/catch` around `JSON.parse` and implemented `isCartItemArray(data: unknown): data is CartItem[]` type guard in `CartContext.tsx`.
- **Lesson Learned**: External data from `localStorage` must always be treated as `unknown` and narrowed with a type guard.

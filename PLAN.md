# 10X Shop — Project Plan

## 1. Goal & Scope
Build a responsive, type-safe single-page e-commerce application (**10X Shop**) implementing all **CORE** requirements across React, TypeScript, Tailwind CSS v4, Optimization/Debugging, and Project Delivery modules.

- **CORE Scope**:
  - Routing & Layout (`/`, `/products/:id`, `/cart`, `/login`, `/checkout`, `*` 404)
  - Public catalog loading from DummyJSON API (`GET /products`)
  - Product details page with image switcher & stock-safe quantity stepper
  - Shared `CartContext` with immutable state updates & `localStorage` persistence
  - Shared `AuthContext` with controlled Login form & `ProtectedRoute` for `/checkout`
  - Controlled Checkout form with inline validation & local order confirmation
  - Strict TypeScript (`strict: true`, zero `any`), `ErrorBoundary`, and responsive Tailwind CSS v4 layout

## 2. Work Breakdown Structure (WBS)
| Epic | Task | Estimate | Week | Definition of Done |
| :--- | :--- | :---: | :---: | :--- |
| Setup & Types | Vite + React + TS + Tailwind v4 setup, strict `tsconfig`, domain types | 3h | Week 1 | `npm run typecheck` & `npm run build` pass with 0 errors |
| Layout & Routing | `BrowserRouter`, `Layout`, `Header`, `Footer`, `NotFoundPage`, `ScrollToTop` | 3h | Week 1 | All routes navigate without reload; active links highlighted |
| Auth & Guard | `AuthContext`, `LoginPage` controlled form, `ProtectedRoute` | 3h | Week 1 | Empty/short inputs show errors; `/checkout` redirects guest to `/login` |
| Catalog | `products.api.ts`, `CatalogPage`, `ProductGrid`, `ProductCard` | 4h | Week 1 | Products render in responsive 1/2/4-col grid; loading/error/empty handled |
| Product Details | `ProductDetailsPage`, image gallery state, stock-bounded stepper | 4h | Week 2 | `/products/:id` displays details; invalid/404 ID renders NotFound |
| Cart | `CartContext` (`shop_cart`), `CartPage`, quantity controls, totals | 4h | Week 2 | Badge and Cart page stay synced; totals recalculate accurately |
| Checkout | `CheckoutPage` 4-field controlled form, validation, confirmation view | 3h | Week 2 | Valid submit shows confirmation & clears cart; invalid blocks submit |
| QA & Docs | Responsive audit (375px–1280px), `ErrorBoundary`, `DEBUG-LOG.md`, `REPORT.md`, Deploy | 4h | Week 3 | Live deploy works on refresh; all docs complete |

## 3. Risks & Mitigations
1. **DummyJSON API downtime or slow response**: Handled via `AsyncState<T>` error UI with Retry button and `AbortController` cleanup.
2. **Corrupted `localStorage` data in `shop_cart`**: Mitigated using a runtime type guard (`isCartItemArray`) inside `try/catch` before hydrating state.
3. **SPA route refresh 404 on static hosting**: Prevented by including `vercel.json` and `public/_redirects` rewrite rules.

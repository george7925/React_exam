# 10X Shop — Final Project Report

## 1. Planned vs Delivered (CORE Checklist)
- [x] **React CORE**: Functional components, `props.children` composition, `map()` with stable keys, controlled Login & Checkout forms, React Router, `AuthContext` & `CartContext` with immutable state updates.
- [x] **TypeScript CORE**: Strict `tsconfig.json`, centralized `src/types/`, zero `any`, type guards for `localStorage`, `npm run typecheck` passes with 0 errors.
- [x] **Tailwind CSS v4 CORE**: Integrated via `@tailwindcss/vite` and `@import "tailwindcss"`, responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`), hover/focus/disabled states, mobile-first layout with zero horizontal overflow at 375px.
- [x] **Optimization & Debugging CORE**: `ErrorBoundary` fallback UI, `AbortController` effect cleanup, image `width`/`height`/`loading="lazy"`, and documented `DEBUG-LOG.md`.
- [x] **Project Process CORE**: `README.md`, `PLAN.md`, `REPORT.md`, `DEBUG-LOG.md`, and SPA deployment config.

## 2. Key Technical Challenges & Solutions
1. **Preventing Over-Stock Cart Additions**: Enforced stock limits both in `ProductDetailsPage` stepper and centrally inside `CartContext.addItem` by checking existing cart quantities before updating state.
2. **Safe Hydration of Persisted Cart State**: Avoided unsafe `as CartItem[]` casting on `JSON.parse` output by writing an explicit `isCartItemArray(data: unknown)` type guard.
3. **Invalid Product Route Handling**: Validated `Number.isInteger(Number(id))` before issuing network requests so routes like `/products/abc` immediately render `NotFoundPage` without unnecessary API calls.

## 3. What I Would Do Differently Next Time
- Add URL-synchronized search, category filtering, and pagination (`useSearchParams`) from the start to support shareable filtered catalog views.
- Introduce route-level code splitting (`React.lazy` + `Suspense`) to keep the initial JavaScript bundle even smaller.

## 4. AI Usage Summary
AI assistance was used to scaffold the Vite + TypeScript + Tailwind CSS v4 boilerplate, structure reusable components, and verify strict TypeScript types. Every generated file was reviewed against the PRD acceptance criteria, typechecked with `tsc --noEmit`, and tested across mobile and desktop viewports to ensure full comprehension and reliability.

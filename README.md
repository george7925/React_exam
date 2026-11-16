# 10X Shop

A modern single-page e-commerce web application built with **React 19**, **TypeScript (strict mode)**, **React Router**, and **Tailwind CSS v4**, powered by the public **DummyJSON Products API**.

## Features (CORE)
- **Catalog (`/`)**: Fetches products from DummyJSON API with loading, error, and empty states, responsive grid layout, discount calculations, and stock indicators.
- **Product Details (`/products/:id`)**: Dynamic product view with image gallery switcher, quantity stepper bounded by stock, and invalid/404 ID handling.
- **Shopping Cart (`/cart`)**: Persistent cart state (`localStorage`) managed via `CartContext` with immutable updates, quantity controls, item removal, and subtotal/total calculations.
- **Authentication (`/login`)**: Controlled login form with validation updating `AuthContext` and redirecting back to protected routes.
- **Checkout (`/checkout`)**: Protected route with controlled shipping form, inline validation, and local order confirmation summary.
- **Resilience & Error Handling**: Global `ErrorBoundary`, `AbortController` request cleanup, and SPA routing fallback (`vercel.json` / `_redirects`).

## Tech Stack
- **Framework**: React 19 + Vite 6
- **Language**: TypeScript 5.7 (`strict: true`)
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Data Source**: [DummyJSON API](https://dummyjson.com)

## Architecture
```text
src/
├── api/          # Typed fetch helpers & ApiError class
├── components/   # Reusable UI (Layout, Header, Footer, ProductCard, ProductGrid, ErrorBoundary)
├── context/      # AuthContext & CartContext providers
├── pages/        # Route-level views (Catalog, ProductDetails, Cart, Login, Checkout, NotFound)
├── routes/       # ProtectedRoute guard
├── types/        # Shared TypeScript interfaces & discriminated unions
└── utils/        # Pure price formatting & form validation functions
```
Unidirectional React data flow: user interactions trigger event handlers that update React state or Context immutably, causing predictable UI re-renders. Side effects (`fetch`, `localStorage` sync) run inside `useEffect` with proper cleanup.

## How to Run
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev` — Start local development server
- `npm run typecheck` — Run strict TypeScript check (`tsc --noEmit`)
- `npm run lint` — Run ESLint checks
- `npm run build` — Build production bundle

## Live Demo
- Deploy URL: *Add your Vercel or Netlify URL here after deployment*

## Test Account
- **Username**: `giorgi` (or any non-empty username)
- **Password**: `123456` (minimum 6 characters)

## Credits
- Product data provided by [DummyJSON](https://dummyjson.com).

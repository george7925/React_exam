import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="min-h-[44px] inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
      >
        Go to catalog
      </Link>
    </div>
  );
}

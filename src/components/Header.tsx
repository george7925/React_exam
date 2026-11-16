import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export function Header() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `min-h-[44px] inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700 font-semibold"
        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold tracking-tight text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          >
            10X Shop
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-2">
            <NavLink to="/" end className={navLinkClass}>
              Catalog
            </NavLink>

            <NavLink to="/cart" className={navLinkClass}>
              <span>Cart</span>
              {totalCount > 0 && (
                <span
                  aria-label={`${totalCount} items in cart`}
                  className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full"
                >
                  {totalCount}
                </span>
              )}
            </NavLink>

            {user.isLoggedIn ? (
              <div className="flex items-center gap-3 ml-2">
                <span className="text-sm text-gray-600">
                  Hi, <strong className="text-gray-900">{user.username}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="min-h-[44px] inline-flex items-center ml-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                Log in
              </NavLink>
            )}
          </nav>

          {/* Mobile Menu Button (<= 480px) */}
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              to="/cart"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              Cart
              {totalCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs font-bold text-white bg-indigo-600 rounded-full">
                  {totalCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <nav aria-label="Mobile navigation" className="sm:hidden pb-4 pt-2 border-t border-gray-100 flex flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Catalog
            </NavLink>
            <NavLink
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Cart {totalCount > 0 ? `(${totalCount})` : ""}
            </NavLink>
            {user.isLoggedIn ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-600">
                  Signed in as <strong className="text-gray-900">{user.username}</strong>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-[44px] text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Log out
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={navLinkClass}
              >
                Log in
              </NavLink>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

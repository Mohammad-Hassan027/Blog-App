import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { useEffect, useRef, useState } from "react";

function Header() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  const avatarUrl =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.displayName || user?.email || "User"
    )}&background=random`;

  return (
    <header className="border-b border-[#e3e8ed]/20 dark:border-[#e3e8ed]/10 px-4 sm:px-6 lg:px-8 py-4">
      <div className="mx-auto flex max-w-8xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <svg
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
            <h2 className="text-xl font-bold">Bloggr</h2>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link className="text-sm font-medium hover:text-blue-500" to="/">
              Home
            </Link>
            <Link
              className="text-sm font-medium hover:text-blue-500"
              to="/about"
            >
              About
            </Link>
            <Link
              className="text-sm font-medium hover:text-blue-500"
              to="/contact"
            >
              Contact
            </Link>
            {user && (
              <Link
                className="text-sm font-medium hover:text-blue-500"
                to="/dashboard"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((s) => !s)}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path
                d={
                  mobileOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {user ? (
            <>
              <Link
                to="/create"
                className="hidden sm:inline-block rounded bg-blue-500 px-3 sm:px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-500/90"
              >
                New Post
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((s) => !s)}
                  className="h-10 w-10 rounded-full bg-cover bg-center focus:ring-2 focus:ring-blue-300"
                  style={{ backgroundImage: `url("${avatarUrl}")` }}
                />

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user.displayName || user.email}
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded bg-blue-500 px-3 sm:px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-500/90"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t">
          <nav className="flex flex-col gap-2">
            <Link to="/" className="text-sm font-medium hover:text-blue-500">
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium hover:text-blue-500"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium hover:text-blue-500"
            >
              Contact
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="text-sm font-medium hover:text-blue-500"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <Link
                to="/create"
                className="mt-2 inline-block rounded bg-blue-500 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-500/90"
                onClick={() => setMobileOpen(false)}
              >
                New Post
              </Link>
            ) : (
              <Link
                to="/login"
                className="mt-2 inline-block rounded bg-blue-500 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-500/90"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;

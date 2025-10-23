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
    <header className="border-b border-[#e3e8ed]/20 dark:border-[#e3e8ed]/10 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 bg-white/90 backdrop-blur z-30">
      <div className="flex items-center justify-between mx-auto max-w-8xl">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-blue-500"
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
          <nav className="items-center hidden gap-6 md:flex">
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
            className="p-2 rounded-md md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((s) => !s)}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
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
                className="hidden px-3 py-2 text-sm font-bold text-white bg-blue-500 rounded shadow-sm sm:inline-block sm:px-4 hover:bg-blue-500/90 hover:scale-105 active:scale-95"
              >
                New Post
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((s) => !s)}
                  className="w-10 h-10 bg-center bg-cover rounded-full focus:ring-2 focus:ring-blue-300"
                  style={{ backgroundImage: `url("${avatarUrl}")` }}
                />

                {menuOpen && (
                  <div className="absolute right-0 z-20 w-56 py-1 mt-2 bg-white rounded-md shadow-lg">
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
                      className="w-full px-4 py-2 text-sm text-left text-red-700 hover:bg-red-50"
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
              className="px-3 py-2 text-sm font-bold text-white bg-blue-500 rounded shadow-sm sm:px-4 hover:bg-blue-500/90 hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="px-4 pt-2 pb-4 border-t md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              className="text-sm font-medium hover:text-blue-500"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium hover:text-blue-500"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium hover:text-blue-500"
              onClick={() => setMobileOpen(false)}
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
                className="inline-block px-3 py-2 mt-2 text-sm font-bold text-white bg-blue-500 rounded shadow-sm hover:bg-blue-500/90 hover:scale-105 active:scale-95"
                onClick={() => setMobileOpen(false)}
              >
                New Post
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-block px-3 py-2 mt-2 text-sm font-bold text-white bg-blue-500 rounded shadow-sm hover:bg-blue-500/90"
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

import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t bg-linear-to-b from-white to-blue-50 border-gray-200/80 dark:from-gray-900 dark:to-gray-800 dark:border-gray-700/50">
      <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand section */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                  fill="currentColor"
                />
              </svg>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Bloggr
              </h2>
            </Link>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Share your stories, ideas, and expertise with the world.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/Mohammad-Hassan027"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-blue-500"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-blue-500"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/mohammad-hassan-shaikh-750791352?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-blue-500"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-gray-100">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/all-posts"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  All Posts
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-gray-100">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Technology
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Programming
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  AI & Machine Learning
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Web Development
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-gray-100">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  GDPR
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-12 border-t border-gray-200/80 dark:border-gray-700/50">
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Photos: Unsplash —
              <a
                href="https://unsplash.com/photos/photo-1506765515384-028b60a970df"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline"
              >
                Hero image
              </a>
              ,
              <a
                href="https://unsplash.com/photos/photo-1518770660439-4636190af475"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline"
              >
                Featured image
              </a>
            </p>

            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Bloggr. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

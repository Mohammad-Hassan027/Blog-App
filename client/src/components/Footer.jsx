import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t border-gray-200/80">
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
              <h2 className="text-xl font-bold text-gray-900">Bloggr</h2>
            </Link>
            <p className="mb-4 text-sm text-gray-600">
              Share your stories, ideas, and expertise with the world.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://github.com/Mohammad-Hassan027"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-blue-500"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-blue-500"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </Link>
              <Link
                href="https://www.linkedin.com/in/mohammad-hassan-shaikh-750791352?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-blue-500"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </Link>
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
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/all-posts"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
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
                <Link
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Programming
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Web Development
                </Link>
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
                <Link
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-12 border-t border-gray-200/80">
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <p className="text-sm text-gray-600">
              Photos: Unsplash —
              <Link
                href="https://unsplash.com/photos/photo-1506765515384-028b60a970df"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline"
              >
                Hero image
              </Link>
              ,
              <Link
                href="https://unsplash.com/photos/photo-1518770660439-4636190af475"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline"
              >
                Featured image
              </Link>
            </p>

            <p className="text-sm text-center text-gray-600">
              © {new Date().getFullYear()} Bloggr. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

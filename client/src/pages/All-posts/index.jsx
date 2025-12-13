import { CiSearch } from "react-icons/ci";
import { MdExpandMore } from "react-icons/md";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi2";
import BlogPostCard from "./BlogPostCard";
import { useState } from "react";
import useBlogStore from "../../store/useBlogStore";
import { usePosts } from "../../hooks/blogHooks";

const POSTS_PER_PAGE = 6;

function AllPostsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const blogListPage = useBlogStore((s) => s.blogListPage);
  const setBlogListPage = useBlogStore((s) => s.setBlogListPage);

  const { data, isLoading, isError, error } = usePosts(
    blogListPage,
    POSTS_PER_PAGE
  );

  const blogs = data?.blogs || [];
  const currentPage = data?.currentPage || 1;
  const totalPages = data?.totalPages || 1;

  const filteredBlogs = [...blogs].filter(
    (blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayError = isError ? error.message : null;

  const handlePageChange = (pageNumber) => {
    setBlogListPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container px-4 py-2 sm:py-8 mx-auto grow sm:px-6 lg:px-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="relative max-w-xl mx-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span
                className="material-symbols-outlined text-slate-400"
                aria-hidden="true"
              >
                <CiSearch />
              </span>
            </span>
            <input
              className="w-full py-3 pl-10 pr-4 text-lg transition-colors rounded-full bg-stone-50/45 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              placeholder="Search posts..."
              type="search"
              aria-label="Search posts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-end mb-8 space-y-4 md:flex-row md:space-y-0 md:space-x-2">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              aria-label="Filter by category"
              className="py-2 pl-3 pr-8 text-sm font-medium rounded-md appearance-none text-slate-600 bg-stone-50/50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option>Category</option>
              <option>Lifestyle</option>
              <option>Technology</option>
              <option>Travel</option>
              <option>Food</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500 dark:text-slate-400">
              <span
                className="text-base material-symbols-outlined"
                aria-hidden="true"
              >
                <MdExpandMore />
              </span>
            </div>
          </div>
          {/* Tag Dropdown */}
          <div className="relative">
            <select
              aria-label="Filter by tag"
              className="py-2 pl-3 pr-8 text-sm font-medium rounded-md appearance-none text-slate-600 bg-stone-50/50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option>Tag</option>
              <option>Sustainable</option>
              <option>Photography</option>
              <option>DIY</option>
              <option>Science</option>
              <option>Wellness</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500 ">
              <span
                className="text-base material-symbols-outlined"
                aria-hidden="true"
              >
                <MdExpandMore />
              </span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10" role="status">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent border-solid rounded-full animate-spin" />
            <span className="sr-only">Loading posts...</span>
          </div>
        ) : displayError ? (
          <p className="text-center text-red-500">
            {" "}
            Error fetching posts: {displayError}
          </p>
        ) : (
          <>
            <div className="space-y-12">
              {filteredBlogs && filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <BlogPostCard blog={blog} key={blog._id || blog.id} />
                ))
              ) : (
                <p className="text-center text-slate-500 py-10">
                  No posts found matching your search criteria.
                </p>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                {" "}
                <nav
                  aria-label="Pagination"
                  className="flex items-center space-x-2"
                >
                  <button
                    className={`inline-flex items-center justify-center w-10 h-10 transition-colors rounded-full ${
                      currentPage > 1
                        ? "text-slate-500 hover:bg-slate-200"
                        : "text-slate-300 cursor-not-allowed"
                    }`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <span className="material-symbols-outlined">
                      <HiChevronLeft />
                    </span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        aria-current={
                          pageNumber === currentPage ? "page" : undefined
                        }
                        aria-label={`Page ${pageNumber}`}
                        className={`inline-flex items-center justify-center w-10 h-10 font-medium rounded-full transition-colors ${
                          pageNumber === currentPage
                            ? "text-white bg-stone-500"
                            : "text-slate-600 hover:bg-slate-200"
                        }`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    )
                  )}
                  <button
                    className={`inline-flex items-center justify-center w-10 h-10 transition-colors rounded-full ${
                      currentPage < totalPages
                        ? "text-slate-500 hover:bg-slate-200"
                        : "text-slate-300 cursor-not-allowed"
                    }`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      <HiChevronRight />
                    </span>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default AllPostsPage;

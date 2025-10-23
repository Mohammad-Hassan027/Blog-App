import { CiSearch } from "react-icons/ci";
import { MdExpandMore } from "react-icons/md";
import { HiChevronRight } from "react-icons/hi2";
import { HiChevronLeft } from "react-icons/hi2";
import BlogPostCard from "./BlogPostCard";
import { useEffect, useState } from "react";
import useBlogStore from "../../store/useBlogStore";

function AllPostsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const blogs = useBlogStore((s) => s.blogs);

  const fetchBlogs = useBlogStore((s) => s.fetchBlogs);
  const currentPage = useBlogStore((s) => s.currentPage);
  const totalPages = useBlogStore((s) => s.totalPages);
  const loading = useBlogStore((s) => s.loading);
  const error = useBlogStore((s) => s.error);

  const filteredBlogs = [...(blogs || [])].filter(
    (blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <main className="container px-4 py-2 sm:py-8 mx-auto grow sm:px-6 lg:px-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="relative max-w-xl mx-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-symbols-outlined text-slate-400">
                <CiSearch />
              </span>
            </span>
            <input
              className="w-full py-3 pl-10 pr-4 text-lg transition-colors rounded-full bg-blue-50/45 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Search posts..."
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-end mb-8 space-y-4 md:flex-row md:space-y-0 md:space-x-2">
          <div className="relative">
            <select className="py-2 pl-3 pr-8 text-sm font-medium rounded-md appearance-none text-slate-600 bg-blue-50/50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Category</option>
              <option>Lifestyle</option>
              <option>Technology</option>
              <option>Travel</option>
              <option>Food</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500 dark:text-slate-400">
              <span className="text-base material-symbols-outlined">
                <MdExpandMore />
              </span>
            </div>
          </div>
          <div className="relative">
            <select className="py-2 pl-3 pr-8 text-sm font-medium rounded-md appearance-none text-slate-600 bg-blue-50/50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Tag</option>
              <option>Sustainable</option>
              <option>Photography</option>
              <option>DIY</option>
              <option>Science</option>
              <option>Wellness</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500 ">
              <span className="text-base material-symbols-outlined">
                <MdExpandMore />
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="loader" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">
            {" "}
            Error fetching posts: {error}
          </p>
        ) : (
          <>
            <div className="space-y-12">
              {filteredBlogs &&
                filteredBlogs.map((blog) => (
                  <BlogPostCard blog={blog} key={blog._id || blog.id} />
                ))}
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
                    onClick={() => fetchBlogs(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    {/* &larr; */}
                    <span className="material-symbols-outlined">
                      <HiChevronLeft />
                    </span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        className={`inline-flex items-center justify-center w-10 h-10 font-medium rounded-full transition-colors ${
                          pageNumber === currentPage
                            ? "text-white bg-blue-500"
                            : "text-slate-600 hover:bg-slate-200"
                        }`}
                        onClick={() => fetchBlogs(pageNumber)}
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
                    onClick={() => fetchBlogs(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    {/* &rarr; */}
                    <span className="material-symbols-outlined">
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

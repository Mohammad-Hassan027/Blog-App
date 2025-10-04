import { CiSearch } from "react-icons/ci";
import { MdExpandMore } from "react-icons/md";
import { HiChevronRight } from "react-icons/hi2";
import { HiChevronLeft } from "react-icons/hi2";
import BlogPostCard from "./BlogPostCard";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import useBlogStore from "../../store/useBlogStore";

function AllPostsPage() {
  const blogs = useBlogStore((s) => s.blogs);
  const fetchBlogs = useBlogStore((s) => s.fetchBlogs);

  useEffect(() => {
    if (blogs.length === 0) {
      fetchBlogs();
    }
  }, [blogs.length, fetchBlogs]);

  return (
    <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            All Posts
          </h2>
          <div className="relative max-w-xl mx-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-symbols-outlined text-slate-400">
                <CiSearch />
              </span>
            </span>
            <input
              className="w-full pl-10 pr-4 py-3 text-lg bg-blue-50border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Search posts..."
              type="search"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-end space-y-4 md:space-y-0 md:space-x-2 mb-8">
          <div className="relative">
            <select className="pl-3 pr-8 py-2 text-sm font-medium text-slate-600  bg-blue-50border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
              <option>Category</option>
              <option>Lifestyle</option>
              <option>Technology</option>
              <option>Travel</option>
              <option>Food</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-base">
                <MdExpandMore />
              </span>
            </div>
          </div>
          <div className="relative">
            <select className="pl-3 pr-8 py-2 text-sm font-medium text-slate-600 bg-blue-50border border-slate-300  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
              <option>Tag</option>
              <option>Sustainable</option>
              <option>Photography</option>
              <option>DIY</option>
              <option>Science</option>
              <option>Wellness</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 ">
              <span className="material-symbols-outlined text-base">
                <MdExpandMore />
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-12">
          {blogs &&
            blogs.map((blog) => (
              <BlogPostCard blog={blog} key={blog._id || blog.id} />
            ))}
        </div>
        <div className="mt-12 flex justify-center">
          <nav aria-label="Pagination" className="flex items-center space-x-2">
            <Link
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors"
              to={"#"}
            >
              <span className="material-symbols-outlined">
                <HiChevronLeft />
              </span>
            </Link>
            <Link
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white bg-blue-500 font-medium"
              to={"#"}
            >
              1
            </Link>
            <Link
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 hover:text-blue-500 dark:hover:text-blue-500 transition-colors"
              to={"#"}
            >
              2
            </Link>
            <Link
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 hover:text-blue-500 dark:hover:text-blue-500 transition-colors"
              to={"#"}
            >
              3
            </Link>
            <span className="inline-flex items-center justify-center w-10 h-10 text-slate-500 dark:text-slate-400">
              ...
            </span>
            <Link
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 hover:text-blue-500 dark:hover:text-blue-500 transition-colors"
              to={"#"}
            >
              10
            </Link>
            <Link
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors"
              to={"#"}
            >
              <span className="material-symbols-outlined">
                <HiChevronRight />
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}

export default AllPostsPage;

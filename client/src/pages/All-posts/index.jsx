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
    <main className="container px-4 py-8 mx-auto grow sm:px-6 lg:px-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl text-slate-900 dark:text-white">
            All Posts
          </h2>
          <div className="relative max-w-xl mx-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-symbols-outlined text-slate-400">
                <CiSearch />
              </span>
            </span>
            <input
              className="w-full py-3 pl-10 pr-4 text-lg transition-colors rounded-full bg-blue-50border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search posts..."
              type="search"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-end mb-8 space-y-4 md:flex-row md:space-y-0 md:space-x-2">
          <div className="relative">
            <select className="py-2 pl-3 pr-8 text-sm font-medium rounded-md appearance-none text-slate-600 bg-blue-50border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
            <select className="py-2 pl-3 pr-8 text-sm font-medium rounded-md appearance-none text-slate-600 bg-blue-50border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
        <div className="space-y-12">
          {blogs &&
            blogs.map((blog) => (
              <BlogPostCard blog={blog} key={blog._id || blog.id} />
            ))}
        </div>
        <div className="flex justify-center mt-12">
          <nav aria-label="Pagination" className="flex items-center space-x-2">
            <Link
              className="inline-flex items-center justify-center w-10 h-10 transition-colors rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200"
              to={"#"}
            >
              <span className="material-symbols-outlined">
                <HiChevronLeft />
              </span>
            </Link>
            <Link
              className="inline-flex items-center justify-center w-10 h-10 font-medium text-white bg-blue-500 rounded-full"
              to={"#"}
            >
              1
            </Link>
            <Link
              className="inline-flex items-center justify-center w-10 h-10 transition-colors rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 hover:text-blue-500 dark:hover:text-blue-500"
              to={"#"}
            >
              2
            </Link>
            <Link
              className="inline-flex items-center justify-center w-10 h-10 transition-colors rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 hover:text-blue-500 dark:hover:text-blue-500"
              to={"#"}
            >
              3
            </Link>
            <span className="inline-flex items-center justify-center w-10 h-10 text-slate-500 dark:text-slate-400">
              ...
            </span>
            <Link
              className="inline-flex items-center justify-center w-10 h-10 transition-colors rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 hover:text-blue-500 dark:hover:text-blue-500"
              to={"#"}
            >
              10
            </Link>
            <Link
              className="inline-flex items-center justify-center w-10 h-10 transition-colors rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200"
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

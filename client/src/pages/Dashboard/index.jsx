import { MdExpandMore } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBlogStore from "../../store/useBlogStore";
import Loader from "../../components/Loader";

function DashBoard() {
  const navigate = useNavigate();
  const { blogs, loading, error, fetchMyBlogs, deletePost } = useBlogStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("date-desc");
  const [activeTab, setActiveTab] = useState("published");

  useEffect(() => {
    fetchMyBlogs();
  }, [fetchMyBlogs]);

  const publishedBlogs = blogs.filter((blog) => blog.status === "published");
  const draftBlogs = blogs.filter((blog) => blog.status === "draft");

  const blogsToDisplay =
    activeTab === "published" ? publishedBlogs : draftBlogs;

  // Filter and sort blogs
  const filteredAndSortedBlogs = [...(blogsToDisplay || [])]
    .filter(
      (blog) =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case "date-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  const handleEdit = (blogId) => {
    navigate(`/edit-post/${blogId}`);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(blogId);
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  return (
    <main className="flex flex-1 justify-center py-8">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold">Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-4">
            <div className="relative w-full sm:max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <CiSearch />
              </span>
              <input
                className="w-full rounded-lg border border-gray-200/80 bg-background-light py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Search posts..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <select
                className="w-full appearance-none rounded-lg border border-gray-200/80 bg-background-light py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:ring-blue-500"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                <MdExpandMore />
              </span>
            </div>
          </div>
        </div>
        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("published")}
              className={`${
                activeTab === "published"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Published
            </button>
            <button
              onClick={() => setActiveTab("drafts")}
              className={`${
                activeTab === "drafts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Drafts
            </button>
          </nav>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200/80 bg-blue-50">
          <table className="w-full min-w-[640px] text-left">
            <thead className="border-b border-gray-200/80 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold" scope="col">
                  Title
                </th>
                <th className="px-6 py-3 text-sm font-semibold" scope="col">
                  Author
                </th>
                <th className="px-6 py-3 text-sm font-semibold" scope="col">
                  Date
                </th>
                <th className="px-6 py-3 text-sm font-semibold" scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/80">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-600"
                  >
                    <Loader />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredAndSortedBlogs.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-600"
                  >
                    No posts found
                  </td>
                </tr>
              ) : (
                filteredAndSortedBlogs.map((blog) => (
                  <tr key={blog._id || blog.id}>
                    <td className="px-6 py-4 text-sm font-medium">
                      {blog.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {blog.author}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-sm font-medium">
                        <a
                          className="text-blue-500 hover:underline cursor-pointer"
                          onClick={() =>
                            navigate(`/post/${blog._id || blog.id}`)
                          }
                        >
                          View
                        </a>
                        <a
                          className="text-yellow-600 hover:underline cursor-pointer"
                          onClick={() => handleEdit(blog._id || blog.id)}
                        >
                          Edit
                        </a>
                        <a
                          className="text-red-600 hover:underline cursor-pointer"
                          onClick={() => handleDelete(blog._id || blog.id)}
                        >
                          Delete
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default DashBoard;

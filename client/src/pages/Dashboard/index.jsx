import { MdExpandMore } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useMyPosts, useDeletePost } from "../../hooks/blogHooks";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function DashBoard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("date-desc");
  const [activeTab, setActiveTab] = useState("published");

  const { data: blogs = [], isLoading, error: queryError } = useMyPosts();
  const deletePostMutation = useDeletePost();

  const publishedBlogs = useMemo(
    () => blogs.filter((blog) => blog.status === "published"),
    [blogs]
  );
  const draftBlogs = useMemo(
    () => blogs.filter((blog) => blog.status === "draft"),
    [blogs]
  );

  const blogsToDisplay =
    activeTab === "published" ? publishedBlogs : draftBlogs;

  const filteredAndSortedBlogs = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return [...(blogsToDisplay || [])]
      .filter((blog) => {
        const title = blog.title?.toLowerCase() || "";
        const author = blog.author?.toLowerCase() || "";
        return (
          title.includes(lowerSearchTerm) || author.includes(lowerSearchTerm)
        );
      })
      .sort((a, b) => {
        const titleA = a.title || "";
        const titleB = b.title || "";
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        if (isNaN(dateA) || isNaN(dateB)) return 0;

        switch (sortOrder) {
          case "date-desc":
            return dateB - dateA;
          case "date-asc":
            return dateA - dateB;
          case "title-asc":
            return titleA.localeCompare(titleB);
          case "title-desc":
            return titleB.localeCompare(titleA);
          default:
            return 0;
        }
      });
  }, [blogsToDisplay, searchTerm, sortOrder]);

  const handleEdit = (blogId) => {
    navigate(`/edit-post/${blogId}`);
  };

  const handleDelete = async (blogId, title) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: `You are about to delete the post: "${title}". You won't be able to revert this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deletePostMutation.mutateAsync(blogId);
        MySwal.fire(
          "Deleted!",
          "Your post has been successfully deleted.",
          "success"
        );
      } catch (error) {
        console.error("Failed to delete post:", error);
        MySwal.fire(
          "Failed!",
          `There was an error deleting the post: ${
            error.message || "Unknown error"
          }`,
          "error"
        );
      }
    }
  };

  const getTabClasses = (tabName) =>
    `${
      activeTab === tabName
        ? "border-blue-500 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out`;

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="5" className="py-12 text-center">
            <Loader />
            <p className="mt-2 text-sm text-gray-500">Loading posts...</p>
          </td>
        </tr>
      );
    }

    if (queryError) {
      return (
        <tr>
          <td
            colSpan="5"
            className="px-6 py-4 text-sm text-center text-red-600"
          >
            Error: {queryError.message}
          </td>
        </tr>
      );
    }

    if (filteredAndSortedBlogs.length === 0) {
      return (
        <tr>
          <td
            colSpan="5"
            className="px-6 py-4 text-sm text-center text-gray-600"
          >
            No {activeTab} posts found.
          </td>
        </tr>
      );
    }

    return filteredAndSortedBlogs.map((blog) => (
      <tr
        key={blog._id}
        className="bg-white hover:bg-gray-50 transition duration-100 ease-in-out"
      >
        <td className="px-6 py-4 text-sm font-medium text-gray-900">
          {blog.title || "Untitled Post"}
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
              blog.status === "published"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {blog.status === "published" ? "Published" : "Draft"}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {blog.author || "N/A"}
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }) || "N/A"}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link
              className="text-blue-500 cursor-pointer hover:text-blue-700 transition"
              to={`/post/${blog._id}`}
            >
              View
            </Link>
            <button
              type="button"
              className="text-yellow-600 cursor-pointer hover:text-yellow-800 transition"
              onClick={() => handleEdit(blog._id)}
            >
              Edit
            </button>
            <button
              type="button"
              className="text-red-600 cursor-pointer hover:text-red-800 transition"
              onClick={() => handleDelete(blog._id, blog.title)}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <main className="flex justify-center flex-1 py-8">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold sm:text-4xl">Dashboard</h1>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:gap-4">
            <div className="relative w-full sm:max-w-xs">
              <CiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                className="w-full py-2 pl-10 pr-4 text-sm border rounded-lg border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                placeholder="Search posts by title or author..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <select
                className="w-full py-2 pl-3 pr-8 text-sm border rounded-lg appearance-none border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
              <MdExpandMore
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={24}
              />
            </div>
          </div>
        </div>

        <div className="mb-4 border-b border-gray-200">
          <nav className="flex -mb-px space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("published")}
              className={getTabClasses("published")}
            >
              Published ({publishedBlogs.length})
            </button>
            <button
              onClick={() => setActiveTab("drafts")}
              className={getTabClasses("drafts")}
            >
              Drafts ({draftBlogs.length})
            </button>
          </nav>
        </div>

        <div className="overflow-x-auto border rounded-lg shadow-sm border-gray-200 bg-white">
          <table className="w-full min-w-[640px] text-left">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600"
                  scope="col"
                >
                  Title
                </th>
                <th
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600"
                  scope="col"
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600"
                  scope="col"
                >
                  Author
                </th>
                <th
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600"
                  scope="col"
                >
                  Date
                </th>
                <th
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600"
                  scope="col"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {renderTableContent()}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default DashBoard;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import useBlogStore from "../../store/useBlogStore";
import { uploadToCloudinary } from "../../utils/cloudinary";

function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createPost, loading, error } = useBlogStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [tags, setTags] = useState([]);

  // Example tag options (customize as needed)
  const tagOptions = [
    "Technology",
    "AI",
    "Programming",
    "Science",
    "Health",
    "Lifestyle",
    "Business",
    "Environment",
    "Education",
    "Other",
  ];
  // Only show options not already selected
  const availableTagOptions = tagOptions.filter((tag) => !tags.includes(tag));

  //  status = "published";
  const handleSubmit = async (e, status = "published") => {
    e.preventDefault();
    setFormError("");

    if (!title.trim() || !content.trim()) {
      setFormError("Title and content are required");
      return;
    }

    try {
      if (imageUrl && !imageUrl.match(/^https?:\/\/.+/)) {
        setFormError(
          "Please enter a valid image URL starting with http:// or https://"
        );
        return;
      }

      const postData = {
        title: title.trim(),
        content: content,
        imageUrl,
        description:
          content
            .trim()
            .replace(/#+\s/g, "") // Remove headers (#, ##, etc)
            .replace(/\*\*/g, "") // Remove bold markers
            .replace(/\*/g, "") // Remove italic markers
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Replace [text](url) with just text
            .replace(/`/g, "") // Remove code markers
            .replace(/\n/g, " ") // Replace newlines with spaces
            .replace(/\s+/g, " ") // Replace multiple spaces with single space
            .substring(0, 200) + "...",
        author: user.displayName || user.email,
        createdAt: new Date().toISOString(),
        tag: tags,
        status: status,
      };

      await createPost(postData);
      navigate("/");
    } catch (err) {
      setFormError(err.message || "Failed to create post");
    }
  };

  return (
    <>
      <main className="flex-1 py-6 shadow-2xl sm:py-10 md:py-18 rounded-2xl">
        <div className="max-w-xl px-4 mx-auto">
          <div className="space-y-6 md:space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Create a New Post
              </h1>
              <p className="mt-2 text-[#566879] dark:text-[#a0a9b4]">
                Fill out the form below to publish a new article on your blog.
              </p>
            </div>
            {(error || formError) && (
              <div className="p-3 text-sm text-red-500 bg-red-100 rounded">
                {error || formError}
              </div>
            )}
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                {/* Tag selection refined UI */}
                <label className="text-sm font-medium" htmlFor="tags">
                  Tags
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    id="tags"
                    className="form-select rounded border-0 bg-[#e3e8ed]/50 p-3 text-sm ring-1 ring-inset ring-[#1c2834]/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-[#e3e8ed]/5 dark:ring-white/10 dark:focus:ring-blue-500"
                    value=""
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && !tags.includes(val)) {
                        setTags([...tags, val]);
                      }
                    }}
                  >
                    <option value="" disabled>
                      {tags.length === 0 ? "Select tag" : "Add another tag"}
                    </option>
                    {availableTagOptions.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded"
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                          aria-label={`Remove ${tag}`}
                          onClick={() => setTags(tags.filter((t) => t !== tag))}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Add up to {tagOptions.length} tags.
                </p>
                {/* End of form fields */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="title">
                    Title
                  </label>
                  <input
                    className="form-input w-full rounded border-0 bg-[#e3e8ed]/50 p-3 text-sm placeholder:text-[#566879]/70 ring-1 ring-inset ring-[#1c2834]/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-[#e3e8ed]/5 dark:ring-white/10 dark:focus:ring-blue-500"
                    id="title"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Post Image
                  </label>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <input
                        className="form-input w-full rounded border-0 bg-[#e3e8ed]/50 p-3 text-sm placeholder:text-[#566879]/70 ring-1 ring-inset ring-[#1c2834]/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-[#e3e8ed]/5 dark:ring-white/10 dark:focus:ring-blue-500"
                        type="url"
                        placeholder="Enter image URL or upload a file"
                        value={imageUrl}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          setImagePreview(e.target.value);
                        }}
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsUploading(true);
                            setFormError("");
                            try {
                              const url = await uploadToCloudinary(file);
                              setImageUrl(url);
                              setImagePreview(url);
                              setUploadedFile(file);
                            } catch (error) {
                              setFormError(
                                "Failed to upload image. Please try again."
                              );
                            } finally {
                              setIsUploading(false);
                            }
                          }
                        }}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`inline-flex items-center px-4 py-3 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer text-sm font-medium ${
                          isUploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isUploading ? "Uploading..." : "Upload"}
                      </label>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </p>
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full rounded max-h-48"
                      onError={() => setImagePreview("")}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="content">
                  Content (Markdown supported)
                </label>
                <textarea
                  className="form-textarea min-h-[200px] sm:min-h-48 w-full rounded border-0 bg-[#e3e8ed]/50 p-3 text-sm placeholder:text-[#566879]/70 ring-1 ring-inset ring-[#1c2834]/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 "
                  id="content"
                  placeholder="Write your blog post here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "draft")}
                  disabled={loading}
                  className={`w-full sm:w-auto rounded bg-gray-200 px-6 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-300 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Saving..." : "Save Draft"}
                </button>
                <button
                  type="submit"
                  onClick={(e) => handleSubmit(e, "published")}
                  disabled={loading}
                  className={`w-full sm:w-auto rounded bg-blue-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-500/90 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Publishing..." : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default CreatePost;

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import useBlogStore from "../../store/useBlogStore";
// Assuming getImageDataUrl is available or you use a direct Cloudinary hook
import { uploadToCloudinary } from "../../utils/cloudinary";
import MarkdownRules from "../../components/MarkdownRules";
import MarkdownEditor from "../../components/MarkdownEditor";
import generateDescription from "../../utils/genDesc";

const MAX_TAGS = 5;
const MAX_IMAGE_SIZE_MB = 5;

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchBlogById, updatePost, loading, error } = useBlogStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Final image URL (could be uploaded or external)
  const [initialImageUrl, setInitialImageUrl] = useState(""); // To track if the image has changed
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState("published");

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
  const availableTagOptions = tagOptions.filter((tag) => !tags.includes(tag));

  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await fetchBlogById(id);
        if (post) {
          setTitle(post.title || "");
          setContent(post.content || "");
          setImageUrl(post.imageUrl || "");
          setImagePreview(post.imageUrl || "");
          setInitialImageUrl(post.imageUrl || "");
          setTags(post.tag || []);
          setStatus(post.status || "published");
        }
      } catch (err) {
        setFormError("Failed to load post for editing.");
        console.error("Error loading post:", err);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id, fetchBlogById]);

  const clearImageStates = () => {
    setImageUrl("");
    setImagePreview("");
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
    setFormError("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setFormError(`Image must be less than ${MAX_IMAGE_SIZE_MB}MB`);
      e.target.value = null;
      return;
    }

    setIsUploading(true);
    setFormError("");

    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
      setImagePreview(url);
      setFormError("");
      e.target.value = null;
    } catch (err) {
      console.error(err);
      setFormError("Failed to upload image. Please try again.");
      setImageUrl(initialImageUrl);
      setImagePreview(initialImageUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTagChange = (e) => {
    const val = e.target.value;
    if (val && !tags.includes(val)) {
      if (tags.length < MAX_TAGS) {
        setTags([...tags, val]);
        setFormError("");
      } else {
        setFormError(`Maximum of ${MAX_TAGS} tags reached.`);
      }
    }
    e.target.value = "";
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setFormError("");
  };

  const handleSubmit = async (e, newStatus) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim() || !content.trim()) {
      setFormError("Title and content are required.");
      return;
    }

    if (isUploading) {
      setFormError("Please wait for the image upload to complete.");
      return;
    }

    if (imageUrl && !imageUrl.match(/^https?:\/\/.+/)) {
      setFormError("The image URL must start with http:// or https://");
      return;
    }

    try {
      const postData = {
        title: title.trim(),
        content: content,
        imageUrl: imageUrl || null,
        description: generateDescription(content),
        author: user.displayName || user.email,
        tag: tags,
        status: newStatus,
      };

      await updatePost(id, postData);
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.message || "Failed to update post");
    }
  };

  if (!title && !error && loading) {
    return (
      <main className="flex-1 py-6 sm:py-10 md:py-18 text-center text-gray-500">
        <p>Loading post data...</p>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 py-6 shadow-2xl sm:py-10 md:py-18 rounded-2xl">
        <div className="max-w-xl px-4 mx-auto">
          <div className="space-y-6 md:space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Edit Post
              </h1>
              <p className="mt-2 text-[#566879] dark:text-[#a0a9b4]">
                Update your blog post using the form below. Current status: **
                {status.toUpperCase()}**
              </p>
            </div>
            {(error || formError) && (
              <div className="p-3 text-sm text-red-500 bg-red-100 rounded">
                {error || formError}
              </div>
            )}
            <form
              className="space-y-4 sm:space-y-6"
              onSubmit={(e) => handleSubmit(e, status)}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="tags">
                  Tags
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    id="tags"
                    className="form-select rounded border-0 bg-[#e3e8ed]/50 p-3 text-sm ring-1 ring-inset ring-[#1c2834]/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-[#e3e8ed]/5 dark:ring-white/10 dark:focus:ring-blue-500"
                    value=""
                    onChange={handleTagChange}
                    disabled={tags.length >= MAX_TAGS}
                  >
                    <option value="" disabled>
                      {tags.length === MAX_TAGS
                        ? `Maximum of ${MAX_TAGS} tags reached`
                        : tags.length === 0
                        ? "Select tag"
                        : "Add another tag"}
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
                          onClick={() => handleTagRemove(tag)}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Add up to {MAX_TAGS} tags. Currently selected: {tags.length}.
                </p>

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
                        onChange={handleImageUrlChange}
                        disabled={isUploading}
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
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
                    Supported formats: JPG, PNG, GIF. Max size:{" "}
                    {MAX_IMAGE_SIZE_MB}MB
                  </p>
                </div>
                {imagePreview && (
                  <div className="relative mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full rounded max-h-48"
                      onError={() => {
                        console.error(
                          "Image failed to load. Clearing preview."
                        );
                        clearImageStates();
                        setFormError(
                          "The image could not be loaded. Please use a different image or URL."
                        );
                      }}
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                      aria-label="Remove image"
                      onClick={clearImageStates}
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>

              <MarkdownEditor
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "draft")}
                  disabled={loading || isUploading}
                  className={`w-full sm:w-auto rounded bg-gray-200 px-6 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-300 ${
                    loading || isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loading ? "Saving..." : "Save Draft"}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "published")}
                  disabled={loading || isUploading}
                  className={`w-full sm:w-auto rounded bg-blue-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-500/90 ${
                    loading || isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loading ? "Updating..." : "Update Post"}
                </button>
              </div>
            </form>
          </div>
          <MarkdownRules />
        </div>
      </main>
    </>
  );
}

export default EditPost;

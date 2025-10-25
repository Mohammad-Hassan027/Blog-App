import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { useCreatePost } from "../../hooks/blogHooks";
import { getImageDataUrl } from "../../utils/image";
import MarkdownRules from "../../components/MarkdownRules";
import MarkdownEditor from "../../components/MarkdownEditor";
import generateDescription from "../../utils/genDesc";

const MAX_TAGS = 5;
const MAX_IMAGE_SIZE_MB = 5;

function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    mutateAsync: createPost,
    isLoading: loading,
    error,
  } = useCreatePost();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null); // File object
  const [isUploading, setIsUploading] = useState(false); // Only tracks local file processing
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [tags, setTags] = useState([]);

  const isActionActive = loading || isUploading;
  const isFileDisabled = !!imageUrl || isActionActive;

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

  const clearImageStates = () => {
    setImageUrl("");
    setUploadedFile(null);
    setImagePreview("");
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
    if (url) {
      setUploadedFile(null);
    }
    setFormError("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setFormError(`Image must be less than ${MAX_IMAGE_SIZE_MB}MB`);
      e.target.value = null;
      clearImageStates();
      return;
    }

    setIsUploading(true);
    setFormError("");
    setImageUrl("");

    try {
      const preview = await getImageDataUrl(file);
      setImagePreview(preview);
      setUploadedFile(file);
    } catch (err) {
      console.error(err);
      setFormError("Failed to preview image. Please try again.");
      setUploadedFile(null);
      setImagePreview("");
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

  const handleSubmit = async (e, status = "published") => {
    e.preventDefault();
    setFormError("");

    if (!title.trim() || !content.trim()) {
      setFormError("Title and content are required.");
      return;
    }

    if (isUploading) {
      setFormError("Please wait for the image processing to complete.");
      return;
    }

    if (imageUrl && !imageUrl.match(/^https?:\/\/.+/)) {
      setFormError("The image URL must start with http:// or https://");
      return;
    }

    try {
      const description = generateDescription(content);

      const postData = {
        title: title.trim(),
        content: content,
        description,
        author: user.displayName || user.email,
        createdAt: new Date().toISOString(),
        tag: tags,
        status: status,
      };

      let formData = null;

      if (uploadedFile) {
        formData = new FormData();
        formData.append("image", uploadedFile);
        Object.entries(postData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, item));
          } else {
            formData.append(key, value);
          }
        });
      } else if (imageUrl) {
        postData.imageUrl = imageUrl;
      }

      await createPost(formData || postData);
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
            <form
              className="space-y-4 sm:space-y-6"
              onSubmit={(e) => handleSubmit(e, "published")}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="tags">
                  Tags
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    id="tags"
                    className={`form-select rounded border-0 bg-[#e3e8ed]/50 p-3 text-sm ring-1 ring-inset ring-[#1c2834]/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-[#e3e8ed]/5 dark:ring-white/10 dark:focus:ring-blue-500 ${
                      isActionActive ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    value=""
                    onChange={handleTagChange}
                    disabled={tags.length >= MAX_TAGS || isActionActive}
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
                          className={`ml-1 text-blue-500 hover:text-blue-700 focus:outline-none ${
                            isActionActive
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          aria-label={`Remove ${tag}`}
                          onClick={() => handleTagRemove(tag)}
                          disabled={isActionActive}
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
                    className={`form-input w-full rounded border-0 bg-[#e3e8ed]/50 p-3 text-sm placeholder:text-[#566879]/70 ring-1 ring-inset ring-[#1c2834]/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-[#e3e8ed]/5 dark:ring-white/10 dark:focus:ring-blue-500 ${
                      isActionActive ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    id="title"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isActionActive}
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
                        className={`form-input w-full rounded border-0 bg-[#e3e8ed]/50 p-3 text-sm placeholder:text-[#566879]/70 ring-1 ring-inset ring-[#1c2834]/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-[#e3e8ed]/5 dark:ring-white/10 dark:focus:ring-blue-500 ${
                          isActionActive ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        type="url"
                        placeholder="Enter image URL or upload a file"
                        value={imageUrl}
                        onChange={handleImageUrlChange}
                        disabled={!!uploadedFile || isActionActive}
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        id="image-upload"
                        className={`hidden`}
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isFileDisabled} // Already correct
                      />
                      <label
                        htmlFor="image-upload"
                        className={`inline-flex items-center px-4 py-3 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium ${
                          // Updated conditional class check:
                          isFileDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:bg-gray-200"
                        }`}
                      >
                        {isUploading ? "Processing..." : "Upload"}
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
                      className={`absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition ${
                        isActionActive ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      aria-label="Remove image"
                      onClick={clearImageStates}
                      disabled={isActionActive}
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>
              <MarkdownEditor
                value={content}
                onChange={(e) => setContent(e.target.value)}
                loading={loading}
                isUploading={isUploading}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "draft")}
                  disabled={isActionActive}
                  className={`w-full sm:w-auto rounded bg-gray-200 px-6 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-300 ${
                    isActionActive ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Saving..." : "Save Draft"}
                </button>
                <button
                  type="submit"
                  disabled={isActionActive}
                  className={`w-full sm:w-auto rounded bg-blue-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-500/90 ${
                    isActionActive ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Publishing..." : "Publish"}
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

export default CreatePost;

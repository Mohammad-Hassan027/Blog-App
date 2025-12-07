import { Link, useParams } from "react-router-dom";

import { useComments } from "../../hooks/commentHooks";
import { usePost } from "../../hooks/blogHooks";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loader from "../../components/Loader";
import PostFooter from "../../components/PostFooter";
import CommentSection from "../../components/CommentSection";

function SinglePost() {
  const { id } = useParams();

  const {
    data: currentBlog,
    isLoading: isPostLoading,
    error: postError,
    isError: isPostError,
  } = usePost(id);

  const { data: commentsData, isLoading: isCommentsLoading } = useComments(id);

  const isLoading = isPostLoading || isCommentsLoading;

  if (isLoading) {
    return (
      <div className="p-2 sm:p-4 md:p-8 flex flex-col justify-center item-center text-center">
        <Loader />
        <p className="animate-pulse mt-2 text-sm text-gray-500">
          Loading posts...
        </p>
      </div>
    );
  }

  if (
    isPostError &&
    postError?.status === 403 // Assuming the error object contains a 'status' property
  ) {
    return (
      <div className="p-8 md:p-15 flex flex-col justify-center item-center">
        <div className="text-red-500 text-2xl md:text-4xl">
          Unauthorized: Login required to view this draft.
        </div>
        <div className="py-4 text-xl md:text-2xl">
          Error is due to refresh. Maintenance is in progress 🚧🚧🚧
        </div>
      </div>
    );
  }

  if (isPostError || !currentBlog) {
    return (
      <div className="p-8 md:p-15 flex justify-center item-center">
        <div className="text-red-500 text-2xl md:text-4xl">
          {isPostError && postError?.message
            ? `Error loading blog: ${postError.message}`
            : "Can't load blog, refresh!"}
        </div>
      </div>
    );
  }

  const { title, author, createdAt, imageUrl, content, authorUID } =
    currentBlog;

  return (
    <main className="flex-1 w-full">
      <div className="max-w-3xl px-4 py-8 mx-auto sm:px-6 sm:py-12">
        <article className="flex flex-col gap-6">
          <header>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link
                className="hover:text-amber-500 dark:hover:text-amber-500"
                to={"/all-posts"}
              >
                Browse All Posts
              </Link>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              {title ? title : "The Future of AI in Software Development"}
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              Published by {author || "Sarah"} on{" "}
              {new Date(createdAt).toLocaleString()}
            </p>
          </header>
          <picture className="flex aspect-video place-content-center">
            <img
              className="object-contain"
              src={imageUrl}
              alt="Post thumbnail"
              loading="lazy"
            />
          </picture>
          <div className="prose prose-lg max-w-none markdown-container">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
          <PostFooter />
        </article>
        <CommentSection
          id={id}
          BlogAuthorUID={authorUID}
          comments={commentsData || []}
        />
      </div>
    </main>
  );
}

export default SinglePost;

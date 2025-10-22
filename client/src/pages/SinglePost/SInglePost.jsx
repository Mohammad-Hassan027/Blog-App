import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useBlogStore from "../../store/useBlogStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loader from "../../components/Loader";
import PostFooter from "../../components/PostFooter";
import CommentSection from "../../components/CommentSection";

function SinglePost() {
  const { id } = useParams();
  const currentBlog = useBlogStore((state) => state.currentBlog);
  const fetchBlogById = useBlogStore((state) => state.fetchBlogById);

  const commentsMap = useBlogStore((state) => state.getCommentsFor);

  useEffect(() => {
    fetchBlogById(id);
    commentsMap(id);
  }, [id, fetchBlogById, commentsMap]);

  if (!currentBlog) {
    return (
      <div className="flex justify-center item-center">
        <Loader />
      </div>
    );
  }

  const { title, author, createdAt, imageUrl, content } = currentBlog;

  return (
    <main className="flex-1 w-full">
      <div className="max-w-3xl px-4 py-8 mx-auto sm:px-6 sm:py-12">
        <article className="flex flex-col gap-6">
          <header>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link
                className="hover:text-blue-500 dark:hover:text-blue-500"
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
              alt="image"
              loading="lazy"
            />
          </picture>
          <div className="prose prose-lg max-w-none markdown-container">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
          <PostFooter />
        </article>
        <CommentSection id={id} author={author} />
      </div>
    </main>
  );
}

export default SinglePost;

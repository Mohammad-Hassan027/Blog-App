import { useEffect, useState } from "react";

// shared frozen empty array used as a stable fallback for comment selectors
const EMPTY_COMMENTS = Object.freeze([]);
import { Link, useParams } from "react-router-dom";
import useBlogStore from "../../store/useBlogStore";
import useAuthStore from "../../store/useAuthStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loader from "../../components/Loader";

function SinglePost() {
  const { id } = useParams();
  const currentBlog = useBlogStore((state) => state.currentBlog);
  const fetchBlogById = useBlogStore((state) => state.fetchBlogById);

  // select the comments map (stable reference) and derive per-post comments locally
  const commentsMap = useBlogStore((state) => state.comments);
  const comments =
    commentsMap && commentsMap[String(id)]
      ? commentsMap[String(id)]
      : EMPTY_COMMENTS;
  const addComment = useBlogStore((state) => state.addComment);
  const deleteComment = useBlogStore((state) => state.deleteComment);

  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchBlogById(id);
  }, [id, fetchBlogById]);

  // when user changes, prefill the author field with their display name/email
  useEffect(() => {
    if (user) {
      setCommentAuthor(user.displayName || user.email || "");
    }
  }, [user]);

  if (!currentBlog) {
    return (
      <div className="flex item-center justify-center">
        <Loader />
      </div>
    );
  }

  const { title, author, createdAt, imageUrl, content } = currentBlog;

  // combine persisted comments (from zustand) with any comments on the blog object (fallback)
  const displayedComments =
    comments && comments.length > 0 ? comments : currentBlog.comments || [];
  return (
    <main className="w-full flex-1">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
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
          <picture className="aspect-video place-content-center flex">
            <img className="object-contain" src={imageUrl} alt="image" />
          </picture>

          {/* <div
            className="aspect-video w-full rounded-lg bg-cover bg-center bg-no-repeat object-cover"
            style={{
              backgroundImage: `url("${imageUrl}")`,
            }}
          ></div> */}
          <div className="prose prose-lg max-w-none markdown-container">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>

          <footer className="mt-6 flex items-center gap-4 border-t border-gray-200 pt-6">
            <button className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-500/20 ">
              <svg
                fill="currentColor"
                height="18"
                viewBox="0 0 256 256"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M128,216S28,160,28,92A52,52,0,0,1,80,40a52,52,0,0,1,48,42.42A52,52,0,0,1,176,40a52,52,0,0,1,52,52C228,160,128,216,128,216Z"></path>
              </svg>
              <span>23</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 ">
              <svg
                fill="currentColor"
                height="18"
                viewBox="0 0 256 256"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,211a12,12,0,0,0,15.09,15.09l34.1-11.35A104,104,0,1,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-40-88a12,12,0,1,1,12,12A12,12,0,0,1,88,128Zm40,0a12,12,0,1,1,12,12A12,12,0,0,1,128,128Zm40,0a12,12,0,1,1,12,12A12,12,0,0,1,168,128Z"></path>
              </svg>
              <span>12</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 ">
              <svg
                fill="currentColor"
                height="18"
                viewBox="0 0 256 256"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"></path>
              </svg>
              <span>5</span>
            </button>
          </footer>
        </article>
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
          <div className="mt-6 flex flex-col gap-6">
            {displayedComments.length === 0 ? (
              <p className="text-sm text-gray-500">
                No comments yet. Be the first to comment.
              </p>
            ) : (
              displayedComments.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-start gap-4 ${
                    c.parentId ? "pl-14" : ""
                  }`}
                >
                  <div
                    className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: c.avatar
                        ? `url("${c.avatar}")`
                        : 'url("https://www.gravatar.com/avatar/?d=mp")',
                    }}
                  ></div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {c.author}
                      </p>
                      <p className="text-xs text-gray-500">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleString()
                          : c.date || ""}
                      </p>
                    </div>
                    <p className="mt-1 text-base text-gray-700">{c.text}</p>
                    {(user?.email === c.author || user?.email === author) && (
                      <button
                        onClick={() => deleteComment(id, c._id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-8 flex items-start gap-3">
            <div
              className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  user && user.photoURL
                    ? `url("${user.photoURL}")`
                    : 'url("https://www.gravatar.com/avatar/?d=mp")',
              }}
            ></div>
            <div className="flex w-full flex-col @container">
              <input
                value={commentAuthor}
                onChange={(e) => {
                  // allow editing name only when not logged in
                  if (!user) setCommentAuthor(e.target.value);
                }}
                className="mb-2 rounded-md border-gray-300 p-2 text-sm"
                placeholder={user ? "Signed in user" : "Your name (optional)"}
                readOnly={!!user}
              />
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="form-textarea w-full resize-none rounded-lg border-gray-300 bg-white p-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                placeholder="Add a comment..."
                rows="3"
              ></textarea>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => {
                    const text = commentText.trim();
                    if (!text) return;
                    // pass only the text; the store will attach the authenticated user's
                    // name/avatar when available (useBlogStore.addComment)
                    addComment(id, { text });
                    setCommentText("");
                    if (!user) setCommentAuthor("");
                  }}
                  className="h-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default SinglePost;

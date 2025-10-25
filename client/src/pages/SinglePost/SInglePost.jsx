// import { useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import useBlogStore from "../../store/useBlogStore";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import Loader from "../../components/Loader";
// import PostFooter from "../../components/PostFooter";
// import CommentSection from "../../components/CommentSection";

// function SinglePost() {
//   const { id } = useParams();
//   const { loading, currentBlog, error } = useBlogStore();
//   const fetchBlogById = useBlogStore((state) => state.fetchBlogById);
//   const commentsMap = useBlogStore((state) => state.getCommentsFor);

//   useEffect(() => {
//     if (!id) return;
//     fetchBlogById(id);
//     commentsMap(id);
//   }, [id, fetchBlogById, commentsMap]);

//   if (loading) {
//     return (
//       <div className="flex justify-center item-center">
//         <Loader />
//       </div>
//     );
//   }

//   if (
//     !loading &&
//     !currentBlog &&
//     error?.message === "Unauthorized: This draft post requires authentication."
//   ) {
//     return (
//       <div className="p-8 md:p-15 flex flex-col justify-center item-center">
//         <div className="text-red-500 text-2xl md:text-4xl">
//           Unauthorized: Login required to view this draft , IF already logged
//           in. Go to dashboard then come on this through navigation
//         </div>
//         <div className="py-4 text-xl md:text-2xl">
//           Error is due to refresh. Maintains is in progress 🚧🚧🚧
//         </div>
//       </div>
//     );
//   }

//   if (
//     !currentBlog &&
//     error?.message !==
//       "Unauthorized: This draft post requires authentication." &&
//     !loading
//   ) {
//     return (
//       <div className="p-8 md:p-15 flex justify-center item-center">
//         <div className="text-red-500 text-2xl md:text-4xl">
//           Can't load blog , refresh!
//         </div>
//       </div>
//     );
//   }

//   const { title, author, createdAt, imageUrl, content } = currentBlog;

//   return (
//     <main className="flex-1 w-full">
//       <div className="max-w-3xl px-4 py-8 mx-auto sm:px-6 sm:py-12">
//         <article className="flex flex-col gap-6">
//           <header>
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <Link
//                 className="hover:text-blue-500 dark:hover:text-blue-500"
//                 to={"/all-posts"}
//               >
//                 Browse All Posts
//               </Link>
//             </div>
//             <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
//               {title ? title : "The Future of AI in Software Development"}
//             </h1>
//             <p className="mt-3 text-sm text-gray-500">
//               Published by {author || "Sarah"} on{" "}
//               {new Date(createdAt).toLocaleString()}
//             </p>
//           </header>
//           <picture className="flex aspect-video place-content-center">
//             <img
//               className="object-contain"
//               src={imageUrl}
//               alt="image"
//               loading="lazy"
//             />
//           </picture>
//           <div className="prose prose-lg max-w-none markdown-container">
//             <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
//           </div>
//           <PostFooter />
//         </article>
//         <CommentSection id={id} author={author} />
//       </div>
//     </main>
//   );
// }

// export default SinglePost;

import { Link, useParams } from "react-router-dom";
// The following imports are removed as server state and actions are now handled by TanStack Query hooks:
// import useBlogStore from "../../store/useBlogStore";
// import { useEffect } from "react";

// Import the custom TanStack Query hooks
import { useComments } from "../../hooks/commentHooks";
import { usePost } from "../../hooks/blogHooks";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loader from "../../components/Loader";
import PostFooter from "../../components/PostFooter";
import CommentSection from "../../components/CommentSection";

function SinglePost() {
  const { id } = useParams();

  // 1. Fetch Post Data using TanStack Query hook
  const {
    data: currentBlog,
    isLoading: isPostLoading,
    error: postError,
    isError: isPostError,
  } = usePost(id);

  // 2. Fetch Comments Data using TanStack Query hook
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    // Note: isCommentsError is generally handled inside CommentSection,
    // but we use its data here.
  } = useComments(id);

  // Combine loading states for the initial full-page loader
  const isLoading = isPostLoading || isCommentsLoading;

  // 3. Update Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center item-center">
        <Loader />
      </div>
    );
  }

  // 4. Update Error Handling Logic (Unauthorized/403)
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

  // 5. Update General Error / Not Found Error
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

  // Data is guaranteed to be available here
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
              alt="Post thumbnail"
              loading="lazy"
            />
          </picture>
          <div className="prose prose-lg max-w-none markdown-container">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
          <PostFooter />
        </article>
        {/* Pass fetched comments data to CommentSection */}
        <CommentSection id={id} author={author} comments={commentsData || []} />
      </div>
    </main>
  );
}

export default SinglePost;

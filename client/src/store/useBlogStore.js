// import { create } from "zustand";
// import * as postApi from "../services/blogService";
// import useAuthStore from "./useAuthStore";
// import avater from "../assets/avatar.png";

// const useBlogStore = create((set) => ({
//   blogs: [],
//   currentBlog: null,
//   loading: false,
//   totalPosts: 0,
//   currentPage: 1,
//   totalPages: 1,
//   error: null,
//   currentBlogComments: [],

//   setLoading: (loading) => set({ loading }),
//   setError: (error) => set({ error }),

//   fetchBlogs: async (page = 1, limit = 6) => {
//     try {
//       set({ loading: true, error: null });
//       const { blogs, totalPosts, currentPage, totalPages } =
//         await postApi.getAllPosts(page, limit);
//       set({ blogs, totalPosts, currentPage, totalPages, loading: false });
//     } catch (error) {
//       console.error("Failed to fetch blogs:", error);
//       set({ error: error.message, loading: false });
//     }
//   },

//   fetchMyBlogs: async () => {
//     try {
//       set({ loading: true, error: null });
//       const blogs = await postApi.getMyPosts();
//       set({ blogs, loading: false });
//     } catch (error) {
//       console.error("Failed to fetch user blogs:", error);
//       set({ error: error.message, loading: false });
//     }
//   },

//   fetchBlogById: async (id) => {
//     try {
//       set({ loading: true, error: null });
//       const blog = await postApi.getPost(id);
//       set({ currentBlog: blog, loading: false });
//       return blog;
//     } catch (error) {
//       if (error.status === 403) {
//         set({
//           error: {
//             message: "Unauthorized: This draft post requires authentication.",
//           },
//           loading: false,
//         });
//         return;
//       }
//       console.error("Failed to fetch blog:", error);
//       set({ error: error.message, loading: false });
//       throw error;
//     }
//   },

//   createPost: async (postData) => {
//     try {
//       set({ loading: true, error: null });
//       const newPost = await postApi.createPost(postData);
//       set((state) => ({
//         blogs: [newPost, ...state.blogs],
//         loading: false,
//       }));
//       return newPost;
//     } catch (error) {
//       console.error("Failed to create post:", error);
//       set({ error: error.message, loading: false });
//       throw error;
//     }
//   },

//   updatePost: async (id, postData) => {
//     try {
//       set({ loading: true, error: null });
//       const updatedPost = await postApi.updatePost(id, postData);
//       set((state) => ({
//         blogs: state.blogs.map((blog) => {
//           const bid = blog._id || blog.id;
//           return bid === id ? updatedPost : blog;
//         }),
//         currentBlog:
//           (state.currentBlog?._id || state.currentBlog?.id) === id
//             ? updatedPost
//             : state.currentBlog,
//         loading: false,
//       }));
//       return updatedPost;
//     } catch (error) {
//       console.error("Failed to update post:", error);
//       set({ error: error.message, loading: false });
//       throw error;
//     }
//   },

//   deletePost: async (id) => {
//     try {
//       set({ loading: true, error: null });
//       await postApi.deletePost(id);
//       set((state) => ({
//         blogs: state.blogs.filter((blog) => {
//           const bid = blog._id;
//           return bid !== id;
//         }),
//         currentBlog: state.currentBlog?._id === id ? null : state.currentBlog,
//         loading: false,
//       }));
//     } catch (error) {
//       console.error("Failed to delete post:", error);
//       set({ error: error.message, loading: false });
//       throw error;
//     }
//   },

//   addComment: async (blogId, comment) => {
//     try {
//       set({ loading: true, error: null });
//       const newComment = await postApi.addComment(blogId, {
//         ...comment,
//         author: useAuthStore.getState().user?.displayName || "Anonymous",
//         avatar: useAuthStore.getState().user?.photoURL || avater,
//         createdAt: new Date().toISOString(),
//       });

//       set((state) => {
//         const blog = state.currentBlog;
//         const cbid = blog ? blog._id || blog.id : null;
//         if (blog && String(cbid) === String(blogId)) {
//           return {
//             currentBlogComments: [
//               newComment,
//               ...(state.currentBlogComments || []),
//             ],
//             loading: false,
//           };
//         }
//         return { loading: false };
//       });
//       return newComment;
//     } catch (error) {
//       console.error("Failed to add comment:", error);
//       set({ error: error.message, loading: false });
//       throw error;
//     }
//   },

//   getCommentsFor: async (blogId) => {
//     try {
//       const comments = await postApi.getComments(blogId);
//       set(() => ({
//         currentBlogComments: comments,
//       }));
//       return comments;
//     } catch (error) {
//       console.error("Failed to fetch comments:", error);
//       return [];
//     }
//   },

//   deleteComment: async (blogId, commentId) => {
//     try {
//       set({ loading: true, error: null });
//       await postApi.deleteComment(commentId);
//       set((state) => {
//         const blog = state.currentBlog;
//         const cbid = blog ? blog._id : null;
//         if (blog && String(cbid) === String(blogId)) {
//           return {
//             currentBlogComments: state.currentBlogComments.filter((comment) => {
//               return commentId !== comment._id;
//             }),
//             loading: false,
//           };
//         }
//         return { loading: false };
//       });
//     } catch (error) {
//       console.error("Failed to delete comment:", error);
//       set({ error: error.message, loading: false });
//       throw error;
//     }
//   },
// }));

// export default useBlogStore;

import { create } from "zustand";
// import * as postApi from "../services/blogService"; // NO LONGER NEEDED
// import useAuthStore from "./useAuthStore"; // NO LONGER NEEDED for data fetching
// import avater from "../assets/avatar.png"; // NO LONGER NEEDED

const useBlogStore = create((set) => ({
  // --- STATE PROPERTIES DELEGATED TO TANSTACK QUERY ---
  // blogs: [],
  // currentBlog: null,
  // loading: false,
  // totalPosts: 0,
  // currentPage: 1,
  // totalPages: 1,
  // error: null,
  // currentBlogComments: [],

  // --- EXAMPLE CLIENT-SIDE STATE (Optional, based on need) ---
  // We keep the current pagination state here, but the data is fetched via TanStack Query.
  blogListPage: 1,

  // --- ACTIONS ---

  setBlogListPage: (page) => set({ blogListPage: page }),

  // ALL ASYNCHRONOUS FUNCTIONS (fetchBlogs, createPost, addComment, etc.)
  // ARE REMOVED and must now be handled by the hooks in blogHooks.js

  // The state setters for loading and error are also removed as they are
  // managed automatically by TanStack Query hooks (e.g., usePosts.isLoading)
}));

export default useBlogStore;

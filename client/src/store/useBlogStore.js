import { create } from "zustand";
import * as postApi from "../services/postApi";
import useAuthStore from "./useAuthStore";
import avater from "../assets/avater.png";
// import { avater } from "..";

const useBlogStore = create((set, get) => ({
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchBlogs: async () => {
    try {
      set({ loading: true, error: null });
      const blogs = await postApi.getAllPosts();
      set({ blogs, loading: false });
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      set({ error: error.message, loading: false });
    }
  },

  fetchMyBlogs: async () => {
    try {
      set({ loading: true, error: null });
      const blogs = await postApi.getMyPosts();
      set({ blogs, loading: false });
    } catch (error) {
      console.error("Failed to fetch user blogs:", error);
      set({ error: error.message, loading: false });
    }
  },

  fetchBlogById: async (id) => {
    try {
      set({ loading: true, error: null });
      const blog = await postApi.getPost(id);
      set({ currentBlog: blog, loading: false });
      return blog;
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  createPost: async (postData) => {
    try {
      set({ loading: true, error: null });
      const newPost = await postApi.createPost(postData);
      set((state) => ({
        blogs: [newPost, ...state.blogs],
        loading: false,
      }));
      return newPost;
    } catch (error) {
      console.error("Failed to create post:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    try {
      set({ loading: true, error: null });
      const updatedPost = await postApi.updatePost(id, postData);
      set((state) => ({
        blogs: state.blogs.map((blog) => {
          const bid = blog._id || blog.id;
          return bid === id ? updatedPost : blog;
        }),
        currentBlog:
          (state.currentBlog?._id || state.currentBlog?.id) === id
            ? updatedPost
            : state.currentBlog,
        loading: false,
      }));
      return updatedPost;
    } catch (error) {
      console.error("Failed to update post:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      set({ loading: true, error: null });
      await postApi.deletePost(id);
      set((state) => ({
        blogs: state.blogs.filter((blog) => {
          const bid = blog._id || blog.id;
          return bid !== id;
        }),
        currentBlog:
          (state.currentBlog?._id || state.currentBlog?.id) === id
            ? null
            : state.currentBlog,
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to delete post:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  addComment: async (blogId, comment) => {
    try {
      set({ loading: true, error: null });
      const newComment = await postApi.addComment(blogId, {
        ...comment,
        author: useAuthStore.getState().user?.displayName || "Anonymous",
        avatar: useAuthStore.getState().user?.photoURL || avater,
        createdAt: new Date().toISOString(),
      });

      set((state) => {
        const blog = state.currentBlog;
        const cbid = blog ? blog._id || blog.id : null;
        if (blog && String(cbid) === String(blogId)) {
          return {
            currentBlog: {
              ...blog,
              comments: [newComment, ...(blog.comments || [])],
            },
            loading: false,
          };
        }
        return { loading: false };
      });
      return newComment;
    } catch (error) {
      console.error("Failed to add comment:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getCommentsFor: async (blogId) => {
    try {
      const comments = await postApi.getComments(blogId);
      return comments;
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      return [];
    }
  },

  deleteComment: async (blogId, commentId) => {
    try {
      set({ loading: true, error: null });
      await postApi.deleteComment(blogId, commentId);
      set((state) => {
        const blog = state.currentBlog;
        const cbid = blog ? blog._id || blog.id : null;
        if (blog && String(cbid) === String(blogId)) {
          return {
            currentBlog: {
              ...blog,
              comments: blog.comments.filter((c) => c.id !== commentId),
            },
            loading: false,
          };
        }
        return { loading: false };
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));

export default useBlogStore;

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} from "../services/blogService";

const queryKeys = {
  posts: (page = 1, limit = 10) => ["posts", { page, limit }],
  myPosts: ["my-posts"],
  post: (id) => ["post", id],
  comments: (postId) => ["comments", postId],
};

export function usePosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.posts(page, limit),
    queryFn: () => getAllPosts(page, limit),
  });
}

export function useMyPosts() {
  return useQuery({
    queryKey: queryKeys.myPosts,
    queryFn: getMyPosts,
  });
}

export function usePost(id, options = {}) {
  return useQuery({
    queryKey: queryKeys.post(id),
    queryFn: async () => {
      try {
        return await getPost(id);
      } catch (error) {
        if (error.status === 403) {
          throw new Error("You don't have permission to view this post");
        }
        throw error;
      }
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidate all post listings to show the new post
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.myPosts });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, postData }) => updatePost(id, postData),
    onSuccess: (_, variables) => {
      // Invalidate the specific post and all general post listings
      queryClient.invalidateQueries({ queryKey: queryKeys.post(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.myPosts });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // Invalidate all post listings where the deleted post might appear
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.myPosts });
    },
  });
}

// Export the query keys for use in other parts of the application (e.g., custom invalidation)
export { queryKeys };

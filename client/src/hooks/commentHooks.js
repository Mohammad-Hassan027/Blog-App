import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getComments,
  addComment,
  deleteComment,
} from "../services/blogService";
import { queryKeys } from "./blogHooks";

/**
 * Fetches comments for a specific post.
 */
export function useComments(postId) {
  return useQuery({
    queryKey: queryKeys.comments(postId),
    queryFn: async () => {
      try {
        return await getComments(postId);
      } catch (error) {
        // If the post is a draft or inaccessible, comments should not be available
        if (error.status === 403) {
          throw new Error("Comments are not available for this post");
        }
        throw error;
      }
    },
    enabled: !!postId,
  });
}

/**
 * Adds a comment to a post.
 */
export function useAddComment(postId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comment) => {
      try {
        return await addComment(postId, comment);
      } catch (error) {
        // Prevent commenting on draft or inaccessible posts
        if (error.status === 403) {
          throw new Error("You cannot comment on this post");
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate the specific post's comments list
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(postId) });
    },
  });
}

/**
 * Deletes a comment.
 */
export function useDeleteComment(postId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment, // mutationFn receives the commentId
    onSuccess: () => {
      // Invalidate the specific post's comments list
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(postId) });
    },
  });
}

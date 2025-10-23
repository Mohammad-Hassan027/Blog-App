import { fetchWithAuth } from "./api";
import { buildPostDataPayload } from "../utils/buildPostDataPayload";

export async function getAllPosts(page, limit) {
  const query = page || limit ? `?page=${page || 1}&limit=${limit || 10}` : "";
  return fetchWithAuth(`/api/blogs${query}`);
}

export async function getMyPosts() {
  return fetchWithAuth("/api/blogs/my-posts");
}

export async function getPost(id) {
  return fetchWithAuth(`/api/blogs/${id}`);
}

export async function createPost(postData) {
  const { body, headers } = buildPostDataPayload(postData);

  return fetchWithAuth("/api/blogs", {
    method: "POST",
    headers: headers,
    body: body,
  });
}

export async function updatePost(id, postData) {
  const { body, headers } = buildPostDataPayload(postData);

  return fetchWithAuth(`/api/blogs/${id}`, {
    method: "PUT",
    headers: headers,
    body: body,
  });
}

export async function deletePost(id) {
  return fetchWithAuth(`/api/blogs/${id}`, {
    method: "DELETE",
  });
}

export async function addComment(postId, comment) {
  // Server exposes comments under /api/comments and expects blogId in the body
  return fetchWithAuth(`/api/comments`, {
    method: "POST",
    body: JSON.stringify({ blogId: postId, ...comment }),
  });
}

export async function getComments(postId) {
  return fetchWithAuth(`/api/comments?blogId=${postId}`);
}

export async function deleteComment(commentId) {
  return fetchWithAuth(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
}

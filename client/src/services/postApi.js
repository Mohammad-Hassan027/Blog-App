import { fetchWithAuth } from "./api";

export async function getAllPosts(page, limit) {
  // This fetches only PUBLISHED posts for public pages
  const query = page || limit ? `?page=${page || 1}&limit=${limit || 10}` : "";
  return fetchWithAuth(`/api/blogs${query}`);
}

export async function getMyPosts() {
  // This fetches ALL posts (published and drafts) for the logged-in user
  return fetchWithAuth("/api/blogs/my-posts");
}

export async function getPost(id) {
  return fetchWithAuth(`/api/blogs/${id}`);
}

export async function createPost(postData) {
  // If caller passed a FormData instance directly, send it as-is
  if (postData instanceof FormData) {
    return fetchWithAuth("/api/blogs", {
      method: "POST",
      headers: {},
      body: postData,
    });
  }

  // If we have a file property on the object, build FormData
  if (postData && postData.file) {
    const formData = new FormData();
    formData.append("image", postData.file); // 'image' matches multer field name

    // Append other fields
    Object.keys(postData).forEach((key) => {
      if (key !== "file") {
        // Handle arrays (like tags) properly
        if (Array.isArray(postData[key])) {
          formData.append(key, JSON.stringify(postData[key]));
        } else {
          formData.append(key, postData[key]);
        }
      }
    });

    return fetchWithAuth("/api/blogs", {
      method: "POST",
      // Don't set Content-Type - browser will set it with boundary
      headers: {},
      body: formData,
    });
  }

  // No file, use JSON
  const { file: _file, ...dataWithoutFile } = postData || {};
  return fetchWithAuth("/api/blogs", {
    method: "POST",
    body: JSON.stringify(dataWithoutFile),
  });
}

export async function updatePost(id, postData) {
  // If caller passed a FormData instance directly, send it as-is
  if (postData instanceof FormData) {
    return fetchWithAuth(`/api/blogs/${id}`, {
      method: "PUT",
      headers: {},
      body: postData,
    });
  }

  // If we have a file property on the object, build FormData
  if (postData && postData.file) {
    const formData = new FormData();
    formData.append("image", postData.file);

    Object.keys(postData).forEach((key) => {
      if (key !== "file") {
        if (Array.isArray(postData[key])) {
          formData.append(key, JSON.stringify(postData[key]));
        } else {
          formData.append(key, postData[key]);
        }
      }
    });

    return fetchWithAuth(`/api/blogs/${id}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  }

  // No file, use JSON
  const { file: _file, ...dataWithoutFile } = postData || {};
  return fetchWithAuth(`/api/blogs/${id}`, {
    method: "PUT",
    body: JSON.stringify(dataWithoutFile),
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

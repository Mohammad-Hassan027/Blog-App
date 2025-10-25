import { getAuth } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchWithAuth(endpoint, options = {}) {
  const auth = getAuth();
  const user = auth.currentUser;

  let headers = {
    ...options.headers,
  };

  // Only set Content-Type: application/json if we're not sending FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (user) {
    const token = await user.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // if (!response.ok) {
  //   const error = await response.json().catch(() => ({}));
  //   throw new Error(error.message || "Network response was not ok");
  // }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || "Network response was not ok");
    error.status = response.status;
    throw error;
  }

  // Return null for 204 No Content (e.g., successful DELETE)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

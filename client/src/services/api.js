import { getAuth } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // Update this with your backend URL

export async function fetchWithAuth(endpoint, options = {}) {
  const auth = getAuth();
  const user = auth.currentUser;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (user) {
    const token = await user.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Network response was not ok");
  }

  return response.json();
}

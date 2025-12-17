// Client-side helper that forwards uploads to the server upload endpoint.
// Server will upload to Cloudinary with server-side credentials and return
// an object { secure_url, public_id }.

import { fetchWithAuth } from "../services/api";

export async function uploadToCloudinary(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Use fetchWithAuth so the request targets API_BASE_URL and includes auth
    const json = await fetchWithAuth("/api/uploads", {
      method: "POST",
      body: formData,
    });

    return json; // { secure_url, public_id }
  } catch (err) {
    console.error("Error uploading file to server:/api/uploads", err);
    throw err;
  }
}

export async function deleteFromCloudinary(public_id) {
  try {
    return await fetchWithAuth("/api/uploads", {
      method: "DELETE",
      body: JSON.stringify({ public_id }),
    });
  } catch (err) {
    console.error("Error deleting image via server:/api/uploads", err);
    throw err;
  }
}

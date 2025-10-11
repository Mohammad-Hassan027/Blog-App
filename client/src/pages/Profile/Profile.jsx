import { useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import { uploadToCloudinary } from "../../utils/cloudinary";

export default function Profile() {
  const { user, updateProfile, loading, error } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      await updateProfile({ displayName, photoURL });
      alert("Profile updated successfully!");
    } catch (err) {
      setFormError(err.message || "Failed to update profile");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setFormError("");
      try {
        const url = await uploadToCloudinary(file);
        setPhotoURL(url);
      } catch (err) {
        setFormError("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Your Profile
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {(error || formError) && (
              <div className="p-4 border-l-4 border-red-400 bg-red-50">
                <p className="text-sm text-red-700">{error || formError}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700"
              >
                Display Name
              </label>
              <div className="mt-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="photoURL"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Picture URL
              </label>
              <div className="flex items-center mt-1">
                <input
                  id="photoURL"
                  name="photoURL"
                  type="url"
                  autoComplete="photo"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="image-upload"
                  className={`ml-2 inline-flex items-center px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer text-sm font-medium ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </label>
              </div>
              {photoURL && (
                <div className="mt-2">
                  <img
                    src={photoURL}
                    alt="Profile Preview"
                    className="object-cover w-20 h-20 rounded-full"
                  />
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

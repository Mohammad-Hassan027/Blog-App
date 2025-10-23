import { useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import { uploadToCloudinary } from "../../utils/cloudinary";

export default function Profile() {
  const { user, updateProfile, loading, error } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!displayName.trim()) {
      setFormError("Display name cannot be empty.");
      return;
    }

    if (isUploading) return;

    try {
      await updateProfile({ displayName, photoURL });
      setSuccessMessage("Profile updated successfully! 🎉");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setFormError(err.message || "Failed to update profile");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setFormError("");
      setSuccessMessage("");
      try {
        const url = await uploadToCloudinary(file);
        setPhotoURL(url);
      } catch (err) {
        setFormError("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
        e.target.value = null;
      }
    }
  };

  const isFormDisabled = loading || isUploading;

  return (
    <div className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Your Profile
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {(error || formError || successMessage) && (
              <div
                className={`p-4 border-l-4 ${
                  error || formError
                    ? "border-red-400 bg-red-50"
                    : "border-green-400 bg-green-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    error || formError ? "text-red-700" : "text-green-700"
                  }`}
                  role="alert"
                >
                  {error || formError || successMessage}
                </p>
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
                  disabled={isFormDisabled}
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
                  placeholder="Paste image URL or use the upload button"
                  disabled={isFormDisabled}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />

                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isFormDisabled}
                />
                <label
                  htmlFor="image-upload"
                  className={`ml-2 inline-flex items-center px-4 py-2 rounded-md bg-gray-100 cursor-pointer text-sm font-medium transition duration-150 ease-in-out whitespace-nowrap ${
                    isFormDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {isUploading
                    ? "Uploading..."
                    : photoURL
                    ? "Change"
                    : "Upload"}
                </label>
              </div>

              {photoURL && (
                <div className="flex items-center mt-2">
                  <img
                    src={photoURL}
                    alt="Profile Preview"
                    className="object-cover w-20 h-20 mr-4 rounded-full border border-gray-200 shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoURL("")}
                    className="text-sm text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                    disabled={isFormDisabled}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isFormDisabled}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out ${
                  isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
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
